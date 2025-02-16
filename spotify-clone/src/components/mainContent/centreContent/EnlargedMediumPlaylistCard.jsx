import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import './EnlargedMediumPlaylistCard.css'
import EnlargedMediumPlaylist from "./EnlargedMediumPlaylist";

export default function EnlargedMediumPlaylistCard(props) {
    const location = useLocation();
    const sectionData = location.state;
    // console.log("From EnlargedMediumPlaylistCard: " + JSON.stringify(sectionData));
    
    console.log(`This is from EnlargedMediumPlaylistCard.jsx: ${JSON.stringify(sectionData)}`);

    let SectionPlaylists = sectionData['section_playlists'].map((item) => (
        <EnlargedMediumPlaylist section_playlist_data={item} />
    ))

    return (
        <>
            <div className="enlarged_section_card_container" style={{ ...props.common_styles, ...props.specific_style }}>
                {/* Hello World */}
                {/* { JSON.stringify(sectionData) } */}
                <h1 className="section_head">
                    { sectionData['section_name'] }
                </h1>
                <div className="enlarged_section_playlists_container df-ai">
                    { SectionPlaylists }
                </div>
                <Footer/>
            </div>
        </>
    )
}