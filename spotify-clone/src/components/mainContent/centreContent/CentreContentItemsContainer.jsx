import React, { useState, useEffect } from "react";
import './CentreContentItemsContainer.css'
import MyPlaylistContainer from "./MyPlaylistContainer";
import category_details from "./category_details";
import MediumCategoryCard from "./MediumCategoryCard";
import LargeCardContainer from "./LargeCardContainer";
import { fetchRandomPlaylistsOrPodcasts } from "./medium_category_card_details";

export default function CentreContentItemsContainer() {
    const [loading, setLoading] = useState(true);
    const [mediumCategoryDetails, setMediumCategoryDetails] = useState([]);
    const [partitionedPlaylists, setPartitionedPlaylists] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
            const result = await fetchRandomPlaylistsOrPodcasts();
            setMediumCategoryDetails(result);
            // console.log(`Data from the CentreContentItemsContainer: ${JSON.stringify(result)}`);
            console.log(`Data from the CentreContentItemsContainer: ${JSON.stringify(mediumCategoryDetails)}`);
        } catch (error) {
            console.log(`Error from the CentreContentItemsContainer: ${error}`);
        }
      }

      fetchData();

    }, [])
    

    if (loading) {
        console.log("This is from loading in CentreContentItemsContainer: " + JSON.stringify(category_details))
        return (
            <div className="centre_content_items_container dff">
                <MyPlaylistContainer/>
                Loading...
                <div className="space_between_cards">
                    
                </div>
                <LargeCardContainer/>
                <LargeCardContainer/>
                <LargeCardContainer/>
                <MediumCategoryCard />
            </div>
        )
    }
    else {
        // console.log("This is the partitionedPlaylists: " + JSON.stringify(partitionedPlaylists));
        // console.log("This is the category_details: " + JSON.stringify(category_details));
    }

    // const MediumCategoryCards = partitionedPlaylists.map((element, index) => (
    //     <MediumCategoryCard key={index} category_details={element} category_number={index} />
    // ));

    // const MediumCategoryCards = category_details.map((item) => (
    //     <MediumCategoryCard cat_details={item} />
    // ));

    return (
        <>
            <div className="centre_content_items_container dff">
                <MyPlaylistContainer/>
                {/* { MediumCategoryCards } */}
                <MediumCategoryCard />
                <MediumCategoryCard />
                <MediumCategoryCard />
                <MediumCategoryCard />
                <MediumCategoryCard />
                <MediumCategoryCard />
                <div className="space_between_cards">
                    
                </div>
                <LargeCardContainer/>
                <LargeCardContainer/>
                <LargeCardContainer/>
                <MediumCategoryCard />
            </div>
        </>
    )
}