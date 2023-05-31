import { castrApi } from "../../../utils/castrApi";


export async function GET(request) {

  const streams = await getStreams();

  const streamData = {
        stream: {
          streamId:     "",
          streamType:   "",
          streamEnable: "",
          streamName:   "",
          platformId:   "",
          youtubeUrl:   ""
        }
  };

  streams.forEach((stream) => {
    if(stream.name == "UNIVERSO TEST") {
      console.log(stream);
      
      streamData.stream.streamId      = stream.id;
      streamData.stream.streamType    = stream.type;
      streamData.stream.streamEnable  = stream.enabled;
      streamData.stream.streamName    = stream.name;
      streamData.stream.platformId    = stream.platforms[0].id
      streamData.stream.youtubeUrl    = stream.platforms[0].oauthData.serviceChannelUrl;
    }
  });

  const platformData = await getPlatform(streamData.stream.streamId, streamData.stream.platformId);

  console.log(platformData);

  return new Response(streamData.stream.platformId);
  
}

async function getStreams() {
  const { data } = await castrApi.get('/streams');
  return data;
}

async function getPlatform(streamId, platformId) {
  let url = "/streams/"+streamId+"/platforms/"+platformId+"/ingest";
  const { data } = await castrApi.get(url);
  return data;
}
