import React, { useEffect, useState } from "react";
import Footer from "./centreContent/Footer";
import { searchSpotify } from "./searchResult";
import { Link, useParams } from "react-router-dom";
import './EnlargedSearchResult.css'
import SearchAllContainer from "./SearchAllContainer";
import EnlargedSearchedCard from "./EnlargedSearchedCard";

export default function EnlargedSearchResult(props) {
    const { searchType, id } = useParams();
    console.log("hello world the id is " + id)
    const [loading, setLoading] = useState(true);
    const [fetchedSearchDetails, setFetchedSearchDetails] = useState({})
    const [fetchedParticularDetails, setFetchedParticularDetails] = useState([])

    useEffect(() => {
        if (!searchType) {
            console.log("HJDFNVJSNFVLJSNFLVJSNFLJVNSLJFVNLSJFV " + searchType)
            setLoading(true);
            searchSpotify(id)
                .then((fetchedDetails) => {
                    if (fetchedDetails) {
                        console.log("Fetched details:", fetchedDetails); // Debugging log
                        setFetchedSearchDetails(fetchedDetails);
                    }
                })
                .catch((error) => console.error("Error:", error))
                .finally(() => setLoading(false));
        }
        else {
            setLoading(true);
            searchSpotify(id, searchType)
                .then((fetchedDetails) => {
                    if (fetchedDetails) {
                        console.log("Fetched details:", fetchedDetails); // Debugging log
                        setFetchedParticularDetails(fetchedDetails);
                    }
                })
                .catch((error) => console.error("Error:", error))
                .finally(() => setLoading(false));
        }
    }, [searchType, id]);
    
        console.log("hello hello hello hello hello: " + JSON.stringify(fetchedSearchDetails));
        
    return (
        <>
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
                    { loading ? "Loading..." : !searchType ? <SearchAllContainer searchedDetails = {fetchedSearchDetails} /> : <EnlargedSearchedCard searchedCardDetails = {fetchedParticularDetails} searchedType = {searchType} /> }
                </div>
                <Footer/>
            </div>
        </>
    )
}