import { castrApi } from "../../../utils/castrApi";

const streamName = process.env.STREAM_NAME;

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
    if(stream.name == streamName) {
      console.log(stream);
      
      streamData.stream.streamId      = stream.id;
      streamData.stream.streamType    = stream.type;
      streamData.stream.streamEnable  = stream.enabled;
      streamData.stream.streamName    = stream.name;
      streamData.stream.platformId    = stream.platforms[0].id
      streamData.stream.youtubeUrl    = stream.platforms[0].oauthData.serviceChannelUrl;
    }
  });

  //const streamObj = await getStream(streamId);

  console.log(streamData);

  return new Response(streamData.stream.streamId);
  
}

async function getStreams() {
  const { data } = await castrApi.get('/streams');
  return data;
}

async function getStream(streamId) {
  let url = "/stream/" + streamId;
  console.log(url);
  const { data } = await castrApi.get(url);
  return data;
}
