import React from "react";
import './LeftContentPlaylistCard.css'
import { Link } from "react-router-dom";


export default function LeftContentPlaylistCard({ data }) {
    let left_card_description_head, left_card_lower_description;
    console.log("This is " + data);

    if (data['is_last_active']) {
        left_card_description_head = (
            <h4 className="left_card_description_head paint_active df-ai">
                { data['user_playlist_name'] }
            </h4>
        )
    }
    else {
        left_card_description_head = (
            <h4 className="left_card_description_head df-ai">
                { data['user_playlist_name'] }
            </h4>
        )
    }

    if (data['is_card_pinned']) {
        left_card_lower_description = (
            <>
                <i className="fa-solid fa-thumbtack card_pinned"></i>
                <p className="para_card_type">
                    {/* { data['card_type'] } */}
                    Playlist
                </p>
                <li></li>
                <p className="para_card_owner">
                    { data['user_playlist_owner'] }
                </p>
            </>
        )
    }
    else {
        left_card_lower_description = (
            <>
                <p className="para_card_type">
                    {/* { data['card_type'] } */}
                    Playlist
                </p>
                <li></li>
                <p className="para_card_owner">
                { data['user_playlist_owner'] }
                </p>
            </>
        )
    }

    const BackgroundStyle = {
        backgroundImage: `url(${ data['user_playlist_image'] })`,
        backgroundSize: '100%'
    }

    return (
        <>
            <Link className="left_card dff" to={`/playlist/${data['user_playlist_name']}`} >
                <div className="left_card_img_outer_container dff">
                    <div className="left_card_img_inner_container dff" style={BackgroundStyle}>
                        <div className="play_pause_button_container dff">
                            <i className="fa-solid fa-play play_pause_button"></i>
                        </div>
                    </div>
                </div>
                <div className="left_card_description_container df-jc">
                    <div className="left_card_description_child left_card_description_upper">
                        { left_card_description_head }
                    </div>
                    <div className="left_card_description_child left_card_description_lower df-ai">
                        { left_card_lower_description }
                    </div>
                </div>
            </Link>
        </>
    )
 }