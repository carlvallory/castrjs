import { sheetApi, SHEETID, APIKEY } from "../../utils/sheetApi";


export async function GET(request) {

  let url = "/spreadsheets/"+SHEETID+"/values/monday!A1:C12?key="+APIKEY;
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const jsonData = await getJson(url);

  jsonData.values.forEach((row, index) => {
    console.log(row[0]);
  });

  let today = dayNames[new Date().getDay()];
  
  return new Response(today);
  
}

export async function getJson(url) {
  const { data } = await sheetApi.get(url);
  return data;
}

export async function getStream(streamId) {
  let url = "/stream/" + streamId;
  console.log(url);
  const { data } = await castrApi.get(url);
  return data;
}
