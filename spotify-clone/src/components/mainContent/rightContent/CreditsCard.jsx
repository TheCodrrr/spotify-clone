import React, { useEffect, useState } from "react";
import './CreditsCard.css';
import SingerCard from "./SingerCard";

export default function CreditsCard({ fetched_song_card_details }) {
    const [contributors, setContributors] = useState([]);
    const [shortContributors, setShortContributors] = useState([]);
    const [isMore, setIsMore] = useState(false);
    
    useEffect(() => {
        setContributors(fetched_song_card_details?.contributors);
    
        if (fetched_song_card_details?.contributors?.length > 3) {
            setShortContributors(fetched_song_card_details.contributors.slice(0, 3));
            setIsMore(true);
        } else {
            setShortContributors(fetched_song_card_details?.contributors);
            setIsMore(false);
        }
    }, [fetched_song_card_details]); // Dependency added
    


    const singerCards = shortContributors?.map((item, index) => (
        <SingerCard singer_details={item} key={index} fetched_singer_details={item} />
    ));
    return (
        <>
            <div className="credits_card">
                <div className="credits_card_head_container df-ai">
                    <div className="credits_card_head">Credits</div>
                    { isMore ? (
                        <button className="btn_credits_card_show">Show all</button>
                    ) : (
                        ""
                    ) }
                </div>
                <div className="credits_card_singers_container df-jc">
                    { singerCards }
                </div>
            </div>
        </>
    )
}