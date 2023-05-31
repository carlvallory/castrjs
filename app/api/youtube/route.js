import { youApi, API_KEY } from '../../utils/youApi';
import { castrApi } from '../../utils/castrApi';

export async function GET(request) {

  const videoData = {
        video: {
          videoId:     "",
          categoryId:   "",
          tittle: ""
        }
  };
  
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