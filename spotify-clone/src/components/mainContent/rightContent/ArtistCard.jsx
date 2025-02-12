import React, { useState } from "react";
import './ArtistCard.css';

export default function ArtistCard() {
    let artist_detail_info = "Playback Singers & Performers Based in Mumbai One of the most dynamic singer-music director duo of the industry presently. After participating in music reality shows - Shaarib in Sa Re Ga Ma Pa Challenge 2005 and Toshi in Amul Star Voice of India, they produced hits like Maahi (Raaz 2) and for others like Housefull 3, Humpty Sharma ki Dulhania, Fukrey Returns, Vada Raha. Their songs Tu Zaroori, Sharabi, Aaj Ro Len De, Biba, Emotional Fool have gone viral nation wide."
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
                    <div className="artist_card_artist_img"></div>
                </div>
                <a href="#" className="artist_name">Shaarib Toshi</a>
                <div className="artist_brief_detail_container df-ai">
                    <p className="artist_brief_detail_left">
                        8,705,119 montly listeners
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