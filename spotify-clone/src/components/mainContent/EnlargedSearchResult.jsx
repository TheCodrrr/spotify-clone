import React, { useEffect, useState } from "react";
import Footer from "./centreContent/Footer";
// import { searchSpotify } from "./searchResult"; // Commented out - using backend API instead
import { Link, useLocation, useParams } from "react-router-dom";
import './EnlargedSearchResult.css';
import SearchAllContainer from "./SearchAllContainer";
import EnlargedSearchedCard from "./EnlargedSearchedCard";

const SPOTIFY_API_URL = "http://localhost:5000/api/spotify";

export default function EnlargedSearchResult(props) {
    const { searchType, id } = useParams();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [fetchedSearchDetails, setFetchedSearchDetails] = useState({});
    const [fetchedParticularDetails, setFetchedParticularDetails] = useState([]);

    useEffect(() => {
        setLoading(true);

        // Old method using direct import (commented out)
        // if (!searchType) {
        //     searchSpotify(id)
        //         .then((fetchedDetails) => {
        //             if (fetchedDetails) {
        //                 setFetchedSearchDetails(fetchedDetails);
        //             }
        //         })
        //         .catch((error) => console.error("Error:", error))
        //         .finally(() => setLoading(false));
        // } else {
        //     // Reset the state before fetching new data
        //     setFetchedParticularDetails([]);  
        //     searchSpotify(id, searchType)
        //         .then((fetchedDetails) => {
        //             if (fetchedDetails) {
        //                 setFetchedParticularDetails(fetchedDetails);
        //             }
        //         })
        //         .catch((error) => console.error("Error:", error))
        //         .finally(() => setLoading(false));
        // }

        // New method using backend API
        const searchFromAPI = async () => {
            try {
                const queryParams = new URLSearchParams({ query: id });
                if (searchType) {
                    queryParams.append('type', searchType);
                }
                
                const response = await fetch(`${SPOTIFY_API_URL}/search?${queryParams}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const fetchedDetails = await response.json();
                
                if (fetchedDetails) {
                    // console.log("Hello hello: ", fetchedDetails);
                    if (!searchType) {
                        setFetchedSearchDetails(fetchedDetails);
                    } else {
                        // Reset the state before setting new data
                        setFetchedParticularDetails([]);  
                        setFetchedParticularDetails(fetchedDetails);
                    }
                }
            } catch (error) {
                console.error("Error searching Spotify:", error);
                setFetchedSearchDetails({});
                setFetchedParticularDetails([]);
            } finally {
                setLoading(false);
            }
        };

        searchFromAPI();
    }, [searchType, id, location.pathname]);

    return (
        <>
        {loading ? (
            <div
            className="enlarged_playlist_container enlarged_playlist_loading_container dff"
            style={{ ...props.common_styles, ...props.specific_style }}
            >
                <div className="load_btn_circle load_btn_circle1"></div>
                <div className="load_btn_circle load_btn_circle2"></div>
                <div className="load_btn_circle load_btn_circle3"></div>
            </div>
        ) : (
            <div
                className="enlarged_playlist_container"
                style={{ ...props.common_styles, ...props.specific_style }}
            >
                <div className="search_page_navbar_container df-ai">
                    <Link to={`/find/${id}`} className={`search_page_navlinks ${!searchType ? "active_search_page" : ""}`}>All</Link>
                    <Link to={`/find/track/${id}`} className={`search_page_navlinks ${searchType === "track" ? "active_search_page" : ""}`}>Songs</Link>
                    <Link to={`/find/playlist/${id}`} className={`search_page_navlinks ${searchType === "playlist" ? "active_search_page" : ""}`}>Playlists</Link>
                    <Link to={`/find/album/${id}`} className={`search_page_navlinks ${searchType === "album" ? "active_search_page" : ""}`}>Albums</Link>
                    <Link to={`/find/artist/${id}`} className={`search_page_navlinks ${searchType === "artist" ? "active_search_page" : ""}`}>Artists</Link>
                    <Link to={`/find/show,episode/${id}`} className={`search_page_navlinks ${searchType === "show,episode" ? "active_search_page" : ""}`}>Podcasts & Shows</Link>
                </div>
                <div className="search_song_container">
                    {!searchType ? <SearchAllContainer searchedDetails={fetchedSearchDetails} /> : <EnlargedSearchedCard searchedCardDetails={fetchedParticularDetails} searchedType={searchType} />}
                    </div>
                <Footer/>
            </div>
            )}
        </>
    );
}
