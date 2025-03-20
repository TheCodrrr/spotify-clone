import React, { useEffect, useState } from "react";
import "./EnlargedSearchedCard.css";
import { Link, useLocation } from "react-router-dom";

export default function EnlargedSearchedCard(props) {
    const [loading, setLoading] = useState(true);
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
                <tr key={songs?.id || index} className="songs_table_row_container songs_table_row df-ai">
                    <td className="song_col1 song_col_value1 dff">{index + 1}</td>
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
    ) : (
        <>{props.searchedType}</>
    );
}
