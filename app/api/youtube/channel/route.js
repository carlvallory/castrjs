import React from "react"
import { useSession, signOut, getSession } from "next-auth/react"
import { google } from "googleapis"

export async function GET(req) {
  const API_KEY = process.env.YOUTUBE_API_KEY;

  const { searchParams } = new URL(req.url);
  const CHANNEL_ID = searchParams.get('id');

  const apiURL = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=" + CHANNEL_ID + "&key=" + API_KEY;

  const response = await fetch(apiURL);
  const responseJson = await response.json();
  let relatedPlaylists = false;

  if(responseJson.items){
    responseJson.items.forEach((currentElement, index, array) => {
        if(index == 0){
            relatedPlaylists = responseJson.items[index].contentDetails.relatedPlaylists;
        } 
    });

    if(relatedPlaylists) {
      return new Response(
        JSON.stringify({
          relatedPlaylists,
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
