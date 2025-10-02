import React, { useEffect, useState, useRef } from "react";
import './MusicPlayer.css'
import { fetchRandomSong } from "../mainContent/rightContent/fetchUserPlayedSong";
import AudioPlayer from "../AudioPlayer";
// import YouTubePlayer from "react-player/youtube";
import YouTubePlayer from "../youtubeSearch.js";
import { useMusicPlayer } from "./MusicPlayerContext.jsx";

export default function MusicPlayer() {
    const { songInfo } = useMusicPlayer();
    const [valuePlayPause, setPlayPause] = useState(false);
    const [restart, setRestart] = useState(false);
    const [loading, setLoading] = useState(true);
    const [randomSongDetails, setRandomSongDetails] = useState({})
    const [artists, setArtists] = useState([])
    const [videoId, setVideoId] = useState(null);
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
    const [currentPlayedSeconds, setCurrentPlayedSeconds] = useState(0);
    const progressBarRef = useRef(null);
    const isDragging = useRef(false);

    const updateProgress = (e) => {
        if (!progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        let newProgress = ((e.clientX - rect.left) / rect.width) * 100;
        newProgress = Math.max(0, Math.min(100, newProgress));
        setProgress(newProgress);
        
        // Update current played time based on the new progress percentage
        if (randomSongDetails.song_duration) {
            const newPlayedSeconds = (newProgress / 100) * (randomSongDetails.song_duration / 1000);
            setCurrentPlayedSeconds(newPlayedSeconds);
        }
    };

    const handleMouseDown = (e) => {
        isDragging.current = true;
        updateProgress(e);
    };

    const handleMouseMove = (e) => {
        if (isDragging.current) {
            updateProgress(e);
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
    }, [])

    function formatTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return [minutes, seconds];
    }
    
    function formatTimeFromSeconds(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return [minutes, remainingSeconds];
    }

    const cutString = (str, maxLength) => {
        if (str.length > maxLength) {
            return str.slice(0, maxLength) + '...';
        }
        return str;
    }

    let [total_min, total_sec] = formatTime(randomSongDetails.song_duration);

    // Update time display based on currentPlayedSeconds
    useEffect(() => {
        const [played_min, played_sec] = formatTimeFromSeconds(currentPlayedSeconds);

        setDynamicTimeComponent(
            (
            <>
                <span className="song_time_component">
                    { Number.isNaN(played_min) ? '0' : played_min.toString() }
                </span>
                <span className="song_time_separation">
                    :
                </span>
                <span className="song_time_component">
                    { Number.isNaN(played_sec) ? '00' : played_sec.toString().padStart(2, '0') }
                </span>
            </>
            )
        )
    }, [currentPlayedSeconds])

    let artistNames = artists.map(arts => arts.name).join(', ');
    
    if (artistNames.length > 25) {
        artistNames = artistNames.slice(0, 25) + '...'
    }

    const togglePlayPause = async () => {
        const searchQuery = `${songInfo?.song_name} ${songInfo?.artists[0]}`;
        const id = await YouTubePlayer(searchQuery);
        if (id) {
            // console.log("Video Id is: " + id)
            setVideoId(id);
        } else {
            alert("No video found");
        }

        setPlayPause(!valuePlayPause);
    }

    // Handle progress updates from AudioPlayer
    const handleAudioProgress = (state) => {
        if (!isDragging.current && state.playedSeconds > 0) {
            setCurrentPlayedSeconds(state.playedSeconds);
            
            // Calculate progress percentage based on duration
            const durationInSeconds = randomSongDetails.song_duration / 1000;
            const newProgress = (state.playedSeconds / durationInSeconds) * 100;
            setProgress(Math.min(newProgress, 100));
        }
    };

    useEffect(() => {
        const searchSongAtYoutube = async () => {
          if (!songInfo || !songInfo.song_name || !songInfo.artists?.length) return;
      
            setRandomSongDetails({... songInfo, song_image: songInfo.image, song_duration: songInfo.duration})
            // Reset progress and played time when new song is loaded
            setProgress(0);
            setCurrentPlayedSeconds(0);

          const searchQuery = `${songInfo.song_name} ${songInfo.artists[0]}`;
          try {
            const id = await YouTubePlayer(searchQuery);
            if (id) {
            //   console.log("Video Id is:", id);
              setVideoId(id);
              setPlayPause(true); // start playback
            } else {
              alert("No video found for this song.");
              setVideoId(null);
              setPlayPause(false);
            }
          } catch (error) {
            console.error("Error searching YouTube:", error);
          } finally {
        }
    };
    [total_min, total_sec] = formatTime(randomSongDetails.song_duration);
      
        searchSongAtYoutube();
      }, [songInfo]);
    

    const handleRestart = () => {
        setRestart(true);
        setPlayPause(true);
        setProgress(0);
        setCurrentPlayedSeconds(0);
        setTimeout(() => setRestart(false), 200);
    }

    return (
        <>
            <div className="music_player_container df-ai">
                <div className="music_player_child_container music_player_left_container df-ai">
                    <img src={`${randomSongDetails.song_image}`} className="music_player_img_container" />
                    <div className="music_player_content_container df-jc">
                        <a href="#" className="music_player_song_name">
                            { cutString(randomSongDetails?.song_name || '', 25) }
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
                    <div className="music_player_centre_child music_player_centre_upper_container dff">
                        <div className="btn_shuffle_container dff">
                            <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 dYnaPI btn_shuffle_svg"><path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"></path><path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z"></path></svg>
                        </div>
                        <div className="btn_3_mains btn_backward_container dff" onClick={handleRestart}>
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
                                // style={{ left: `${progress}%` }}
                            ></span>
                        </div>
                        <div className="music_player_right_song_time music_player_song_time dff">
                            <span className="song_time_component">{ Number.isNaN(total_min) ? '0' : total_min.toString() }</span>
                            <span className="song_time_separation">:</span>
                            <span className="song_time_component">{ Number.isNaN(total_sec) ? '00' : total_sec.toString().padStart(2, '0') }</span>
                        </div>
                    </div>
                </div>
                <div className="music_player_child_container music_player_right_container df-ai">
                    <svg
                        data-encore-id="icon"
                        role="img"
                        aria-hidden="true"
                        className="e-9800-icon e-9800-baseline endsvg"
                        viewBox="0 0 16 16"
                        style={{
                        '--encore-icon-height': 'var(--encore-graphic-size-decorative-smaller)',
                        '--encore-icon-width': 'var(--encore-graphic-size-decorative-smaller)',
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M11.196 8 6 5v6l5.196-3z" className="firstPath"></path>
                        <path d="M15.002 1.75A1.75 1.75 0 0 0 13.252 0h-10.5a1.75 1.75 0 0 0-1.75 1.75v12.5c0 .966.783 1.75 1.75 1.75h10.5a1.75 1.75 0 0 0 1.75-1.75V1.75zm-1.75-.25a.25.25 0 0 1 .25.25v12.5a.25.25 0 0 1-.25.25h-10.5a.25.25 0 0 1-.25-.25V1.75a.25.25 0 0 1 .25-.25h10.5z" className="firstPath"></path>
                    </svg>

                    <svg
                        data-encore-id="icon"
                        role="img"
                        aria-hidden="true"
                        className="e-9800-icon e-9800-baseline endsvg"
                        viewBox="0 0 16 16"
                        style={{
                        '--encore-icon-height': 'var(--encore-graphic-size-decorative-smaller)',
                        '--encore-icon-width': 'var(--encore-graphic-size-decorative-smaller)',
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M13.426 2.574a2.831 2.831 0 0 0-4.797 1.55l3.247 3.247a2.831 2.831 0 0 0 1.55-4.797zM10.5 8.118l-2.619-2.62A63303.13 63303.13 0 0 0 4.74 9.075L2.065 12.12a1.287 1.287 0 0 0 1.816 1.816l3.06-2.688 3.56-3.129zM7.12 4.094a4.331 4.331 0 1 1 4.786 4.786l-3.974 3.493-3.06 2.689a2.787 2.787 0 0 1-3.933-3.933l2.676-3.045 3.505-3.99z"></path>
                    </svg>

                    <svg
                        data-encore-id="icon"
                        role="img"
                        aria-hidden="true"
                        className="e-9800-icon e-9800-baseline endsvg"
                        viewBox="0 0 16 16"
                        style={{
                        '--encore-icon-height': 'var(--encore-graphic-size-decorative-smaller)',
                        '--encore-icon-width': 'var(--encore-graphic-size-decorative-smaller)',
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5zm2.5-1a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2h-9z"></path>
                    </svg>

                    <svg
                        data-encore-id="icon"
                        role="img"
                        aria-hidden="true"
                        className="e-9800-icon e-9800-baseline endsvg"
                        viewBox="0 0 16 16"
                        style={{
                        '--encore-icon-height': 'var(--encore-graphic-size-decorative-smaller)',
                        '--encore-icon-width': 'var(--encore-graphic-size-decorative-smaller)',
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M6 2.75C6 1.784 6.784 1 7.75 1h6.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15h-6.5A1.75 1.75 0 0 1 6 13.25V2.75zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25h-6.5zm-6 0a.25.25 0 0 0-.25.25v6.5c0 .138.112.25.25.25H4V11H1.75A1.75 1.75 0 0 1 0 9.25v-6.5C0 1.784.784 1 1.75 1H4v1.5H1.75zM4 15H2v-1.5h2V15z" />
                        <path d="M13 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-1-5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                    </svg>

                    <svg
                        data-encore-id="icon"
                        role="presentation"
                        aria-label="Volume high"
                        aria-hidden="false"
                        className="e-9800-icon e-9800-baseline endsvg"
                        id="volume-icon"
                        viewBox="0 0 16 16"
                        style={{
                        '--encore-icon-height': 'var(--encore-graphic-size-informative-smaller)',
                        '--encore-icon-width': 'var(--encore-graphic-size-informative-smaller)',
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z" />
                        <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z" />
                    </svg>

                        <span className="end_volume_bar_container df-ai">
                            <span className="end_volume_bar_filled_container"></span>
                        </span>

                    <svg
                        data-encore-id="icon"
                        role="img"
                        aria-hidden="true"
                        className="e-9800-icon e-9800-baseline endsvg"
                        viewBox="0 0 16 16"
                        style={{
                        '--encore-icon-height': 'var(--encore-graphic-size-decorative-smaller)',
                        '--encore-icon-width': 'var(--encore-graphic-size-decorative-smaller)',
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M16 2.45c0-.8-.65-1.45-1.45-1.45H1.45C.65 1 0 1.65 0 2.45v11.1C0 14.35.65 15 1.45 15h5.557v-1.5H1.5v-11h13V7H16V2.45z" />
                        <path d="M15.25 9.007a.75.75 0 0 1 .75.75v4.493a.75.75 0 0 1-.75.75H9.325a.75.75 0 0 1-.75-.75V9.757a.75.75 0 0 1 .75-.75h5.925z" />
                    </svg>

                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="endsvg"
                    >
                        <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.25 3C0.25 2.0335 1.0335 1.25 2 1.25H5.375V2.75H2C1.86193 2.75 1.75 2.86193 1.75 3V5.42857H0.25V3ZM14 2.75H10.625V1.25H14C14.9665 1.25 15.75 2.0335 15.75 3V5.42857H14.25V3C14.25 2.86193 14.1381 2.75 14 2.75ZM1.75 10.5714V13C1.75 13.1381 1.86193 13.25 2 13.25H5.375V14.75H2C1.0335 14.75 0.25 13.9665 0.25 13V10.5714H1.75ZM14.25 13V10.5714H15.75V13C15.75 13.9665 14.9665 14.75 14 14.75H10.625V13.25H14C14.1381 13.25 14.25 13.1381 14.25 13Z"
                        fill="currentColor"
                        />
                    </svg>
                </div>
            </div>
            {videoId && (
                <>
                <p>Now Playing: {randomSongDetails?.song_name || 'Loading...'}</p>
                <AudioPlayer
                videoId={videoId}
                play={valuePlayPause}
                pause={!valuePlayPause}
                restart={restart}
                onProgress={handleAudioProgress}
                />
                </>
            )}
        </>
    )
}