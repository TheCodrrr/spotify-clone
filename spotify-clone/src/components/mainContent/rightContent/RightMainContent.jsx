import React from "react";
import './RightMainContent.css';
import SongCardNavbar from "./SongCardNavbar";
import SongCardDetails from "./SongCardDetails";

export default function RightMainContent(props) {
    return (
        <>
            <div className="right_main_content_container df-ai" style = {{ ...props.common_styles, ...props.specific_style }}>
                <div className="right_main_content_song_container dff">
                    <SongCardNavbar/>
                    <SongCardDetails/>
                </div>
            </div>
        </>
    )
}