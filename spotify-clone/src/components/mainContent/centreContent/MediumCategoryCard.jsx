import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import './MediumCategoryCard.css'
import MediumCardItem from "./MediumCardItem";
import MediumCardItem2 from "./MediumCardItem2";
// import { loadMediumPlaylistDetails } from "./medium_category_card_details";

export default function MediumCategoryCard(props) {
    const [sectionData, setSectionData] = useState(props.section_details)
    const [scrollPosition, setScrollPosition] = useState(0);
    const cardContainerRef = useRef(null);

    const selectDistinctRandomElements = (array, n) => {
        if (n > array.length) {
            throw new Error("Cannot select more distinct elements than the array length.");
        }
    
        // Clone the array to avoid modifying the original
        const shuffled = [...array];
    
        // Shuffle the array
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Random index
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
        }
    
        // Return the first n elements
        return shuffled.slice(0, n);
    };

    let section_names = ['Made for You', 'Your Top Mixes', 'Charts', 'Recently Played', "Today's biggest hits", 'More like Love', "India's Best", "Episodes you might like", 'More of what you like', 'More like Old']

    let section_details = {
        section_name: props?.custom_playlist ? "Public Playlists" : section_names[props.category_number],
        section_playlists: props?.section_details
    }

    let MediumCardItems = section_details?.section_playlists?.map((item) => (
        <MediumCardItem MediumCardDetails={item} custom_playlist = {props?.custom_playlist} />
    ));

    section_details.custom_playlist = props?.custom_playlist;

    // Calculate the number of cards that can be displayed at once
    const calculateVisibleItems = () => {
        // Approximately 4-5 cards visible at once based on CSS
        return 5;
    };

    // Scroll handlers
    const handleScrollLeft = () => {
        if (scrollPosition > 0) {
            // Move left by the width of one card
            const newPosition = Math.max(0, scrollPosition - 200);
            setScrollPosition(newPosition);
        }
    };

    const handleScrollRight = () => {
        if (cardContainerRef.current && section_details?.section_playlists?.length > 5) {
            // Calculate max scroll position
            const maxScroll = (section_details.section_playlists.length - calculateVisibleItems()) * 200;
            // Move right by the width of one card
            const newPosition = Math.min(maxScroll, scrollPosition + 200);
            setScrollPosition(newPosition);
        }
    };

    // Determine if arrows should be visible
    const isLeftArrowVisible = scrollPosition > 0;
    const isRightArrowVisible = section_details?.section_playlists?.length > 5 && 
        scrollPosition < (section_details.section_playlists.length - calculateVisibleItems()) * 200;

    return (
        <>
            <div className="medium_category_card_container df-jc">
                <div className="medium_category_card_head_container df">
                    <Link to="/section" state={section_details || ''} className="medium_category_card_head">
                        { section_details?.section_name }
                    </Link>
                    { 
                    section_details?.section_playlists?.length > 5 ? (
                        <Link to="/section" state={section_details} className="show_more_btn">Show All</Link>
                    ) : (
                        <></>
                    ) 
                    }
                </div>
                <div className="medium_card_item_outer_container df-ai">
                    {
                        section_details?.section_playlists?.length > 5 ? (
                            <>
                                <div 
                                    className={`medium_category_card_arrow_btn medium_category_card_arrow_btn_left df-ai ${!isLeftArrowVisible ? 'arrow-hidden' : ''}`}
                                    onClick={handleScrollLeft}
                                >
                                    <div className="medium_card_arrow_insider dff">
                                        <i className="fa-solid fa-angle-left"></i>
                                    </div>
                                </div>
                                <div 
                                    className={`medium_category_card_arrow_btn medium_category_card_arrow_btn_right df-ai ${!isRightArrowVisible ? 'arrow-hidden' : ''}`}
                                    onClick={handleScrollRight}
                                >
                                    <div className="medium_card_arrow_insider dff">
                                        <i className="fa-solid fa-angle-right"></i>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <></>
                        )
                    }
                    <div 
                        ref={cardContainerRef}
                        className="medium_card_item_container df-ai" 
                        style={{
                            left: section_details?.section_playlists?.length > 5 ? `${-200 - scrollPosition}px` : '0px', 
                            width: section_details.section_playlists.length > 5 ? "calc(100% - 100px)" : "calc(100%)",
                            transition: "left 0.3s ease-out"
                        }}
                    >
                        { MediumCardItems }
                    </div>
                </div>
            </div>
        </>
    )
}