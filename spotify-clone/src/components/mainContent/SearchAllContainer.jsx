import React from "react";
import './SearchAllContainer.css'
import { Link } from "react-router-dom";

export default function SearchAllContainer({ searchedDetails }) {
    const details = searchedDetails;
    // const top_result = details.songs[0]
    // console.log("THis is not what it is: " + JSON.stringify(searchedDetails))
    // console.log("dhbkdhfbvkfvbkfc " + top_result);
    searchedDetails.songs[0].artistsString = searchedDetails.songs[0].artists.join(", ")
    console.log("fvkndfjvbnaldg " + searchedDetails.songs[0])


    // console.log("search all container here sir: " + JSON.stringify(details));
    return (
        <>
            <div className="search_all_container">
                <div className="songs_container df-ai">
                    <Link to={`/`} className="songs_container_child songs_container_left dff">
                        <h2 className="top_result_head df-ai">Top Result</h2>
                        <div className="top_result_container df">
                            <img src={searchedDetails.songs[0].image} alt="Top Result" className="top_result_img" />
                            <h1 className="top_result_name">
                                { searchedDetails.songs[0].name }
                            </h1>
                            <p className="top_result_details">
                                song • { searchedDetails.songs[0].artistsString }
                            </p>
                        </div>
                    </Link>
                    <div className="songs_container_child songs_container_right dff"></div>
                </div>
            </div>
        </>
    )
}