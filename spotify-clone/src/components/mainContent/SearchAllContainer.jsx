import React from "react";
import './SearchAllContainer.css'
import { Link, useParams } from "react-router-dom";

export default function SearchAllContainer({ searchedDetails }) {
    const { id } = useParams();
    const details = searchedDetails;
    const top_result = details.songs[0]
    // console.log("THis is not what it is: " + JSON.stringify(searchedDetails))
    // console.log("dhbkdhfbvkfvbkfc " + top_result);
    top_result.artistsString = top_result.artists.join(", ")
    console.log("fvkndfjvbnaldg " + JSON.stringify(details.episodes))

    const formatString = (strs, cutVal) => {
        return strs.length > cutVal ? strs.slice(0, cutVal) + '...' : strs
    }

    function formatTime(ms) {
        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
        
        // Ensuring seconds always have two digits
        let formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
        
        return `${minutes}:${formattedSeconds}`;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    }

    // console.log("search all container here sir: " + JSON.stringify(details));
    return (
        <>
            <div className="search_all_container">
                <div className="songs_container df-ai">
                    <div className="songs_container_child songs_container_left dff">
                        <h2 className="top_result_head df-ai">Top Result</h2>
                        <button className="top_result_container df">
                            <img src={top_result.image} alt="Top Result" className="top_result_img" />
                            <Link to={`/`} className="top_result_name">
                                { formatString(top_result.name, 15) }
                            </Link>
                            <p className="top_result_details df-ai">
                                <span className="top_result_details_span">Song •&nbsp;</span> { formatString(top_result.artistsString, 35) }
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
                                        backgroundImage: `url(${song.image})`, 
                                        backgroundSize: '100% 100%', 
                                        backgroundPosition: 'center', 
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                        <div className="song_play_logo_container">
                                            <i className="fa fa-play song_play_logo"></i>
                                        </div>
                                    </div>
                                    <div className="song_details_container df-jc">
                                        <Link to={`/`} className="song_details_upper_container df-ai">
                                            {formatString(song.name, 20)}
                                        </Link>
                                        <div className="song_details_lower_container df-ai">
                                            {formatString(song.artists.join(", "), 25)}  
                                        </div>
                                    </div>
                                </div>
                                <div className="category_song_child_right dff">
                                    <div className="song_add_btn_container">
                                        <i className="fa fa-plus song_add_btn"></i>
                                    </div>
                                    <div className="song_duration_details">
                                        {formatTime(song.duration)}
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
                <div className="artists_container df-jc">
                    <Link to={`/`} className="artists_head">Artists</Link>
                    <div className="artists_item_container dff">
                    {details.artists.map((artist, index) => (
                        <div className="artists_item" key={index}>
                            <div className="artists_img_container dff">
                                <img src={artist.image} alt="Artist" className="artists_img" />
                                <div className="play_logo_container dff">
                                    <i className="fa fa-play play_logo"></i>
                                </div>
                            </div>
                            <div className="artists_content_container df-jc">
                                <div className="artists_content_name">
                                    {artist.name}
                                </div>
                                <div className="artists_content_type">
                                    Artist
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                <div className="category_items_container df-jc">
                    <Link to={`/`} className="category_items_head">Albums</Link>
                    <div className="category_content_container df-jc">
                    {details.albums.map((album, index) => (
                        <div key={index} className="category_content_item df">
                            <div className="category_item_img_container dff">
                                <img src={album.image} className="category_item_img" alt={album.name} />
                                <div className="play_logo_container dff">
                                    <i className="fa fa-play play_logo"></i>
                                </div>
                            </div>
                            <Link to={`/`} className="category_item_name">
                                { formatString(album.name, 17) }
                            </Link>
                            <div className="category_item_other_details">
                                {album.releaseYear} • {album.artists.join(", ")}
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                <div className="category_items_container df-jc">
                    <Link to={`/`} className="category_items_head">Playlists</Link>
                    <div className="category_content_container df-jc">
                    {details.playlists.map((playlist, index) => (
                        <div key={index} className="category_content_item df">
                            <div className="category_item_img_container dff">
                                <img src={playlist.image} className="category_item_img" alt={playlist.name} />
                                <div className="play_logo_container dff">
                                    <i className="fa fa-play play_logo"></i>
                                </div>
                            </div>
                            <Link to={`/`} className="category_item_name">
                                { formatString(playlist.name, 17) }
                            </Link>
                            <div className="category_item_other_details">
                                By {playlist.creator}
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                <div className="category_items_container df-jc">
                    <Link to={`/`} className="category_items_head">Podcasts</Link>
                    <div className="category_content_container df-jc">
                    {details.podcasts.map((podcast, index) => (
                        <div key={index} className="category_content_item df">
                            <div className="category_item_img_container dff">
                                <img src={podcast.image} className="category_item_img" alt={podcast.name} />
                                <div className="play_logo_container dff">
                                    <i className="fa fa-play play_logo"></i>
                                </div>
                            </div>
                            <Link to={`/`} className="category_item_name">
                                { formatString(podcast.name, 17) }
                            </Link>
                            <div className="category_item_other_details">
                                { podcast.creator }
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                <div className="category_items_container df-jc">
                    <Link to={`/`} className="category_items_head">Episodes</Link>
                    <div className="category_content_container df-jc">
                    {details.episodes.map((podcast, index) => (
                        <div key={index} className="category_content_item df">
                            <div className="category_item_img_container dff">
                                <img src={podcast.image} className="category_item_img" alt={podcast.name} />
                                <div className="play_logo_container dff">
                                    <i className="fa fa-play play_logo"></i>
                                </div>
                            </div>
                            <Link to={`/`} className="category_item_name">
                                { formatString(podcast.name, 35) }
                            </Link>
                            <div className="category_item_other_details">
                                { formatDate(podcast.releaseDate) } • { Math.floor(podcast.duration/60000) } min
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </>
    )
}