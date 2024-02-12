// src/TopTracks.js
import React, { useEffect, useState } from "react";
import { getTopTracks } from "../spotifyService";

const TopTracks = ({ accessToken }) => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const topTracks = await getTopTracks(accessToken);
        setTracks(topTracks);
      } catch (error) {
        console.error("Error fetching top tracks: ", error);
      }
    };

    if (accessToken) {
      fetchTopTracks();
    }
  }, [accessToken]);

  return (
    <div>
      <ul>
        {tracks.map((track) => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TopTracks;
