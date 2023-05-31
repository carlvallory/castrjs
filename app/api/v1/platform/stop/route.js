import { castrApi } from "../../../../utils/castrApi";

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

  if(platform.rtmpServer.includes("youtube")) {

    const startData = await stopPlatform(streamData.stream.streamId, platform.platformId);
    console.log(startData);

    return new Response(startData.message);
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

async function stopPlatform(streamId, platformId) {
  let url = "/streams/"+streamId+"/platforms/"+platformId+"/disable";
  const { data } = await castrApi.patch(url);

  return data;
}