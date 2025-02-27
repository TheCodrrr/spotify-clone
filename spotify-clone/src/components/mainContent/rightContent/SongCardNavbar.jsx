import React from "react";
import './SongCardNavbar.css'

export default function SongCardNavbar({ fetched_song_card_details }) {

    return (
        <>
            <div className="song_card_navbar df-ai">
                <a className="song_navbar_name">
                    { fetched_song_card_details.playlist_name }
                </a>
                <div className="song_navbar_items_container dff">
                    <button className="btn_song_navbar_expand_container">
                        •••
                    </button>
                    <button className="btn_song_navbar_cancel_container dff">
                        <i className="fa-solid fa-xmark btn_song_navbar_cancel"></i>
                    </button>
                </div>
            </div>
        </>
    )
}