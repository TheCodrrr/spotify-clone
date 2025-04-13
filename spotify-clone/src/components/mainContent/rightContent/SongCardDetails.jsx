import React from "react";
import './SongCardDetails.css'
import ArtistCard from "./ArtistCard";
import CreditsCard from "./CreditsCard";
import QueueCard from "./QueueCard";

export default function SongCardDetails({ fetched_song_card_details }) {

    let artistNames = fetched_song_card_details?.artists?.map(arts => arts.name).join(', ');
    
    if (artistNames?.length > 25) {
        artistNames = artistNames.slice(0, 25) + '...'
    }

    const songName = fetched_song_card_details?.song_name || '';
    const songUsedName = songName.length > 23 ? songName.slice(0, 23) : songName;

    return (
        <>
            <div className="song_card_details_container">
                <img className="song_pic_container dff" src={`${fetched_song_card_details.song_image}`}>

                </img>
                <div className="song_first_detail_container dff">
                    <div className="song_first_detail_container_left df-jc">
                        <h2 className="song_detail_name">
                            { songUsedName }
                        </h2>
                        <div className="song_detail_singer">
                            { artistNames }
                        </div>
                    </div>
                    <div className="song_first_detail_container_right df-ai">
                        <div className="btn_song_link_container dff">
                            <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 dYnaPI btn_song_link_svg"><path d="M1 5.75A.75.75 0 0 1 1.75 5H4v1.5H2.5v8h11v-8H12V5h2.25a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75H1.75a.75.75 0 0 1-.75-.75v-9.5z"></path><path d="M8 9.576a.75.75 0 0 0 .75-.75V2.903l1.454 1.454a.75.75 0 0 0 1.06-1.06L8 .03 4.735 3.296a.75.75 0 0 0 1.06 1.061L7.25 2.903v5.923c0 .414.336.75.75.75z"></path></svg>
                        </div>
                        <div className="btn_song_saved_container dff">
                            <i className="fa-solid fa-check btn_song_saved"></i>
                        </div>
                    </div>
                </div>
                <div className="song_artist_card_container dff">
                    <ArtistCard fetched_song_card_details = { fetched_song_card_details }/>
                </div>
                <div className="song_credits_card_container dff">
                    <CreditsCard fetched_song_card_details = { fetched_song_card_details }/>
                </div>
                <div className="song_queue_card_container dff">
                    <QueueCard fetched_song_card_details = { fetched_song_card_details }/>
                </div>
            </div>
        </>
    )
}