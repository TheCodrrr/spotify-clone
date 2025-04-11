import React, { useState, useEffect } from "react";
import './CreatePlaylist.css';
import Footer from "./Footer";

export default function CreatePlaylist(props) {
    const [playlistName, setPlaylistName] = useState("My Playlist");
    const [playlistDescription, setPlaylistDescription] = useState("Add a description");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [linear_styles, setLinearStyles] = useState({
        background: 'linear-gradient(rgb(50, 50, 50) 0%, rgb(30, 30, 30) 30%)'
    });
    const [linear_styles2, setLinearStyles2] = useState({
        background: 'linear-gradient(rgba(50, 50, 50, 0.8) 0px, #131313 280px)'
    });

    // Placeholder image for new playlist
    const placeholderImage = "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999";

    // Handle input changes
    const handleNameChange = (e) => {
        setPlaylistName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setPlaylistDescription(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleOpenEditModal = () => {
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleSaveDetails = () => {
        // Save playlist details (in a real app, this would call an API)
        console.log("Saving playlist details:", {
            name: playlistName,
            description: playlistDescription
        });
        setShowEditModal(false);
    };

    // Edit Modal Component
    const EditDetailsModal = () => {
        if (!showEditModal) return null;
        
        return (
            <div className="edit_modal_overlay">
                <div className="edit_modal_container">
                    <div className="edit_modal_header">
                        <h2>Edit details</h2>
                        <button className="cancel_button dff" onClick={handleCloseEditModal}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className="edit_modal_content">
                        <div className="edit_modal_image_container">
                            <img 
                                src={placeholderImage} 
                                alt="Playlist" 
                                className="edit_modal_image" 
                            />
                            <div className="image_overlay">
                                <i className="fa fa-camera" aria-hidden="true"></i>
                                <span>Choose photo</span>
                            </div>
                        </div>
                        <div className="edit_modal_inputs">
                            <input
                                type="text"
                                className="modal_playlist_name_input"
                                value={playlistName}
                                onChange={handleNameChange}
                                placeholder="Add a name"
                            />
                            <textarea
                                className="modal_playlist_description_input"
                                value={playlistDescription}
                                onChange={handleDescriptionChange}
                                placeholder="Add an optional description"
                            />
                        </div>
                    </div>
                    <div className="edit_modal_footer">
                        <button className="save_button" onClick={handleSaveDetails}>Save</button>
                        <p className="disclaimer_text">
                            By proceeding, you agree to give Spotify access to the image you choose to upload. 
                            Please make sure you have the right to upload the image.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className="enlarged_playlist_container"
            style={{ ...props.common_styles, ...props.specific_style }}
        >
            <div
                className="enlarged_playlist_upper_container dff"
                style={{ ...linear_styles }}
            >
                <div className="enlarged_playlist_img_container dff" onClick={handleOpenEditModal}>
                    <img
                        src={placeholderImage}
                        alt="Playlist"
                        className="banner_images"
                    />
                </div>
                <div className="enlarged_playlist_head_container df">
                    <h5 className="enlarged_content_type">Public Playlist</h5>
                    <h1 className="enlarged_content_name enlarged_content_name2 df-ai" onClick={handleOpenEditModal}>
                        {playlistName}
                    </h1>
                    <div className="enlarged_content_other_details df-ai">
                        <img src="#" alt="User Profile" className="enlarged_content_other_details_child enlarged_content_other_details_child_image" />
                        <div className="enlarged_content_other_details_child">
                            The Aryan
                        </div>
                        <span className="enlarged_content_other_details_child">•</span>
                    </div>
                </div>
            </div>
            <div
                className="enlarged_playlist_lower_container"
                style={{ ...linear_styles2 }}
            >
                <div className="middle_navbar_tab_container df-ai">
                    <div className="middle_navbar_child middle_navbar_left_container dff">
                        <button className="invite_collaborators_button">
                            <i className="fa fa-user-plus" aria-hidden="true"></i>
                        </button>
                        <div className="middle_navbar_expand_btn_container dff">
                            • • •
                        </div>
                    </div>
                    <div className="middle_navbar_child middle_navbar_right_container dff">
                        <div className="middle_navbar_content_list_btn dff">
                            List
                            <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 cAMMLk btn_left_content_list_svg">
                                <path d="M15 14.5H5V13h10v1.5zm0-5.75H5v-1.5h10v1.5zM15 3H5V1.5h10V3zM3 3H1V1.5h2V3zm0 11.5H1V13h2v1.5zm0-5.75H1v-1.5h2v1.5z" className="btn_left_content_list_path"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="search_songs_container">
                    <div className="search_bar_parent_container df-ai">
                        <div className="search_bar_left dff">
                            <div className="search_header">
                                <h2>Let's find something for your playlist</h2>
                            </div>
                            <div className="search_bar_container">
                                <div className="search_icon">
                                    <i className="fa fa-search" aria-hidden="true"></i>
                                </div>
                                <input
                                    type="text"
                                    className="search_input"
                                    placeholder="Search for songs or episodes"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                        <div className="search_input_cancel">
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                    
                    <div className="search_results_container">
                        {searchTerm.length > 0 ? (
                            <p className="search_placeholder">Search results would appear here</p>
                        ) : (
                            <div className="empty_search_message">
                                <p>Search for your favorite songs to add to your playlist</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
            <EditDetailsModal />
        </div>
    );
}