import { sheetApi, SHEETID, APIKEY } from "../../../utils/sheetApi";
import { laratubeApi } from "../../../utils/laratubeApi";
import { castrApi } from "../../../utils/castrApi";
import { youtube } from "googleapis/build/src/apis/youtube";

const streamName = process.env.STREAM_NAME;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

export async function GET(request) {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const now = new Date();
  const today = dayNames[now.getDay()].toLowerCase();
  const time = now.getHours() + ':' + now.getMinutes();
  const hour = now.getHours();
  const minute = now.getMinutes();

  let status = false;
  let init = false;
  let run = false;
  let platformResult = { updated: false };
  let videoResource = { updated: false };
  let renamedVideo = false;
  
  let videoId = false;
  let newTitle = "";

  let url = "/spreadsheets/"+SHEETID+"/values/"+today+"!A1:C12?key="+APIKEY;

  const jsonData = await getJson(url);

  jsonData.values.forEach((row, index) => {
    if(index != 0) {
      if(row[0].split(":")[0] == hour && row[0].split(":")[1] == minute) {
        newTitle = row[2];
        status = true;
        init = true;
      }
    }
    if(index != 0) {
      if(row[1].split(":")[0] == hour && row[1].split(":")[1] == minute) {
        newTitle = row[2];
        status = true;
        init = false;
      }
    }
  });

  if(status == true) {
    run = true;
    platformResult = await getUpdate(status, init, run);

    if(platformResult.hasOwnProperty("youtube")) {
      if(platformResult.youtube.hasOwnProperty("channel")) {
        if(platformResult.youtube.channel.hasOwnProperty("url")) {
          videoResource = await getVideo(platformResult.youtube.channel.url);

          if(init == false) {
            renamedVideo = await renameVideo(videoResource.youtube.video.videoId, newTitle);
            console.log(renamedVideo);
          } else { 
            console.log(videoResource); 
          }
        } else {
          console.log("cant find the channel");
        }
      }
    }
    
    run = false;
    status = false;
  }

  return new Response(platformResult.updated);
  
}

async function getUpdate(status, init, run) { 

  const streamData = {
        stream: {
          streamId:     "",
          streamType:   "",
          streamEnable: "",
          streamName:   ""
        }
  };

  const platformData = {
    platform: {
      platformId:     "",
      platformEnable: "",
      platformName:   "",
      platformDate:   ""
    }
  };

  let platformObj = { 
    updated: false,
    youtube: {
        channel: {
          url: ""
        },
        video: {
            id: ""
        }
    } 
  };

  const streams = await getStreams();

  streams.forEach((stream) => {
    if(stream.name == streamName) {
      
      streamData.stream.streamId      = stream.id;
      streamData.stream.streamType    = stream.type;
      streamData.stream.streamEnable  = stream.enabled;
      streamData.stream.streamName    = stream.name;

      let platformsArray = Array.from(stream.platforms);

      platformsArray.forEach((platform) => {
        
          platformData.platform.platformId      = platform.id;
          platformData.platform.platformEnable  = platform.enabled;
          platformData.platform.platformName    = platform.name;
          platformData.platform.platformDate    = platform.creationTime;
          platformData.platform.youtubeUrl      = platform.oauthData.serviceChannelUrl;
          platformObj.youtube.channel.url       = platform.oauthData.serviceChannelUrl;
          platformObj.updated                   = false;
      });
      
    }
  });

  const platform = await getPlatforms(streamData.stream.streamId, platformData.platform.platformId);

  if(platform.rtmpServer.includes("youtube")) {

    if(Boolean(platformData.platform.platformEnable) == false && status == true && run == true && init == true) {
      platformObj = await startPlatform(streamData.stream.streamId, platform.platformId, platformObj);
    }
  
    if(Boolean(platformData.platform.platformEnable) == true && status == true && run == true && init == false) {
      platformObj = await stopPlatform(streamData.stream.streamId, platform.platformId, platformObj);
    }
    
    return platformObj;
  } 

  return platformObj;
}

async function getJson(url) {
  const { data } = await sheetApi.get(url);
  return data;
}

async function getStreams() {
  try {
    const { data } = await castrApi.get('/streams');
    return data;
  } catch (error) {
    console.error(error.response.data);
  }
}

async function getPlatforms(streamId, platformId) {
  try {
    let url = "/streams/"+streamId+"/platforms/"+platformId+"/ingest";
    const { data } = await castrApi.get(url);
    return data;
  } catch (error) {
    console.error(error.response.data);
  }
}

async function startPlatform(streamId, platformId, platformObj) {
  try {
    let url = "/streams/"+streamId+"/platforms/"+platformId+"/enable";
    const { data } = await castrApi.patch(url);
    platformObj.updated = data.updated;
    return platformObj;
  } catch (error) {
    console.error(error.response.data);
  }
}

async function stopPlatform(streamId, platformId, platformObj) {
  try {
    let url = "/streams/"+streamId+"/platforms/"+platformId+"/disable";
    const { data } = await castrApi.patch(url);
    platformObj.updated = data.updated;
    return platformObj;
  } catch (error) {
    console.error(error.response.data);
  }
}

async function getVideo(channelUrl) {
  try {
    let channelId = parseChannelUrl(channelUrl);
    const tubeResponse = await fetch(NEXTAUTH_URL+"/api/youtube/channel/list?id="+channelId);
    const { youtubeResponse } = await tubeResponse.json();
    return youtubeResponse;
  }  catch (error) {
    console.error(error.response.data);
  }
}

async function renameVideo(videoId, newTitle) {
  console.log(videoId);
  console.log(newTitle);
  let url = "/update-title?v="+videoId+"&title="+newTitle;
  const { data } = await laratubeApi.get(url);
  console.debug(data);

  return data;
}

function parseChannelUrl(channelURL) {
  const url = new URL(channelURL);
  const path = url.pathname;
  const lastPathSegment = path.split("/");
  return lastPathSegment[2];
}

function parseVideoUrl(videoURL) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = videoURL.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}