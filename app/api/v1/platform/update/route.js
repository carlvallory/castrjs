import { castrApi } from "../../../../utils/castrApi";
import { laratubeApi } from "../../../../utils/laratubeApi";

export async function GET(request) {

  const streams = await getStreams();

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
  let platformObj;

  if(platform.rtmpServer.includes("youtube")) {

    if(Boolean(platformData.platform.platformEnable) == false) {
      platformObj = await startPlatform(streamData.stream.streamId, platform.platformId);
    }
  
    if(Boolean(platformData.platform.platformEnable) == true) {
      platformObj = await stopPlatform(streamData.stream.streamId, platform.platformId);
    }
    
    console.log(platformObj);

    return new Response(platformObj.message);
  } 

  return new Response(platformData.platform.platformId);
  
}

async function getStreams() {
  const { data } = await castrApi.get('/streams');
  return data;
}

async function getPlatforms(streamId, platformId) {
  let url = "/streams/"+streamId+"/platforms/"+platformId+"/ingest";
  const { data } = await castrApi.get(url);
  return data;
}

async function startPlatform(streamId, platformId) {
  let url = "/streams/"+streamId+"/platforms/"+platformId+"/enable";
  const { data } = await castrApi.patch(url);

  return data;
}

async function stopPlatform(streamId, platformId) {
  let url = "/streams/"+streamId+"/platforms/"+platformId+"/disable";
  const { data } = await castrApi.patch(url);

  return data;
}