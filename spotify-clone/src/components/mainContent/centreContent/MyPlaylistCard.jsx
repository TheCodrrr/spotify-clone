import React from "react";
import './MyPlaylistCard.css'
import { Link } from "react-router-dom";

export default function MyPlaylistCard(props) {
    console.log("From MyPlaylistCard: " + JSON.stringify(props))
    if (props.details.user_playlist_name.length > 15) {
        props.details.user_playlist_name = props.details.user_playlist_name.slice(0, 15) + '...';
    }

    return (
        <>
            <Link className="my_playlist_card dff" to={`/playlist/${props.details.user_playlist_name}`}>
                {/* { props.details.user_playlist_name } */}
                <div className="my_playlist_img_container dff">
                    <img src={ props.details.user_playlist_image } alt="Playlist" className="my_playlist_img" />
                </div>
                <div className="my_playlist_content_container df-ai">
                    <div className="my_playlist_name">
                        { props.details.user_playlist_name }
                    </div>
                    <div className="my_playlist_play_button_container dff">
                        <i className="fa-solid fa-play my_playlist_play_pause_button"></i>
                    </div>
                </div>
            </Link>
        </>
    )
}