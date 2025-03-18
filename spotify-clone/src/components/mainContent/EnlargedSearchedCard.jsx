import React, { useEffect, useState } from "react";
import './EnlargedSearchedCard.css'
import { Link } from "react-router-dom";

export default function EnlargedSearchedCard(props) {
    const [loading, setLoading] = useState(true);
    const [searchedData, setSearchedData] = useState([])

    useEffect(() => {
        setLoading(true);
        console.log("From EnlargedSearchedCard.jsx 1: " + JSON.stringify(props.searchedCardDetails))
        setSearchedData(props.searchedCardDetails)
        console.log("From EnlargedSearchedCard.jsx 2: " + JSON.stringify(searchedData))
        setLoading(false);
    }, [props.searchedCardDetails, props.searchedType])

    return props.searchedType === "track" ? loading ? "" : (
        <>
            <table className="songs_table dff">
                <tr className="songs_table_row_container songs_table_head_row_container df-ai">
                    <th className="song_col1 song_col_head dff">#</th>
                    <th className="song_col2 song_col_head df-ai">Title</th>
                    <th className="song_col3 song_col_head df-ai">Album</th>
                    <th className="song_col4 song_col_head dff">
                        <i class="fa-solid fa-clock"></i>
                    </th>
                </tr>
                <span className="songs_table_head_divider"></span>
                <tr className="songs_table_row_container songs_table_row df-ai">
                    <td className="song_col1 song_col_value1 dff">1</td>
                    <td className="song_col2 song_col_value2 df-ai">
                        <img src={props.searchedCardDetails[0].image} alt="" className="song_img" />
                        <div className="song_details_container df-jc">
                            <Link to={`/`} className="song_title">
                                { props.searchedCardDetails[0].name }
                            </Link>
                            <div className="song_artist">
                                { props.searchedCardDetails[0].artists.join(", ") }
                            </div>
                        </div>
                    </td>
                    <td className="song_col3 song_col_value3 df-ai">
                        { props.searchedCardDetails[0].album }
                    </td>
                    <td className="song_col4 song_col_value4 dff">
                        
                    </td>
                </tr>

            </table>
        </>
    ) : (
        <>
            <div className="searched_details_container">
                this is enlarged searched card {props.searchedType}
            </div>
        </>
    )
}