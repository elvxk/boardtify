// src/spotifyService.js
import axios from "axios";

const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

const SPOTIFY_ACCOUNTS_BASE_URL = "https://accounts.spotify.com";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID; // Replace with your Spotify Client ID
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET; // Replace with your Spotify Client Secret

export const getTopTracks = async (accessToken) => {
  try {
    const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me/top/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error("Error fetching top tracks: ", error);
    throw error;
  }
};

export const getAccessToken = async () => {
  try {
    const response = await axios.post(
      `${SPOTIFY_ACCOUNTS_BASE_URL}/api/token`,
      null,
      {
        params: {
          grant_type: "client_credentials",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token: ", error);
    throw error;
  }
};
