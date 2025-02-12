import React from "react";
import './SongCardNavbar.css'

export default function SongCardNavbar() {
    return (
        <>
            <div className="song_card_navbar df-ai">
                <a className="song_navbar_name">
                    Best
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