// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSpotify } from "react-icons/fa6";
import qr from "./assets/qr.webp";
import { getProfile } from "./api";
import { TbMusicHeart } from "react-icons/tb";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SCOPES = ["user-top-read"];

const App = () => {
  const [accessToken, setAccessToken] = useState("");
  const [topTracks, setTopTracks] = useState([]);
  const [timeRange, setTimeRange] = useState("short_term");
  const [limit, setLimit] = useState(10);
  const [currentDate, setCurrentDate] = useState(getDate());
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        try {
          const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            {
              grant_type: "authorization_code",
              code: code,
              redirect_uri: REDIRECT_URI,
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
            },
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );
          setAccessToken(response.data.access_token);
        } catch (error) {
          console.error("Error fetching access token: ", error);
        }
      }
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    const fetchTopTracks = async () => {
      if (accessToken) {
        try {
          const response = await axios.get(
            `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setTopTracks(response.data.items);
        } catch (error) {
          console.error("Error fetching top tracks: ", error);
        }
      }
    };

    fetchTopTracks();
    if (accessToken) {
      getProfile({ token: accessToken }, (data) => {
        setProfile(data.display_name);
      });
    }
  }, [accessToken, timeRange, limit]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  return (
    <>
      <div
        className={`${
          !accessToken ? "flex" : "hidden"
        } flex-col justify-center items-center min-h-screen`}
      >
        <div className="items-center flex justify-center flex-col">
          <h1 className="font-chalk text-white text-4xl flex gap-4 flex-col items-center">
            <TbMusicHeart />
            <span className="text-6xl uppercase">Boardtify</span>
          </h1>
          <p className="font-chalk text-white text-lg flex gap-2 text-center container mx-auto px-6 -mt-2">
            Get information on your top tracks in the past month or even from
            all the times you have used Spotify
          </p>
        </div>
        <a
          href={`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
          )}&scope=${encodeURIComponent(SCOPES.join(" "))}`}
          className="font-chalk flex gap-2 justify-center items-center rounded-full text-white text-xl p-4 border-2 hover:scale-95 transition-all my-6"
        >
          <FaSpotify />
          <span className="mt-1">LOGIN WITH SPOTIFY</span>
        </a>
        <a
          href={REDIRECT_URI}
          target="_blank"
          className="font-chalk text-white text-xl flex gap-2 text-center container mx-auto px-6 items-center justify-center mb-1"
        >
          <span className="border-b-2">boardtify.vercel.app</span>
        </a>

        <a
          href="https://sandri.my.id"
          target="_blank"
          className="font-chalk text-white text-sm flex gap-2 text-center container mx-auto px-6 items-end h-full justify-center"
        >
          made with love ❤ by elvxk
        </a>
      </div>

      <div
        className={`${
          !accessToken ? "hidden" : ""
        } container mx-auto px-6 py-6`}
      >
        <div className="flex items-center justify-between text-center">
          <h1 className="font-chalk text-white text-xl flex gap-2">
            <TbMusicHeart />
            Boardtify
          </h1>
          <p className="font-chalk text-white">{currentDate}</p>
        </div>
        <div className="w-full border-b-2 my-4"></div>

        <p className="font-chalk text-white mt-4 text-2xl">Hii.. {profile}</p>
        <p className="font-chalk text-white text-lg">
          These are the
          {limit == 10 && " 10 "}
          {limit == 25 && " 25 "}
          {limit == 50 && " 50 "}
          most popular tracks
          {timeRange == "short_term" && "last month"}
          {timeRange == "medium_term" && "last 6 months"}
          {timeRange == "long_term" && "all times"}
        </p>

        <div className="w-full border-b-2 border-dashed my-2"></div>

        {topTracks.map((track, index) => (
          <div
            key={index}
            className="flex font-chalk text-white text-lg tracking-[5px] gap-3"
          >
            <p>
              {index + 1}
              {"."}
            </p>
            <p>
              {track.name}
              {" - "}
              {track.artists[0].name}
            </p>
          </div>
        ))}
        <div className="w-full border-b-2 border-dashed my-2"></div>

        <p className="font-chalk text-white text-lg text-center uppercase">
          THANK YOU {profile} FOR VISITING
        </p>
        <div className="flex items-center justify-center mb-2">
          <img src={qr} alt="qr" className="h-[64px] w-[64px]" />
        </div>
        <p className="font-chalk text-white text-center">
          for {profile}, created from boardtify
        </p>
        <div className="w-full border-b-2 my-4"></div>

        <div className="items-center flex justify-center my-4">
          <h1 className="font-chalk text-white text-2xl flex gap-2">
            <TbMusicHeart />
            Boardtify
          </h1>
        </div>

        <div className="flex justify-center items-center gap-6">
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="w-1/2 lg:w-1/4 font-chalk text-xl bg-black/50 text-white border-2 rounded-full px-4 py-2 items-center justify-center flex"
          >
            <option value="short_term">Last Month</option>
            <option value="medium_term">Last 6 Months</option>
            <option value="long_term">All Time</option>
          </select>
          <select
            value={limit}
            onChange={handleLimitChange}
            className="w-1/2 lg:w-1/4 font-chalk text-xl bg-black/50 text-white border-2 rounded-full px-4 py-2 items-center justify-center flex"
          >
            <option value={10}>10 items</option>
            <option value={25}>25 items</option>
            <option value={50}>50 items</option>
          </select>
        </div>
        <a
          className="mx-auto my-6 font-chalk border-2 flex gap-2 justify-center items-center rounded-full text-white text-xl p-2 w-1/2 lg:w-1/4 hover:scale-95 transition-all"
          href="/"
        >
          Logout
        </a>
        <a
          href={REDIRECT_URI}
          target="_blank"
          className="font-chalk text-white text-xl flex gap-2 text-center container mx-auto px-6 items-center justify-center mb-1"
        >
          <span className="border-b-2">boardtify.vercel.app</span>
        </a>

        <a
          href="https://sandri.my.id"
          target="_blank"
          className="font-chalk text-white text-sm flex gap-2 text-center container mx-auto px-6 items-end h-full justify-center"
        >
          made with love ❤ by elvxk
        </a>
      </div>
    </>
  );
};

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}/${month}/${year}`;
}

export default App;
