import axios from "axios";

export const getTopTracks = async (token, limit, timeRange) => {
  return await axios
    .get(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((e) => {
      console.log(e);
    });
};

export const getName = async (token) => {
  return await axios
    .get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data.display_name)
    .catch((e) => {
      console.log(e);
    });
};
