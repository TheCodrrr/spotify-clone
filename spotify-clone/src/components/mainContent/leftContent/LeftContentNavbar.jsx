import React from "react";
import './LeftContentNavbar.css';

export default function LeftContentNavbar() {
    return (
        <>
            <div className="left_content_navbar df-ai">
                <div className="navbar_child_container navbar_upper_child_container dff">
                    <div className="toggle_library_btn_container dff">
                        <div className="btn_toggle_left_navbar_container dff">
                            <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" className="Svg-sc-ytk21e-0 bneLcE btn_toggle_left_navbar_svg"><path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" className="btn_toggle_left_navbar_path"></path></svg>
                        </div>
                        <h4 className="left_navbar_head">Your Library</h4>
                    </div>
                    <div className="btn_left_navbar_add_container dff">
                        <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 dYnaPI btn_left_navbar_add_svg"><path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z" className="btn_left_navbar_add_path"></path></svg>
                    </div>
                    <div className="btn_left_navbar_left_arrow_container dff">
                        <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 cAMMLk btn_left_navbar_left_arrow_svg"><path d="M7.19 1A.749.749 0 0 1 8.47.47L16 7.99l-7.53 7.521a.75.75 0 0 1-1.234-.815.75.75 0 0 1 .174-.243l5.72-5.714H.75a.75.75 0 1 1 0-1.498h12.38L7.41 1.529a.749.749 0 0 1-.22-.53z" className="btn_left_navbar_left_arrow_path"></path></svg>
                    </div>
                </div>
                <div className="navbar_child_container navbar_lower_child_container df-ai">
                    <button className="left_navbar_elm left_navbar_elm1">Playlists</button>
                    <button className="left_navbar_elm left_navbar_elm2">Artists</button>
                </div>
            </div>
        </>
    )
}