import React from "react"
import { useSession, signOut, getSession } from "next-auth/react"
import { google } from "googleapis"

export async function GET(req) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

  const { searchParams } = new URL(req.url);
  const CHANNEL_ID = searchParams.get('id');

  console.log("list");
  console.log(CHANNEL_ID);

  const channelResponse = await fetch(NEXTAUTH_URL+"/api/youtube/channel?id="+CHANNEL_ID);
  const channelResponseJson = await channelResponse.json();
  
  const { uploads } = channelResponseJson.relatedPlaylists;

  const apiURL = "https://www.googleapis.com/youtube/v3/playlistItems?playlistId="+uploads+"&part=snippet,id&chart=mostPopular&key="+API_KEY;

  let youtubeResponse = {
    return: false,
    updated: false,
    youtube: {
        video: {
          channelId: "",
          title: "",
          description: "",
          videoId: ""
        }
    } 
  };

  const response = await fetch(apiURL);
  const responseJson = await response.json();


  if(responseJson.items){
      responseJson.items.forEach((currentElement, index, array) => {
        if(index == 0){
          youtubeResponse.youtube.video.channelId = responseJson.items[index].snippet.channelId;
          youtubeResponse.youtube.video.title = responseJson.items[index].snippet.title;
          youtubeResponse.youtube.video.description = responseJson.items[index].snippet.description;
          youtubeResponse.youtube.video.videoId = responseJson.items[index].snippet.resourceId.videoId;
          youtubeResponse.updated = false;
          youtubeResponse.return = true;
        }
      });
      
      if(youtubeResponse.return) {
        return new Response(
          JSON.stringify({
            youtubeResponse,
          }),
          {
            status: 200,
            headers: {
              'content-type': 'application/json',
            },
          }
        );
      } else {
        return new Response(
          JSON.stringify({error: "not found"}),
          {
            status: 404,
            headers: {
              'content-type': 'application/json',
            },
          }
        );
      }
  } else {
    return new Response(
      JSON.stringify({error: responseJson}),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }
}
