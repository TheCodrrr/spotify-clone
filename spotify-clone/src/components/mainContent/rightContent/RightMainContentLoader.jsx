import React from "react";
import './RightMainContentLoader.css'

export default function RightMainContentLoader() {
    return (
        <>
            <div className="song_card_navbar df-ai">
                <div className="song_navbar_name_load"></div>
            </div>
            <div className="song_card_details_container_load">
                <div className="song_pic_container_load dff"></div>
                <div className="song_first_detail_container df-ai">
                    <div className="song_first_detail_container_left df-jc">
                        <div className="song_detail_name_load"></div>
                        <div className="song_detail_singer_load"></div>
                    </div>
                </div>
                <div className="song_artist_card_container dff">
                    <div className="artist_card_load df"></div>
                </div>
            </div>
        </>
    )
}