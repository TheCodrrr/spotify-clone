import React from "react";
import './MediumCardItem.css'

export default function MediumCardItem2(props) {
    return (
        <>
            <div className="medium_card_item dff">
                <div className="medium_card_img_container df">
                    <div className="medium_card_play_pause_btn_container dff">
                        <i className="fa-solid fa-play medium_card_play_pause_btn"></i>
                    </div>
                </div>
                <div className="medium_card_content_container">
                    <h3 href="#" className="medium_card_content_head2">
                        { props.MediumCardDetails.category_item_card_name }
                    </h3>
                    { props.MediumCardDetails.category_item_card_creators }
                </div>
            </div>
        </>
    )
}