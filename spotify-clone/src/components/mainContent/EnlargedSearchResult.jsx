import React, { useEffect, useState } from "react";
import Footer from "./centreContent/Footer";
import { searchSpotify } from "./searchResult";
import { Link, useParams } from "react-router-dom";
import './EnlargedSearchResult.css'
import SearchAllContainer from "./SearchAllContainer";

export default function EnlargedSearchResult(props) {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [fetchedSearchDetails, setFetchedSearchDetails] = useState({})

    useEffect(() => {
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
    }, [id]);
    
        console.log("hello hello hello hello hello: " + JSON.stringify(fetchedSearchDetails));
    return (
                <>
                    <div
                      className="enlarged_playlist_container"
                      style={{ ...props.common_styles, ...props.specific_style }}
                    >
                        <div className="search_page_navbar_container df-ai">
                            <Link to={`/`} className="search_page_navlinks active">All</Link>
                            <Link to={`/`} className="search_page_navlinks">Songs</Link>
                            <Link to={`/`} className="search_page_navlinks">Playlists</Link>
                            <Link to={`/`} className="search_page_navlinks">Albums</Link>
                            <Link to={`/`} className="search_page_navlinks">Artists</Link>
                            <Link to={`/`} className="search_page_navlinks">Podcasts & Shows</Link>
                        </div>
                        <div className="search_song_container">
                            <SearchAllContainer searchedDetails = {fetchedSearchDetails} />
                        </div>
                      <Footer/>
                    </div>
                      </>
            )
}