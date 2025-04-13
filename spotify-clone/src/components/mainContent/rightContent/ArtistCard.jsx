import React, { useState } from "react";
import './ArtistCard.css';

export default function ArtistCard({ fetched_song_card_details }) {
    let artist_detail_info = fetched_song_card_details.main_artist?.bio || '';
    if (artist_detail_info.length > 111) {
        artist_detail_info = artist_detail_info.slice(0, 111) + '...';
    }

    const [isFollow, setFollow] = useState('Follow');

    const changeFollowArtist = () => {
        if (isFollow == 'Follow') setFollow('Unfollow');
        else setFollow('Follow');
    }

    return (
        <>
            <div className="artist_card df">
                <div className="artist_card_tagline df-ai">
                    About the artist
                </div>
                <div className="artist_card_artist_img_container df-ai">
                    <img src={`${fetched_song_card_details.main_artist?.image || ''}`} className="artist_card_artist_img"></img>
                </div>
                <a href="#" className="artist_name">{ fetched_song_card_details?.main_artist?.name || 'Artist Name' }</a>
                <div className="artist_brief_detail_container df-ai">
                    <p className="artist_brief_detail_left">
                        { fetched_song_card_details.main_artist?.monthly_listeners.toLocaleString('en-US') || '0' } monthly listeners
                    </p>
                    <button className="artist_brief_detail_right" onClick={changeFollowArtist}>
                        { isFollow }
                    </button>
                </div>
                <p className="artist_detailed_detail">
                    { artist_detail_info }
                </p>
            </div>
        </>
    )
}