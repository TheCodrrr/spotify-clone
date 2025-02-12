import React from "react";
import './MyPlaylistContainer.css';
import MyPlaylistCard from "./MyPlaylistCard";
import { usePlaylistLoader } from "../../../customHooks/LoadPersonalPlaylist";
import MyPlaylistLoadingCard from "./MyPlaylistLoadingCard";

export default function MyPlaylistContainer() {
    const { loading, userPlaylistDetails } = usePlaylistLoader();

    // Render loading state while data is being fetched
    if (loading) {
        return (
            <div className="my_playlist_container df">
                {[...Array(8)].map((_, i) => <MyPlaylistLoadingCard key={i} />)}
            </div>
        );
    }

    // Slice the first 8 playlists for the home page display
    const homePagePlaylist = userPlaylistDetails.slice(0, 8);

    // Render the playlist cards once the data is available
    const MyPlaylistCards = homePagePlaylist.map((item) => (
        <MyPlaylistCard key={item.id} details={item} />
    ));

    return (
        <div className="my_playlist_container df">
            {MyPlaylistCards}
        </div>
    );
}
