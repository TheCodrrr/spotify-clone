import React, { useState } from "react";
import './SingerCard.css';

export default function SingerCard({ fetched_singer_details }) {
    const [isFollow, setFollow] = useState('Follow');

    const changeFollow = () => {
        if (isFollow == 'Follow') setFollow('Unfollow');
        else setFollow('Follow');
    }

    return (
        <>
            <div className="singer_card dff">
                <div className="singer_card_left df-jc">
                    <a href="#" className="singer_name">{ fetched_singer_details.name }</a>
                    <div className="singer_designation">{ fetched_singer_details.role }</div>
                </div>
                <div className="singer_card_right df-ai">
                    <button className="btn_singer_card_follow" onClick={changeFollow}>
                        { isFollow }
                    </button>     
                </div>
            </div>
        </>
    )
}