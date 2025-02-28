import React, { useEffect, useState, useRef } from "react";
import './MusicPlayer.css'
import { fetchRandomSong } from "../mainContent/rightContent/fetchUserPlayedSong";

export default function MusicPlayer() {
    const [valuePlayPause, setPlayPause] = useState(true);
    const [loading, setLoading] = useState(true);
    const [randomSongDetails, setRandomSongDetails] = useState({})
    const [artists, setArtists] = useState([])
    const [DynamicTimeComponent, setDynamicTimeComponent] = useState(
        (
            <>
                <span className="song_time_component">
                    0
                </span>
                <span className="song_time_separation">
                    :
                </span>
                <span className="song_time_component">
                    00
                </span>
            </>
        )
    )
    
    const [progress, setProgress] = useState(0);
    const progressBarRef = useRef(null);
    const isDragging = useRef(false);

    const updateProgress = (e) => {
        if (!progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        let newProgress = ((e.clientX - rect.left) / rect.width) * 100;
        newProgress = Math.max(0, Math.min(100, newProgress));
        setProgress(newProgress);
    };

    const handleMouseDown = (e) => {
        isDragging.current = true;
        updateProgress(e);
    };

    const handleMouseMove = (e) => {
        if (isDragging.current) {
            updateProgress(e);
            // document.getElementsByClassName('music_progress').style.backgroundColor = "#24d265";
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchRandomSong()
        .then((randomSongs) => {
            if (randomSongs) {
                setRandomSongDetails(randomSongs);
                setArtists(randomSongs.artists)
            }
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => setLoading(false))

        console.log("The random song details from MUSIC PLAYER is are : " + JSON.stringify(randomSongDetails));
    }, [])

    function formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return [minutes, seconds];
    }

    let [total_min, total_sec] = formatTime(randomSongDetails.song_duration);

    // console.log(`the time is : ${total_min} : ${total_sec}`)
    // console.log("The progress is: " + progress);

    let played_millisec, played_min = 0, played_sec = 0;

    useEffect(() => {
        played_millisec = Math.floor((progress * randomSongDetails.song_duration) / 100);
        [played_min, played_sec] = formatTime(played_millisec);

        // console.log("Here is the played time: " + played_millisec);
        setDynamicTimeComponent(
            (
            <>
                <span className="song_time_component">
                    { played_min.toString() }
                </span>
                <span className="song_time_separation">
                    :
                </span>
                <span className="song_time_component">
                    { played_sec.toString().padStart(2, '0') }
                </span>
            </>
            )
        )
    }, [progress])

    // let song_used_name

    let artistNames = artists.map(arts => arts.name).join(', ');
    

    if (artistNames.length > 25) {
        artistNames = artistNames.slice(0, 25) + '...'
    }

    const togglePlayPause = () => {
        if (valuePlayPause) {
            setPlayPause(false);
        }
        else {
            setPlayPause(true);
        }
    }

    return (
        <div className="music_player_container df-ai">
            <div className="music_player_child_container music_player_left_container df-ai">
                <img src={`${randomSongDetails.song_image}`} className="music_player_img_container" />
                <div className="music_player_content_container df-jc">
                    <a href="#" className="music_player_song_name">
                        { randomSongDetails.song_used_name }
                    </a>
                    <h5 className="music_player_song_singer">
                        { artistNames }
                    </h5>
                </div>
                <div className="btn_song_saved_container btn_song_saved_music_player_container dff">
                    <i className="fa-solid fa-check btn_song_saved"></i>
                </div>
            </div>
            <div className="music_player_child_container music_player_centre_container df-ai">
                {/* 

                    <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 dYnaPI"><path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"></path><path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z"></path></svg>

                    <i className="fa-solid fa-backward-step"></i>

                    <i className="fa-solid fa-pause"></i>
                    <i className="fa-solid fa-play"></i>

                    <i className="fa-solid fa-forward-step"></i>

                    <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 dYnaPI"><path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z"></path></svg>
                    <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 dYnaPI"><path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h.75v1.5h-.75A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5ZM12.25 2.5a2.25 2.25 0 0 1 2.25 2.25v5A2.25 2.25 0 0 1 12.25 12H9.81l1.018-1.018a.75.75 0 0 0-1.06-1.06L6.939 12.75l2.829 2.828a.75.75 0 1 0 1.06-1.06L9.811 13.5h2.439A3.75 3.75 0 0 0 16 9.75v-5A3.75 3.75 0 0 0 12.25 1h-.75v1.5h.75Z"></path><path d="m8 1.85.77.694H6.095V1.488c.697-.051 1.2-.18 1.507-.385.316-.205.51-.51.583-.913h1.32V8H8V1.85Z"></path><path d="M8.77 2.544 8 1.85v.693h.77Z"></path></svg>

                */}
                <div className="music_player_centre_child music_player_centre_upper_container dff">
                    <div className="btn_shuffle_container dff">
                        <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 dYnaPI btn_shuffle_svg"><path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"></path><path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z"></path></svg>
                    </div>
                    <div className="btn_3_mains btn_backward_container dff">
                        <i className="fa-solid fa-backward-step"></i>
                    </div>
                    <div className="btn_3_mains btn_play_pause_music_player_container dff" onClick={togglePlayPause}>
                        { valuePlayPause ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i> }
                    </div>
                    <div className="btn_3_mains btn_forward_container dff">
                        <i className="fa-solid fa-forward-step"></i>
                    </div>
                    <div className="btn_song_loop_container dff">
                        <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 dYnaPI btn_song_loop_svg"><path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5z"></path></svg>
                    </div>
                </div>
                <div className="music_player_centre_child music_player_centre_lower_container dff">
                    <div className="music_player_left_song_time music_player_song_time dff">
                        { DynamicTimeComponent }
                    </div>
                    <div
                        className="music_progress_bar df-ai"
                        ref={progressBarRef}
                        onClick={updateProgress}
                        onMouseDown={handleMouseDown}
                    >
                        <span
                            className="music_progress"
                            style={{ width: `${progress}%` }}
                        ></span>
                        <span
                            className="music_progress_point"
                            // style={{ display: progress > 0 ? "block" : "none" }}
                        ></span>
                    </div>
                    <div className="music_player_right_song_time music_player_song_time dff">
                        <span className="song_time_component">{ total_min.toString() }</span>
                        <span className="song_time_separation">:</span>
                        <span className="song_time_component">{ total_sec.toString().padStart(2, '0') }</span>
                    </div>
                </div>
            </div>
            <div className="music_player_child_container music_player_right_container dff">

            </div>
        </div>
    )
}