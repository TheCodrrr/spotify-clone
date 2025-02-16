import React, { useState, useEffect } from "react";
import './CentreContentItemsContainer.css';
import MyPlaylistContainer from "./MyPlaylistContainer";
import category_details from "./category_details";
import MediumCategoryCard from "./MediumCategoryCard";
import LargeCardContainer from "./LargeCardContainer";
import { fetchRandomPlaylistsOrPodcasts } from "./medium_category_card_details";

export default function CentreContentItemsContainer() {
    const [loading, setLoading] = useState(true);
    const [mediumCategoryDetails, setMediumCategoryDetails] = useState([]);
    const [Playlist, setPlaylist] = useState([]);
    const [Podcast, setPodcast] = useState([]);

    const [partitionPlaylist, setPartitionPlaylist] = useState([]);
    const [partitionPodcast, setPartitionPodcast] = useState([]);

    // Fetching Data on Mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await fetchRandomPlaylistsOrPodcasts();
                setMediumCategoryDetails(result);
            } catch (error) {
                console.error(`Error fetching mediumCategoryDetails:`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Categorize Playlists & Podcasts when mediumCategoryDetails updates
    useEffect(() => {
        if (mediumCategoryDetails.length > 0) {
            let fetchedPlaylists = [];
            let fetchedPodcasts = [];
            for (let item of mediumCategoryDetails) {
                if (item.type === "playlist") fetchedPlaylists.push(item);
                else fetchedPodcasts.push(item);
            }
            setPlaylist(fetchedPlaylists);
            setPodcast(fetchedPodcasts);
        }
    }, [mediumCategoryDetails]);

    // Logging changes to state
    useEffect(() => {
        let tempPartitionPlay = [];
        let individualPlay = [];
        let play_length = Math.floor(Playlist.length / 6);

        let tempPartitionPod = [];
        let individualPod = [];
        let pod_length = Math.floor(Podcast.length / 6);

        for (let item of Playlist) {
            if (individualPlay.length == play_length) {
                tempPartitionPlay.push(individualPlay);
                individualPlay = [];
            }
            else {
                individualPlay.push(item);
            }
        }
        
        for (let item of Podcast) {
            if (individualPod.length >= pod_length) {
                tempPartitionPod.push(individualPod);
                individualPod = [];
            }
            else {
                individualPod.push(item);
            }
        }
        setPartitionPlaylist(tempPartitionPlay);
        setPartitionPodcast(tempPartitionPod);
        // console.log("Temporary Playlists:", tempPartitionPlay);
        // console.log("Temporary Podcasts:", tempPartitionPod);
    }, [Playlist, Podcast]);

    // Show loading UI while data is being fetched
    if (loading) {
        console.log("Loading state active. Category details:", category_details);
        return (
            <div className="centre_content_items_container dff">
                <MyPlaylistContainer />
                Loading...
                <div className="space_between_cards"></div>
                <LargeCardContainer />
                <LargeCardContainer />
                <LargeCardContainer />
            </div>
        );
    }

    let MediumCategoryPlaylistCards = partitionPlaylist.map((element, index) => (
        <MediumCategoryCard section_details = {element} category_number = {index}/>
    ))
    let MediumCategoryPodcastCards = partitionPodcast.map((element, index) => (
        <MediumCategoryCard section_details = {element} category_number = {index + 5}/>
    ))

    return (
        <div className="centre_content_items_container dff">
            <MyPlaylistContainer />
            
            { MediumCategoryPlaylistCards }
            { MediumCategoryPodcastCards }

            <div className="space_between_cards"></div>
            <LargeCardContainer />
            <LargeCardContainer />
            <LargeCardContainer />
        </div>
    );
}
