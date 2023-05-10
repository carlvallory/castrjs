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

  const startData = await startStream(streamData.stream.streamId)

  console.log(startData);

  return new Response(streamData.stream.streamId);
  
}

export async function getStreams() {
  const { data } = await castrApi.get('/streams');
  return data;
}

export async function startStream(streamId) {
  let url = "/streams/"+streamId+"/enable";
  const { data } = await castrApi.patch(url);

  return data;
}