import React, { useState } from "react";
import './LeftContentNavbar.css';
import { useNavigate } from "react-router-dom";

export default function LeftContentNavbar() {
    const [playlistCreateOpen, setPlaylistCreateOpen] = useState(false);
    const navigate = useNavigate();

    const navigatePlaylistCreate = () => {
        navigate('/playlist/create');
    }
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
                    <div className={`btn_left_navbar_add_container dff ${playlistCreateOpen ? "playlist_adder_open" : ""}`} onClick={() => setPlaylistCreateOpen(!playlistCreateOpen)}>
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

            { playlistCreateOpen ? (
                <div className="create_option_card dff">
                    <div className="create_option_btn df-ai" onClick={navigatePlaylistCreate}>
                        <div className="create_option_img_container dff">
                            <svg data-encore-id="icon" role="img" aria-hidden="true" className="e-9800-icon e-9800-baseline nUKFlsWLX7TAGu3w1Xz1" viewBox="0 0 24 24"><path d="M3 8V5H0V3h3V0h2v3h3v2H5v3H3zm8-4c0 .34-.024.673-.07 1H19v9.667h-1.5a3.5 3.5 0 1 0 3.5 3.5V3H10.93c.046.327.07.66.07 1zm8 12.667v1.5a1.5 1.5 0 1 1-1.5-1.5H19zM6 10.71a6.972 6.972 0 0 0 2-.965v8.422a3.5 3.5 0 1 1-3.5-3.5H6V10.71zm0 5.957H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path></svg>
                        </div>
                        <div className="create_option_content_container df-jc">
                            <h3 className="create_option_content_head">Playlist</h3>
                            <p className="create_option_content_para">Build a playlist with songs, or episodes</p>
                        </div>
                    </div>
                    <span className="create_option_btn_divider"></span>
                    <div className="create_option_btn df-ai">
                        <div className="create_option_img_container dff">
                            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="24" fill="none" className="nUKFlsWLX7TAGu3w1Xz1"><circle cx="17.455" cy="8.727" r="8.727" fill="#FFF" opacity="0.5" className="v2HGltjHaf2piGbK3DMj logo_circle1"></circle><circle cx="8.727" cy="15.273" r="8.727" fill="#FFF" opacity="0.3" className="m5lo6j_0WDXhihWNUco_ logo_circle2"></circle><path fill="#FFF" fill-rule="evenodd" d="M17.18 17.446a8.728 8.728 0 0 1-8.179-10.9 8.728 8.728 0 0 1 8.18 10.9Z" clip-rule="evenodd" className="EiTElM4c2BMgbdfJhyZ6 logo_path"></path></svg>
                        </div>
                        <div className="create_option_content_container df-jc">
                            <h3 className="create_option_content_head">Blend</h3>
                            <p className="create_option_content_para">Mix up your tastes with friends</p>
                        </div>
                    </div>
                    <div className="create_option_btn df-ai">
                        <div className="create_option_img_container dff">
                            <svg data-encore-id="icon" role="img" aria-hidden="true" className="e-9800-icon e-9800-baseline nUKFlsWLX7TAGu3w1Xz1" viewBox="0 0 24 24"><path d="M1 4a2 2 0 0 1 2-2h5.155a3 3 0 0 1 2.598 1.5l.866 1.5H21a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm7.155 0H3v16h18V7H10.464L9.021 4.5a1 1 0 0 0-.866-.5z"></path></svg>
                        </div>
                        <div className="create_option_content_container df-jc">
                            <h3 className="create_option_content_head">Folder</h3>
                            <p className="create_option_content_para">Organize your playlists</p>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}