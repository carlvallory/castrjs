import { sheetApi, SHEETID, APIKEY } from "../../utils/sheetApi";
import { platformApi } from "../../utils/platformApi";

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
        run = true;
      }
    }
    if(index != 0) {
      if(row[1].split(":")[0] == hour && row[1].split(":")[1] == minute) {
        console.log("Stop");
        console.log(row[2]);
        console.log(row[0]);

        status = true;
        init = false;
        run = true;
      }
    }
  });

  if(status == true) {
    run = true;
    platformResult = await getPlatform();
    status = false;
  }

  console.log(platformResult);

  return new Response(today);
  
}

export async function getJson(url) {
  const { data } = await sheetApi.get(url);
  return data;
}

export async function getPlatform() {
  const { data } = await platformApi.get('/update');
  return data;
}