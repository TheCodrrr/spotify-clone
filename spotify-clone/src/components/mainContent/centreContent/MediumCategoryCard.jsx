import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './MediumCategoryCard.css'
import MediumCardItem from "./MediumCardItem";
import MediumCardItem2 from "./MediumCardItem2";
// import { loadMediumPlaylistDetails } from "./medium_category_card_details";

export default function MediumCategoryCard(props) {
    console.log(`This is from MediumCategoryCard.jsx: ${JSON.stringify(props)}`);
    const [sectionData, setSectionData] = useState(props.section_details)
    console.log("Section Data: " + JSON.stringify(sectionData[0]))
    // async function hello(params) {
    //     data = await loadMediumPlaylistDetails();
    //     console.log("This is the loadMediumPlaylistDetails from MediumCategoryCard: " + JSON.stringify(data));
    // }
    // hello();

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
    // console.log("From MediumCategoryCard: " + JSON.stringify(props.category_details));
    // console.log("From MediumCategoryCard: " + JSON.stringify(props.cat_details));

    // props.category_details.forEach(element => {
        
    //     // if (element.category_item_card_creators.length >= 25) {
    //     //     element.category_item_card_creators = element.category_item_card_creators.slice(0, 25) + '...';
    //     // }
    //     if (element['name'].length >= 12) {
    //         element['active_name'] = element['name'].slice(0, 12) + '...';
    //     }
    //     else {
    //         element['active_name'] = element['name'];
    //     }

    //     if (element['description'] != 'No description available') {
    //         element['caption'] = element['description'];
    //     }
    //     else {
    //         let selected_artists = element['artists'].length >= 5 ? selectDistinctRandomElements(element['artists'], 5) : element['artists'];
    //         element['caption'] = selected_artists.join(', ');
    //     }
    // });


    // TBC


    // console.log("HELLLLLLLOOOO: "+ props.cat_details.category_item_cards_details);
    
    // if (props.category_details.category_type == 'outline') {
    //     MediumCardItems = props.category_details.category_item_cards_details.map((item) => (
    //         <MediumCardItem2 MediumCardDetails={item} />
    //     ));
    // }

    let section_names = ['Made for You', 'Your Top Mixes', 'Charts', 'Recently Played', "Today's biggest hits", 'More like Love', "India's Best", "Episodes you might like", 'More of what you like', 'More like Old']

    // console.log("From MediumCategoryCard Length: " + JSON.stringify(props.category_details.length));

    let section_details = {
        section_name: section_names[props.category_number],
        section_playlists: props.section_details
    }

    let MediumCardItems = section_details.section_playlists.map((item) => (
        <MediumCardItem MediumCardDetails={item} />
    ));

    console.log("This is section length: " + section_details.section_playlists.length);
    return (
        <>
            <div className="medium_category_card_container dff">
                <div className="medium_category_card_head_container df">
                    <Link to="/section" state={section_details} className="medium_category_card_head">
                        {/* { section_names[props.category_number] } */}
                        { section_details.section_name }
                        {/* Section Name */}
                    </Link>
                    { 
                    section_details.section_playlists.length > 5 ? (
                        <Link to="/section" state={section_details} className="show_more_btn">Show All</Link>
                    ) : (
                        <></>
                    ) 
                    }
                    {/* <Link to="/section" state={section_details} className="show_more_btn">Show All</Link> */}
                </div>
                <div className="medium_card_item_outer_container dff">
                    {
                        section_details.section_playlists.length > 5 ? (
                            <>
                                <div className="medium_category_card_arrow_btn medium_category_card_arrow_btn_left df-ai">
                                    <div className="medium_card_arrow_insider dff">
                                        <i class="fa-solid fa-angle-left"></i>
                                    </div>
                                </div>
                                <div className="medium_category_card_arrow_btn medium_category_card_arrow_btn_right df-ai">
                                    <div className="medium_card_arrow_insider dff">
                                        <i class="fa-solid fa-angle-right"></i>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <></>
                        )
                    }
                    <div className="medium_card_item_container df-ai">
                        { MediumCardItems }
                        {/* Medium Card Items */}
                    </div>
                </div>
            </div>
        </>
    )
}