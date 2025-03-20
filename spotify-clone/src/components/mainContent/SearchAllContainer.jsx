import React from "react";
import './SearchAllContainer.css';
import { Link, useParams } from "react-router-dom";

export default function SearchAllContainer({ searchedDetails }) {
    const { id } = useParams();
    
    // Ensure searchedDetails is an object to avoid runtime errors
    const details = searchedDetails || {
        songs: [], artists: [], albums: [], playlists: [], podcasts: [], episodes: []
    };
    
    const top_result = details.songs?.[0] || {}; // Default empty object to prevent crashes
    top_result.artistsString = top_result?.artists?.join(", ") || "Unknown Artist"; 
    
    console.log("Episodes: ", JSON.stringify(details.episodes || []));

    const formatString = (strs, cutVal) => (strs?.length > cutVal ? strs.slice(0, cutVal) + '...' : strs || '');

    function formatTime(ms) {
        if (!ms || isNaN(ms)) return "0:00";
        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function formatDate(dateString) {
        if (!dateString) return "Unknown Date";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    }

    return (
        <div className="search_all_container">
            {/* Songs Section */}
            {details.songs?.length > 0 && (
                <div className="songs_container df-ai">
                    <div className="songs_container_child songs_container_left dff">
                        <h2 className="top_result_head df-ai">Top Result</h2>
                        <button className="top_result_container df">
                            <img src={top_result?.image || "default_image.jpg"} alt="Top Result" className="top_result_img" />
                            <Link to={`/`} className="top_result_name">
                                {formatString(top_result?.name, 15) || "Unknown Song"}
                            </Link>
                            <p className="top_result_details df-ai">
                                <span className="top_result_details_span">Song •&nbsp;</span> {formatString(top_result?.artistsString, 35)}
                            </p>
                            <div className="play_logo_container dff">
                                <i className="fa fa-play play_logo"></i>
                            </div>
                        </button>
                    </div>
                    <div className="songs_container_child songs_container_right df-jc">
                        <Link to={`/find/songs/${id}`} className="category_songs_head">Songs</Link>
                        <div className="category_songs_container dff">
                            {details.songs.map((song, index) => (
                                <button key={index} className="category_song df-ai">
                                    <div className="category_song_child_left dff">
                                        <div className="song_img" style={{ 
                                            backgroundImage: `url(${song?.image || "default_image.jpg"})`, 
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat'
                                        }}>
                                            <div className="song_play_logo_container">
                                                <i className="fa fa-play song_play_logo"></i>
                                            </div>
                                        </div>
                                        <div className="song_details_container df-jc">
                                            <Link to={`/`} className="song_details_upper_container df-ai">
                                                {formatString(song?.name, 20) || "Unknown"}
                                            </Link>
                                            <div className="song_details_lower_container df-ai">
                                                {formatString(song?.artists?.join(", "), 25) || "Unknown Artist"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="category_song_child_right dff">
                                        <div className="song_add_btn_container">
                                            <i className="fa fa-plus song_add_btn"></i>
                                        </div>
                                        <div className="song_duration_details">
                                            {formatTime(song?.duration)}
                                        </div>
                                        <div className="song_expand_btn_container">
                                            •••
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Artists Section */}
            {details.artists?.length > 0 && (
                <div className="artists_container df-jc">
                    <Link to={`/`} className="artists_head">Artists</Link>
                    <div className="artists_item_container dff">
                        {details.artists.map((artist, index) => (
                            <div className="artists_item" key={index}>
                                <div className="artists_img_container dff">
                                    <img src={artist?.image || "default_artist.jpg"} alt="Artist" className="artists_img" />
                                    <div className="play_logo_container dff">
                                        <i className="fa fa-play play_logo"></i>
                                    </div>
                                </div>
                                <div className="artists_content_container df-jc">
                                    <div className="artists_content_name">{artist?.name || "Unknown Artist"}</div>
                                    <div className="artists_content_type">Artist</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Other Categories */}
            {["albums", "playlists", "podcasts", "episodes"].map((category) => (
                details[category]?.length > 0 && (
                    <div key={category} className="category_items_container df-jc">
                        <Link to={`/`} className="category_items_head">{category.charAt(0).toUpperCase() + category.slice(1)}</Link>
                        <div className="category_content_container df-jc">
                            {details[category].map((item, index) => (
                                <div key={index} className="category_content_item df">
                                    <div className="category_item_img_container dff">
                                        <img src={item?.image || "default_image.jpg"} className="category_item_img" alt={item?.name || "Unknown"} />
                                        <div className="play_logo_container dff">
                                            <i className="fa fa-play play_logo"></i>
                                        </div>
                                    </div>
                                    <Link to={`/`} className="category_item_name">
                                        {formatString(item?.name, 17) || "Unknown"}
                                    </Link>
                                    <div className="category_item_other_details">
                                        {category === "albums" && `${item?.releaseYear || "Unknown Year"} • ${item?.artists?.join(", ") || "Unknown Artist"}`}
                                        {category === "playlists" && `By ${item?.creator || "Unknown Creator"}`}
                                        {category === "podcasts" && item?.creator}
                                        {category === "episodes" && `${formatDate(item?.releaseDate)} • ${Math.floor((item?.duration || 0) / 60000)} min`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}
        </div>
    );
}
