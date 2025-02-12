import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import './EnlargedBrowseCard.css'
import { fetchBrowseData } from "./EnlargedBrowseDetails";

export default function EnlargedBrowseCard(props) {

    const [isLoading, setLoading] = useState(true);
    const [finalData, setFinalData] = useState([]);
    const [browseCards, setBrowseCards] = useState([]);
    const location = useLocation();

    useEffect(() => {
        async function getData() {
            setLoading(true);
            const browsedata = await fetchBrowseData();
            setFinalData(browsedata);
            finalData.map((element) => {
                if (element.name.length > 10) {
                    element.name = element.name.slice(0,10) + '...';
                    console.log(element.name);
                }
            })
            setFinalData(finalData);
            setBrowseCards(
                finalData.map((element) => (
                    <Link to="/" className="browse_elm">
                        <div className="browse_elm_head">
                            {element.name}
                        </div>
                        <div className="browse_elm_img_container dff">
                            <img src={element.image} alt={element.name} className="browse_elm_img" />
                        </div>
                    </Link>
                    
                ))
            )

            setLoading(false);

        }
        // window.onload = getData();
        getData();
    }, [location]);

    // console.log(browseCards);

    // if (isLoading) {
    //     return (
    //         <>
    //             Hello World.
    //         </>
    //     )
    // }

    return (
        <>
            <div className="enlarged_browser_card_container" style={{ ...props.common_styles, ...props.specific_style }}>
                <h1 className="browse_head">Start browsing</h1>
                <div className="browse_elms_container df-ai">
                    <Link to="/" className="browse_elm">
                        <div className="browse_elm_head">
                            Music
                        </div>
                        <div className="browse_elm_img_container dff">
                            hello
                        </div>
                    </Link>
                    <Link to="/" className="browse_elm">
                        <div className="browse_elm_head">
                            Podcasts
                        </div>
                        <div className="browse_elm_img_container dff">
                            hello
                        </div>
                    </Link>
                    <Link to="/" className="browse_elm">
                        <div className="browse_elm_head">
                            Live Events
                        </div>
                        <div className="browse_elm_img_container dff">
                            hello
                        </div>
                    </Link>
                </div>
                <h1 className="browse_head">Browse all</h1>
                <div className="browse_elms_container df-ai">
                    { browseCards }
                </div>
            </div>
        </>
    )
}