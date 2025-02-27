import React, { useContext } from "react";
import './MyPlaylistCard.css'
import { Link } from "react-router-dom";
import { HoverContext } from "./HoverContext";

export default function MyPlaylistCard(props) {
    const { setHoverImage } = useContext(HoverContext);

    console.log("From MyPlaylistCard: " + JSON.stringify(props))
    if (props.details.user_playlist_name.length > 15) {
        props.details.user_playlist_name = props.details.user_playlist_name.slice(0, 15) + '...';
    }

    return (
        <>
            <Link
            className="my_playlist_card dff"
            to={`/playlist/${props.details.user_playlist_name}`}
            // style={{backgroundColor: 'red'}}
            onMouseEnter={(event) => {
                setHoverImage(props.details.user_playlist_image);
            
                // Get computed background color of the closest element that has a background
                const parentElement = event.target.closest(".my_playlist_card") || event.target;
                const computedStyle = window.getComputedStyle(parentElement);
                const currentBgColor = computedStyle.backgroundColor;
            
                console.log("Mouse Enter - Background color:", currentBgColor);
            }}
            
            onMouseLeave={(event) => {
                setHoverImage("");
            
                // Get computed background color of the closest element that has a background
                const parentElement = event.target.closest(".my_playlist_card") || event.target;
                const computedStyle = window.getComputedStyle(parentElement);
                const currentBgColor = computedStyle.backgroundColor;
            
                console.log("Mouse Leave - Background color:", currentBgColor);
            }}
            >
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