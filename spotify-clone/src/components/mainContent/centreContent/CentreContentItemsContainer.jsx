import React, { useState, useEffect } from "react";
import './CentreContentItemsContainer.css'
import MyPlaylistContainer from "./MyPlaylistContainer";
import category_details from "./category_details";
import MediumCategoryCard from "./MediumCategoryCard";
import LargeCardContainer from "./LargeCardContainer";
import { loadMediumPlaylistDetails } from "./medium_category_card_details";

export default function CentreContentItemsContainer() {
    const [loading, setLoading] = useState(true);
    const [mediumCategoryDetails, setMediumCategoryDetails] = useState([]);
    const [partitionedPlaylists, setPartitionedPlaylists] = useState([]);

    useEffect(() => {
        async function loadMediumPlaylists() {
            setLoading(true);
            const MediumPlaylists = await loadMediumPlaylistDetails(); // Fetch the playlist details
            console.log("Loaded Medium Playlists:", MediumPlaylists);
            setMediumCategoryDetails(MediumPlaylists); // Update state
            setLoading(false);
        }

        loadMediumPlaylists();
    }, []); // Runs only on initial render

    useEffect(() => {
        if (!loading && mediumCategoryDetails.length > 0) {
            let alter = true;
            let bunchPlaylists = [];
            let individualPlaylists = [];

            for (let i = 0, j = mediumCategoryDetails.length - 1; i <= 50 && i <= j; ) {
                if (individualPlaylists.length < 10) {
                    if (alter) {
                        individualPlaylists.push(mediumCategoryDetails[i]);
                        i++;
                    } else {
                        individualPlaylists.push(mediumCategoryDetails[j]);
                        j--;
                    }
                } else {
                    bunchPlaylists.push(individualPlaylists);
                    individualPlaylists = [];
                }
                alter = !alter;
            }

            if (individualPlaylists.length > 0) {
                bunchPlaylists.push(individualPlaylists); // Push remaining playlists
            }

            console.log("Partitioned Playlists:", bunchPlaylists);
            setPartitionedPlaylists(bunchPlaylists); // Update partitioned playlists
        }
    }, [loading, mediumCategoryDetails]); // Depend on `loading` and `mediumCategoryDetails`

    partitionedPlaylists.forEach(element => {
        if (element) {
            console.log(
                "RIGHTRIGHTRIGHTRIGHTRIGHTRIGHTRIGHTRIGHTRIGHTRIGHTRIGHTRIGHT" +
                    JSON.stringify(element)
            );
        }
    });


    if (loading) {
        return (
            <div className="centre_content_items_container dff">
                <MyPlaylistContainer/>
                Loading...
                <div className="space_between_cards">
                    
                </div>
                <LargeCardContainer/>
                <LargeCardContainer/>
                <LargeCardContainer/>
                {/* <MediumCategoryCard cat_details={category_details[8]} /> */}
            </div>
        )
    }
    else {
        console.log("This is the partitionedPlaylists: " + JSON.stringify(partitionedPlaylists));
        console.log("This is the category_details: " + JSON.stringify(category_details));
    }

    const MediumCategoryCards = partitionedPlaylists.map((element, index) => (
        <MediumCategoryCard key={index} category_details={element} category_number={index} />
    ));

    // const MediumCategoryCards = category_details.map((item) => (
    //     <MediumCategoryCard cat_details={item} />
    // ));

    return (
        <>
            <div className="centre_content_items_container dff">
                <MyPlaylistContainer/>
                { MediumCategoryCards }
                <div className="space_between_cards">
                    
                </div>
                <LargeCardContainer/>
                <LargeCardContainer/>
                <LargeCardContainer/>
                {/* <MediumCategoryCard cat_details={category_details[8]} /> */}
            </div>
        </>
    )
}