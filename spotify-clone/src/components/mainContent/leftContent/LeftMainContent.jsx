import React from "react";
import LeftMainContentLibrary from "./LeftContentLibrary";
import './LeftMainContent.css';

export default function LeftMainContent(props) {
    return (
        <>
            <div className="left_main_content_container df-ai" style = { { ...props.common_styles, ...props.specific_style} }>
                <LeftMainContentLibrary/>
            </div>
        </>
    )
}