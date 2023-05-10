import { sheetApi, SHEETID, APIKEY } from "../../utils/sheetApi";


export async function GET(request) {

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const now = new Date();
  const today = dayNames[now.getDay()].toLowerCase();
  const time = now.getHours() + ':' + now.getMinutes();
  const hour = now.getHours();
  const minute = now.getMinutes();

  let url = "/spreadsheets/"+SHEETID+"/values/"+today+"!A1:C12?key="+APIKEY;

  const jsonData = await getJson(url);

  jsonData.values.forEach((row, index) => {
    if(index != 0) {
      if(row[0].split(":")[0] == hour) {
        console.log(row[0]);
      }
    }
  });

  

  return new Response(today);
  
}

export async function getJson(url) {
  const { data } = await sheetApi.get(url);
  return data;
}
