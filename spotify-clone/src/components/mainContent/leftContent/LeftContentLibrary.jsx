import React from "react";
import './LeftMainContent.css';
import LeftContentNavbar from "./LeftContentNavbar";
import LeftContentItemsContainer from "./LeftContentItemsContainer";

export default function LeftMainContentLibrary() {
    return (
        <>
            <div className="left_content_library">
                <LeftContentNavbar/>
                <LeftContentItemsContainer/>
            </div>
        </>
    )
}