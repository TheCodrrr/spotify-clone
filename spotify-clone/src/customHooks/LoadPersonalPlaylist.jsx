import { useState, useEffect } from "react";
// import { loadUserDetails } from "../components/mainContent/centreContent/user_playlist_details"; // Commented out - using backend API instead

const SPOTIFY_API_URL = "http://localhost:5000/api/spotify";

export function usePlaylistLoader() {
    const [loading, setLoading] = useState(true);
    const [userPlaylistDetails, setUserPlaylistDetails] = useState([]);
  
    useEffect(() => {
      // Old method using direct import (commented out)
      // async function loadPlaylists() {
      //   setLoading(true);
      //   const playlists = await loadUserDetails();
      //   // playlists.forEach((element) => {
      //   //   if (element.user_playlist_name.length > 15) {
      //   //     element.user_playlist_name = element.user_playlist_name.slice(0, 15) + "...";
      //   //   }
      //   // });
      //   setUserPlaylistDetails(playlists);
      //   setLoading(false);
      // }

      // New method using backend API
      async function loadPlaylists() {
        setLoading(true);
        try {
          const response = await fetch(`${SPOTIFY_API_URL}/user/playlists`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const playlists = await response.json();
          
          // playlists.forEach((element) => {
          //   if (element.user_playlist_name.length > 15) {
          //     element.user_playlist_name = element.user_playlist_name.slice(0, 15) + "...";
          //   }
          // });
          setUserPlaylistDetails(playlists);
          // console.log("Hello Hello: ", playlists);
        } catch (error) {
          console.error("Error fetching user playlists:", error);
          setUserPlaylistDetails([]);
        } finally {
          setLoading(false);
        }
      }
  
      loadPlaylists();
    }, []);
    return { loading, userPlaylistDetails };
}