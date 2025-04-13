import React, { useEffect, useState } from "react";
import Footer from "./centreContent/Footer";
import { searchSpotify } from "./searchResult";
import { Link, useLocation, useParams } from "react-router-dom";
import './EnlargedSearchResult.css';
import SearchAllContainer from "./SearchAllContainer";
import EnlargedSearchedCard from "./EnlargedSearchedCard";

export default function EnlargedSearchResult(props) {
    const { searchType, id } = useParams();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [fetchedSearchDetails, setFetchedSearchDetails] = useState({});
    const [fetchedParticularDetails, setFetchedParticularDetails] = useState([]);

    useEffect(() => {
        setLoading(true);

        if (!searchType) {
            searchSpotify(id)
                .then((fetchedDetails) => {
                    if (fetchedDetails) {
                        setFetchedSearchDetails(fetchedDetails);
                    }
                })
                .catch((error) => console.error("Error:", error))
                .finally(() => setLoading(false));
        } else {
            // Reset the state before fetching new data
            setFetchedParticularDetails([]);  
            searchSpotify(id, searchType)
                .then((fetchedDetails) => {
                    if (fetchedDetails) {
                        setFetchedParticularDetails(fetchedDetails);
                    }
                })
                .catch((error) => console.error("Error:", error))
                .finally(() => setLoading(false));
        }
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
