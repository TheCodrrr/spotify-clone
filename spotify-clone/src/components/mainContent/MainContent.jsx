import React from "react";
import './MainContent.css';
import LeftMainContent from "./leftContent/LeftMainContent";
import CentreMainContent from "./centreContent/CentreMainContent";
import RightMainContent from "./rightContent/RightMainContent";
import EnlargedPlaylistCard from "./EnlargedPlaylistCard";
import EnlargedBrowseCard from "./EnlargedBrowseCard";
import { Routes, Route } from 'react-router-dom';
import EnlargedMediumPlaylistCard from "./centreContent/EnlargedMediumPlaylistCard";
import PublicPlaylist from "./PlaylistPublic";
import EnlargedSong from "./EnlargedSong";
import { HoverProvider } from "./centreContent/HoverContext";
import EnlargedSearchResult from "./EnlargedSearchResult.jsx";
import CreatePlaylist from "./centreContent/CreatePlaylist.jsx";

let leftContentWidth = 20.9;
let centreContentWidth = 56.3;
let rightContentWidth = 100 - leftContentWidth - centreContentWidth;
const commonStyles = {
    height: '100%',
}

const leftMainContentStyle = {
    width: `${leftContentWidth}%`,
}
const centreMainContentStyle = {
    width: `${centreContentWidth}%`,
}
const rightMainContentStyle = {
    width: `${rightContentWidth}%`,
}

export default function MainContent() {
    return (
        <HoverProvider>
            <div className="main_content_container df-ai">
                <LeftMainContent common_styles={commonStyles} specific_style={leftMainContentStyle} />
                <Routes>
                    <Route path="/" element={<CentreMainContent common_styles={commonStyles} specific_style={centreMainContentStyle} />} />
                    <Route path="/find/:searchType?/:id" element={<EnlargedSearchResult common_styles={commonStyles} specific_style={centreMainContentStyle} />} />
                    <Route path="/song/:id" element={<EnlargedSong common_styles={commonStyles} specific_style={centreMainContentStyle} />} />
                    <Route path="/item/:id" element={<PublicPlaylist common_styles={commonStyles} specific_style={centreMainContentStyle} />} />
                    <Route path="/playlist/create" element={<CreatePlaylist common_styles={commonStyles} specific_style={centreMainContentStyle} />} />
                    <Route path="/playlist/:name" element={<EnlargedPlaylistCard common_styles={commonStyles} specific_style={centreMainContentStyle} />} />
                    <Route path="/search" element={<EnlargedBrowseCard common_styles={commonStyles} specific_style={centreMainContentStyle} />} />
                    <Route path="/section" element={<EnlargedMediumPlaylistCard common_styles={commonStyles} specific_style={centreMainContentStyle} />} />
                </Routes>
                <RightMainContent common_styles={commonStyles} specific_style={rightMainContentStyle} />
            </div>
        </HoverProvider>
    )
}