import React from "react";
import './SongCardNavbar.css'
import { Link } from "react-router-dom";

export default function SongCardNavbar({ fetched_song_card_details, handleCancel }) {

    return (
        <>
            <div className="song_card_navbar df-ai">
                <Link to={`/playlist/${fetched_song_card_details.playlist_name}`} className="song_navbar_name">
                    { fetched_song_card_details.playlist_name }
                </Link>
                <div className="song_navbar_items_container dff">
                    <button className="btn_song_navbar_expand_container">
                        •••
                    </button>
                    <button className="btn_song_navbar_cancel_container dff" onClick={() => handleCancel(false)}>
                        <i className="fa-solid fa-xmark btn_song_navbar_cancel"></i>
                    </button>
                </div>
            </div>
        </>
    )
}