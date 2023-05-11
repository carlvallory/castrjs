import { sheetApi, SHEETID, APIKEY } from "../../../utils/sheetApi";
import { castrApi } from "../../../utils/castrApi";

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

  let url = "/spreadsheets/"+SHEETID+"/values/"+today+"!A1:C12?key="+APIKEY;

  const jsonData = await getJson(url);

  jsonData.values.forEach((row, index) => {
    if(index != 0) {
      if(row[0].split(":")[0] == hour && row[0].split(":")[1] == minute) {
        console.log("Start");
        console.log(row[2]);
        console.log(row[0]);

        status = true;
        init = true;
      }
    }
    if(index != 0) {
      if(row[1].split(":")[0] == hour && row[1].split(":")[1] == minute) {
        console.log("Stop");
        console.log(row[2]);
        console.log(row[0]);

        status = true;
        init = false;
      }
    }
  });

  if(status == true) {
    run = true;
    platformResult = await getUpdate(status, init, run);
    run = false;
    status = false;
  }

  console.log(platformResult.updated);

  return new Response(platformResult.updated);
  
}

export async function getUpdate(status, init, run) { 

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

  const streams = await getStreams();

  streams.forEach((stream) => {
    if(stream.name == "UNIVERSO TEST") {
      console.log(stream);
      
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

      });
      
    }
  });

  const platform = await getPlatforms(streamData.stream.streamId, platformData.platform.platformId);

  let platformObj = { updated: false };

  if(platform.rtmpServer.includes("youtube")) {

    if(Boolean(platformData.platform.platformEnable) == false && status == true && run == true && init == true) {
      platformObj = await startPlatform(streamData.stream.streamId, platform.platformId);
    }
  
    if(Boolean(platformData.platform.platformEnable) == true && status == true && run == true && init == false) {
      platformObj = await stopPlatform(streamData.stream.streamId, platform.platformId);
    }
    
    console.log(platformObj);

    return new Response(platformObj.message);
  } 

  return new Response(platformData.platform.platformId);
}

export async function getJson(url) {
  const { data } = await sheetApi.get(url);
  return data;
}

export async function getStreams() {
  const { data } = await castrApi.get('/streams');
  return data;
}

export async function getPlatforms(streamId, platformId) {
  let url = "/streams/"+streamId+"/platforms/"+platformId+"/ingest";
  const { data } = await castrApi.get(url);
  return data;
}

export async function startPlatform(streamId, platformId) {
  let url = "/streams/"+streamId+"/platforms/"+platformId+"/enable";
  const { data } = await castrApi.patch(url);
  return data;
}

export async function stopPlatform(streamId, platformId) {
  let url = "/streams/"+streamId+"/platforms/"+platformId+"/disable";
  const { data } = await castrApi.patch(url);
  return data;
}