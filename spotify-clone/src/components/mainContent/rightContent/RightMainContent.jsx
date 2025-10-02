import React, { useEffect, useState } from "react";
import './RightMainContent.css';
import SongCardNavbar from "./SongCardNavbar";
import SongCardDetails from "./SongCardDetails";
// import { fetchRandomSong } from "./fetchUserPlayedSong"; // Commented out - using backend API instead
import RightMainContentLoader from "./RightMainContentLoader";

const SPOTIFY_API_URL = "http://localhost:5000/api/spotify";

export default function RightMainContent(props) {
    const [display, setDisplay] = useState(true);
    const [loading, setLoading] = useState(true);
    const [randomSongDetails, setRandomSongDetails] = useState({})

    useEffect(() => {
        // Old method using direct import (commented out)
        // setLoading(true);
        // fetchRandomSong()
        // .then((randomSongs) => {
        //     if (randomSongs) {
        //         setRandomSongDetails(randomSongs);
        //     }
        // })
        // .catch((error) => console.error("Error:", error))
        // .finally(() => setLoading(false))

        // New method using backend API
        setLoading(true);
        const fetchSongFromAPI = async () => {
            try {
                const response = await fetch(`${SPOTIFY_API_URL}/song/random`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const randomSongs = await response.json();
                if (randomSongs) {
                    setRandomSongDetails(randomSongs);
                    // console.log("Hello Hello: ", randomSongs);
                }
            } catch (error) {
                console.error("Error fetching random song:", error);
                setRandomSongDetails({});
            } finally {
                setLoading(false);
            }
        };

        fetchSongFromAPI();
    }, [])

    if (loading) {
        return (
            <>
            <div className="right_main_content_container df-ai" style = {{ ...props.common_styles, ...props.specific_style }}>
                <div className="right_main_content_song_container dff">
                    <RightMainContentLoader />
                </div>
            </div>
        </>
        )
    }

    return (
        <>
        {display ? (
            <div className="right_main_content_container df-ai" style = {{ ...props.common_styles, ...props.specific_style }}>
                <div className="right_main_content_song_container dff">
                    <SongCardNavbar fetched_song_card_details = { randomSongDetails } handleCancel = {setDisplay}/>
                    <SongCardDetails fetched_song_card_details = { randomSongDetails }/>
                </div>
            </div>
        ) : ""}
        </>
    )
}