import React, { useEffect, useState } from "react";
import "./EnlargedSearchedCard.css";
import { Link, useLocation } from "react-router-dom";

export default function EnlargedSearchedCard(props) {
    const [loading, setLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (!props.searchedCardDetails || props.searchedCardDetails.length === 0) return;
        setLoading(true);
        console.log(`From EnlargedSearchedCard.jsx: ${props.searchedType} `, props.searchedCardDetails);
        setLoading(false);
    }, [props.searchedCardDetails, props.searchedType, location.pathname]);

    function formatTime(ms) {
        if (!ms) return "0:00";
        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    const formatString = (value = "", valLength) => {
        return value.length <= valLength ? value : value.slice(0, valLength) + "...";
    };

    const searchedCardDetails = props.searchedCardDetails || []; // Ensure it's always an array

    if (loading || searchedCardDetails.length === 0) {
        return <div className="loading-container">Loading...</div>;
    }

    function formatEpisodeDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    
    // Example usage:
    // console.log(formatDate("2022-11-17")); // Output: Nov 17, 2022
    
    function formatTime2(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
    
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;
    
        let formattedTime = "";
    
        if (hours > 0) {
            formattedTime += `${hours} hr `;
        }
        
        // Show "X min Y sec" only if there are both minutes and seconds but no hours
        if (hours === 0 && remainingMinutes > 0 && remainingSeconds > 0) {
            formattedTime += `${remainingMinutes} min ${remainingSeconds} sec`;
        } else {
            if (remainingMinutes > 0) {
                formattedTime += `${remainingMinutes} min `;
            }
            if (hours === 0 && remainingMinutes === 0) { 
                formattedTime += `${remainingSeconds} sec`;
            }
        }
    
        return formattedTime.trim();
    }
    
    // Example usage:
    // console.log(formatDuration(263523)); // Output: 4 min 23 sec
    

    return props.searchedType === "track" ? (
        <table className="songs_table dff">
            <tr className="songs_table_row_container songs_table_head_row_container df-ai">
                <th className="song_col1 song_col_head dff">#</th>
                <th className="song_col2 song_col_head df-ai">Title</th>
                <th className="song_col3 song_col_head df-ai">Album</th>
                <th className="nothing_head"></th>
                <th className="song_col4 song_col_head dff">
                    <i className="fa-solid fa-clock"></i>
                </th>
                <th className="nothing_head"></th>
            </tr>
            <span className="songs_table_head_divider"></span>
            {searchedCardDetails.map((songs, index) => (
                <tr key={songs?.id || index} className="songs_table_row_container songs_table_row df-ai"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <td className="song_col1 song_col_value1 dff">
                        {hoveredIndex === index ? (<i className="fa fa-play track_play_song"></i>) : index + 1}
                    </td>
                    <td className="song_col2 song_col_value2 df-ai">
                        <img src={songs?.image || ""} alt="" className="song_img" />
                        <div className="song_details_container df-jc">
                            <Link to={`/`} className="song_title">
                                {formatString(songs?.name, 35)}
                            </Link>
                            <div className="song_artist">
                                {formatString(songs?.artists?.join(", ") || "Unknown", 35)}
                            </div>
                        </div>
                    </td>
                    <td className="song_col3 song_col_value3 df-ai">
                        <Link to={`/`} className="songs_album_link">
                            {formatString(songs?.album || "Unknown", 25)}
                        </Link>
                    </td>
                    <td className="nothing_row dff">
                        <div className="song_add_btn_outer dff">
                            <i className="fa fa-plus song_add_btn"></i>
                        </div>
                    </td>
                    <td className="song_col4 song_col_value4 dff">{formatTime(songs?.duration)}</td>
                    <td className="nothing_row nothing_row2 dff">•••</td>
                </tr>
            ))}
        </table>
    ) : ["playlist", "album"].includes(props.searchedType) ? (
        <div className="searched_details_container dff">
            {searchedCardDetails.map((searchedContent, index) => (
                <div key={searchedContent?.id || index} className="searched_element_container df-jc">
                    <div
                        className="searched_element_img df"
                        style={{
                            backgroundImage: `url(${searchedContent?.image || ""})`,
                            backgroundSize: "cover",
                        }}
                    >
                        <div className="play_action_logo_container dff">
                            <i className="fa fa-play play_logo"></i>
                        </div>
                    </div>
                    <Link to={`/`} className="searched_element_name">
                        {formatString(searchedContent?.name || "Unknown", 15)}
                    </Link>
                    <div className="searched_element_creator">
                        {props.searchedType === "playlist"
                            ? `By ${formatString(searchedContent?.creator || "Unknown", 20)}`
                            : `${searchedContent?.releaseYear || "Unknown"} • ${formatString(searchedContent?.artists?.join(", ") || "Unknown", 12)}`}
                    </div>
                </div>
            ))}
        </div>
    ) : props.searchedType === "artist" ? (
        <div className="searched_details_container dff">
            {searchedCardDetails.map((searchedContent, index) => (
                <div key={searchedContent?.id || index} className="searched_element_container df-jc">
                    <div
                        className="searched_artist_img df"
                        style={{
                            backgroundImage: `url(${searchedContent?.image || ""})`,
                            backgroundSize: "cover",
                        }}
                    >
                        <div className="play_action_logo_container dff">
                            <i className="fa fa-play play_logo"></i>
                        </div>
                    </div>
                    <Link to={`/`} className="searched_element_name">
                        {formatString(searchedContent?.name || "Unknown", 20)}
                    </Link>
                    <div className="searched_element_creator searched_artist_creator">
                        Artist
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <>
            {/* {id: '6LLKlSqJGHNopRUIRimAfk', name: 'Taqdeer', image: 'https://i.scdn.co/image/ab6765630000ba8ac455906176cc38130445c52a', creator: 'Riya'} */}
            <div className="searched_podcast_container dff">
                <div className="podcast_head_container df-ai">
                    <Link to={`/`} className="podcast_head">
                        Podcasts & Shows
                    </Link>
                    <Link to={`/`} className="podcast_show_more_link">Show all</Link>
                </div>
                <div className="podcast_content_cards_container dff">
                    {searchedCardDetails.slice(0, 4).map((searchedContent) => (
                        <div className="podcast_content_card df">
                            <img src={searchedContent?.image || "unknown"} alt="Podcast" className="podcast_content_img" />
                            <Link to={`/`} className="podcast_name_container">
                                {formatString(searchedContent?.name || "Podcast Name", 19)}
                            </Link>
                            <h5 className="podcast_creator_name">
                                {formatString(searchedContent?.creator || "Podcast Creator", 20)}
                            </h5>
                        </div>
                    ))}
                </div>
            </div>
            <div className="searched_episode_container searched_podcast_container dff">
                <div className="podcast_head_container df-ai">
                    <Link to={`/`} className="podcast_head">
                        Episodes
                    </Link>
                    <Link to={`/`} className="podcast_show_more_link">Show all</Link>
                </div>
                <div className="episode_content_cards_container df-jc">
                    {searchedCardDetails.slice(50, 100).map((searchedContent) => (
                        <>
                            <div className="podcast_content_card episode_particular_content_card dff">
                                <div className="episode_content_img_container">
                                    <img src={searchedContent?.image || "unknown"} alt="Episode" className="episode_content_img" />
                                </div>
                                <div className="episode_content_container df">
                                    <h2 className="episode_name_container">
                                        {searchedContent?.name || "Episode Name"}
                                    </h2>
                                    <p className="episode_description_container">
                                        {formatString(searchedContent?.description || "Description", 120)}
                                    </p>
                                    <p className="episode_other_details_container">
                                        {formatEpisodeDate(searchedContent?.releaseDate || "2001-01-01")} • {formatTime2(searchedContent?.duration || 0)}
                                    </p>
                                </div>
                                <h5 className="episode_play_btn df">
                                    <div className="episode_play_container dff">
                                        <i className="fa fa-play episode_play_btn_icon"></i>
                                    </div>
                                </h5>
                            </div>
                            <span className="episode_divider"></span>
                        </>
                    ))}
                </div>
            </div>
        </>
    );
}
