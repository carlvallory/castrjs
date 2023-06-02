import { google } from 'googleapis';

// Function to retrieve the refresh token for a Google user
export async function refreshToken(user) {
  // Assuming you have stored the user's access token in a database or session
  const accessToken = user.accessToken;

  // Create a new instance of Google OAuth2 client
  const oauth2Client = new google.auth.OAuth2();

  // Set the access token on the client
  oauth2Client.setCredentials({ access_token: accessToken });

  // Retrieve the refresh token
  const { res } = await oauth2Client.refreshAccessToken();

  // Extract the refresh token from the response
  const refreshToken = res.data.refresh_token;

  return refreshToken;
}