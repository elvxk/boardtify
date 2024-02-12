import axios from "axios";

export const getProfile = ({ token }, callback) => {
  axios
    .get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ data }) => {
      callback(data);
    })
    .catch((e) => {
      console.log(e);
    });
};
