import React, { useEffect, useState } from "react";
import './RightMainContent.css';
import SongCardNavbar from "./SongCardNavbar";
import SongCardDetails from "./SongCardDetails";
import { fetchRandomSong } from "./fetchUserPlayedSong";
import RightMainContentLoader from "./RightMainContentLoader";

export default function RightMainContent(props) {
    const [display, setDisplay] = useState(true);
    const [loading, setLoading] = useState(true);
    const [randomSongDetails, setRandomSongDetails] = useState({})

    useEffect(() => {
        setLoading(true);
        fetchRandomSong()
        .then((randomSongs) => {
            if (randomSongs) {
                setRandomSongDetails(randomSongs);
            }
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => setLoading(false))

        console.log("The random song details are : " + JSON.stringify(randomSongDetails));
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