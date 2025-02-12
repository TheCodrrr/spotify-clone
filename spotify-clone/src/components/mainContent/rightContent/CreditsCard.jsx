import React from "react";
import './CreditsCard.css';
import SingerCard from "./SingerCard";

export default function CreditsCard() {
    let singers_involved = [
        { name: 'Shaarib Toshi', designation: 'Main Artist', allowFollow: true},
        { name: 'Arijit Singh', designation: 'Main Artist', allowFollow: true},
        { name: 'Sharib Sabri', designation: 'Composer', allowFollow: false},
    ]
    const singerCards = singers_involved.map((item) => (
        <SingerCard singer_details={item} />
    ));
    return (
        <>
            <div className="credits_card">
                <div className="credits_card_head_container df-ai">
                    <div className="credits_card_head">Credits</div>
                    <button className="btn_credits_card_show">Show all</button>
                </div>
                <div className="credits_card_singers_container df-jc">
                    { singerCards }
                </div>
            </div>
        </>
    )
}