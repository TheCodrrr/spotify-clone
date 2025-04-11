import React from "react";
import './MediumCategoryLoadCard.css'

export default function MediumCategoryLoadCard() {
    // Create an array of 5 placeholder items
    const placeholderItems = Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="medium_card_item_load dff">
            <div className="medium_card_img_container_load df">
                <div className="medium_card_name_container">
                    {/* Empty name container */}
                </div>
                <div className="medium_card_play_pause_btn_container dff">
                    <i className="fa-solid fa-play medium_card_play_pause_btn"></i>
                </div>
            </div>
            <div className="medium_card_content_container">
                {/* Empty content */}
            </div>
        </div>
    ));

    return (
        <>
            <div className="medium_category_card_container_load dff">
                <div className="medium_category_card_head_container_load df">
                    <div className="medium_category_card_head_load">
                        {/* Empty section name */}
                    </div>
                </div>
                <div className="medium_card_item_outer_container_load dff">
                    <div className="medium_card_item_container_load dff">
                        {placeholderItems}
                    </div>
                </div>
            </div>
        </>
    );
}