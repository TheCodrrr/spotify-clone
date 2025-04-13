import { useState, useEffect } from "react";
import { loadUserDetails } from "../components/mainContent/centreContent/user_playlist_details";

export function usePlaylistLoader() {
    const [loading, setLoading] = useState(true);
    const [userPlaylistDetails, setUserPlaylistDetails] = useState([]);
  
    useEffect(() => {
      async function loadPlaylists() {
        setLoading(true);
        const playlists = await loadUserDetails();
        // playlists.forEach((element) => {
        //   if (element.user_playlist_name.length > 15) {
        //     element.user_playlist_name = element.user_playlist_name.slice(0, 15) + "...";
        //   }
        // });
        setUserPlaylistDetails(playlists);
        setLoading(false);
      }
  
      loadPlaylists();
    }, []);
    return { loading, userPlaylistDetails };
}