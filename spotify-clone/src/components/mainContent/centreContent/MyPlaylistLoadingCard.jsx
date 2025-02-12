import React from "react";
import './MyPlaylistLoadingCard.css'

export default function MyPlaylistLoadingCard() {
    return (
        <>
            <div className="my_playlist_card my_playlist_loading_card df-ai">
                {/* { props.details.user_playlist_name } */}
                <div className="my_playlist_loading_img_container dff">
                    
                </div>
                <div className="my_playlist_loading_content_container df-ai">
                    {/* <div className="my_playlist_name">
                        
                    </div> */}
                    {/* <div className="my_playlist_play_button_container dff">
                        <i className="fa-solid fa-play my_playlist_play_pause_button"></i>
                    </div> */}
                </div>
            </div>
        </>
    )
}