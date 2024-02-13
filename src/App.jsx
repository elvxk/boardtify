import React, { useState, useEffect } from "react";
import { getName, getTopTracks } from "./api";
import { FaSpotify } from "react-icons/fa6";
import { TbMusicHeart } from "react-icons/tb";
import qr from "./assets/qr.webp";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SPACE_DELIMITER = "%20";
const SCOPES = ["user-top-read", "user-read-private", "user-read-email"];
const SCOPE_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const App = () => {
  const [token, setToken] = useState("");
  const [topTracks, setTopTracks] = useState([]);
  const [timeRange, setTimeRange] = useState("short_term");
  const [limit, setLimit] = useState(10);
  const [currentDate, setCurrentDate] = useState(getDate());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profile, setProfile] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  useEffect(() => {
    if (window.location.hash) {
      const { access_token, expires_in, token_type } = getParams(
        window.location.hash
      );
      localStorage.clear();
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("expiresIn", expires_in);
    }
    setToken(localStorage.getItem("accessToken"));
  }, []);

  useEffect(() => {
    if (token) {
      getName(token)
        .then((result) => {
          setProfile(result);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getTopTracks(token, limit, timeRange)
        .then((result) => {
          setTopTracks(result.items);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [token, limit, timeRange]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handleLogin = () => {
    window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE_URL_PARAM}&response_type=token&show_dialog=true`;
  };

  const handleLogout = () => {
    setToken("");
    window.localStorage.clear();
    window.location = `${REDIRECT_URI}`;
  };

  return (
    <>
      <div
        className={`${
          !token ? "flex" : "hidden"
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
        <button
          onClick={handleLogin}
          className="font-chalk flex gap-2 justify-center items-center rounded-full text-white text-xl p-4 border-2 hover:scale-95 transition-all my-6"
        >
          <FaSpotify />
          <span className="mt-1">LOGIN WITH SPOTIFY</span>
        </button>

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

      <div className={`${!token ? "hidden" : ""} container mx-auto px-6 py-6`}>
        <div className="flex items-center justify-between text-center">
          <h1 className="font-chalk text-white text-xl flex gap-2">
            <TbMusicHeart />
            Boardtify
          </h1>
          <p className="font-chalk text-white">
            {currentDate}
            {" - "}
            {formattedTime}
          </p>
        </div>
        <div className="w-full border-b-2 my-4"></div>

        <p className="font-chalk text-white mt-4 text-2xl">Hii.. {profile}</p>
        <p className="font-chalk text-white text-lg">
          These are your
          {limit == 10 && " 10 "}
          {limit == 25 && " 25 "}
          {limit == 50 && " 50 "}
          most popular tracks
          {timeRange == "short_term" && " last month"}
          {timeRange == "medium_term" && " last 6 months"}
          {timeRange == "long_term" && " all times"}
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
        <button
          className="mx-auto my-6 font-chalk border-2 flex gap-2 justify-center items-center rounded-full text-white text-xl p-2 w-1/2 lg:w-1/4 hover:scale-95 transition-all"
          onClick={handleLogout}
        >
          Logout
        </button>
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

const getDate = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}/${month}/${year}`;
};

const getParams = (hash) => {
  const stringAfterHastag = hash.substring(1);
  const paramsUrl = stringAfterHastag.split("&");
  const paramsSplitUp = paramsUrl.reduce((accumulater, currentValue) => {
    const [key, value] = currentValue.split("=");
    accumulater[key] = value;
    return accumulater;
  }, {});
  return paramsSplitUp;
};

export default App;
