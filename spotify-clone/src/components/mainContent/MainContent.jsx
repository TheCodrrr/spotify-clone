import React from "react";
import './MainContent.css';
import LeftMainContent from "./leftContent/LeftMainContent";
import CentreMainContent from "./centreContent/CentreMainContent";
import RightMainContent from "./rightContent/RightMainContent";
import EnlargedPlaylistCard from "./EnlargedPlaylistCard";
import EnlargedBrowseCard from "./EnlargedBrowseCard";
import { Routes, Route } from 'react-router-dom';
import EnlargedMediumPlaylistCard from "./centreContent/EnlargedMediumPlaylistCard";

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
        <div className="main_content_container df-ai">
            <LeftMainContent common_styles={commonStyles} specific_style={leftMainContentStyle} />
            <Routes>
                <Route path="/" element={<CentreMainContent common_styles={commonStyles} specific_style={centreMainContentStyle} />} />
                <Route path="/playlist/public/:id" element={<EnlargedPlaylistCard common_styles={commonStyles} specific_style={centreMainContentStyle} />} />
                <Route path="/playlist/:name" element={<EnlargedPlaylistCard common_styles={commonStyles} specific_style={centreMainContentStyle} />} />
                <Route path="/search" element={<EnlargedBrowseCard common_styles={commonStyles} specific_style={centreMainContentStyle} />} />
                <Route path="/section" element={<EnlargedMediumPlaylistCard common_styles={commonStyles} specific_style={centreMainContentStyle} />} />
            </Routes>
            <RightMainContent common_styles={commonStyles} specific_style={rightMainContentStyle} />
        </div>
    )
}