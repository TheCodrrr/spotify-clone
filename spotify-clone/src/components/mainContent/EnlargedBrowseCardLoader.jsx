import React from "react";
import './EnlargedBrowseCardLoader.css'

export default function EnlargedBrowseCardLoader(props) {
    const sections = [3, 3]

    return (
        <>
            <div
                className="enlarged_browser_card_container"
                style={{ ...props.common_styles, ...props.specific_style }}
            >
                {sections.map((count, index) => (
                <React.Fragment key={index}>
                    <h1 className="browse_head_load"></h1>
                    <div className="browse_elms_container dff">
                    {[...Array(count)].map((_, i) => (
                        <div className="browse_elm_load" key={i}>
                        <div className="browse_elm_head"></div>
                        </div>
                    ))}
                    </div>
                </React.Fragment>
                ))}
            </div>
        </>
    )
}