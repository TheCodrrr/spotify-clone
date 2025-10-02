import React, { useState } from "react";
import './LeftContentItemsContainer.css';
import LeftContentPlaylistCard from "./LeftContentPlaylistCard";
// import leftContentCardData from "./leftContentCardData";
import { usePlaylistLoader } from "../../../customHooks/LoadPersonalPlaylist";
import LeftPlaylistLoadingCard from "./LeftPlaylistLoadingCard";

export default function LeftContentItemsContainer() {
    const [searchActive, setSearchActive] = useState(false);

    const toggleSearchActivation = () => {
        setSearchActive(!searchActive);
    }


    const { loading, userPlaylistDetails } = usePlaylistLoader();
    
    if (loading) {
    // if (true) {
        const LeftPlaylistLoadingCardsContainer = [];
        for (let i = 0; i < 15; i++) {
            LeftPlaylistLoadingCardsContainer.push(<LeftPlaylistLoadingCard key={i} />);
        }
    
        return (
            // <div className="left_content_items_container df">
            //     {LeftPlaylistLoadingCardsContainer}
            //     Hello
            // </div>
            <div className="left_content_items_container">
                <div className="left_content_heading_container df-ai">
                    <div className="btn_left_content_search_container dff" onClick={toggleSearchActivation}>
                        <svg data-encore-id="icon" role="img" aria-hidden="true" className="Svg-sc-ytk21e-0 dYnaPI CIVozJ8XNPJ60uMN23Yg btn_left_content_search_svg" viewBox="0 0 16 16">
                            <path d="M7 1.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5zM.25 7a6.75 6.75 0 1 1 12.096 4.12l3.184 3.185a.75.75 0 1 1-1.06 1.06L11.304 12.2A6.75 6.75 0 0 1 .25 7z" className="btn_left_content_search_path"></path>
                        </svg>
                    </div>
                    <div className="left_content_heading_end_container dff">
                        <h5 className="left_content_head">Recents</h5>
                        <div className="btn_left_content_hamburger dff">
                            <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 cAMMLk btn_left_content_hamburger_svg">
                                <path d="M15 14.5H5V13h10v1.5zm0-5.75H5v-1.5h10v1.5zM15 3H5V1.5h10V3zM3 3H1V1.5h2V3zm0 11.5H1V13h2v1.5zm0-5.75H1v-1.5h2v1.5z" className="btn_left_content_hamburger_path"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="custom-scrollbar">
                    <div className="thumb"></div>
                </div>
                {/* Render the cards dynamically */}
                { LeftPlaylistLoadingCardsContainer }
            </div>
        );
    }

    // Use map() to dynamically create LeftContentCard components
    const leftContentCards = userPlaylistDetails?.map((item, index) => (
        <LeftContentPlaylistCard key={index} data={item} />
    ));

    return (
        <>
            <div className="left_content_items_container">
                <div className="left_content_heading_container df-ai">
                    <div className="btn_left_content_search_container dff">
                        <svg data-encore-id="icon" role="img" aria-hidden="true" className="Svg-sc-ytk21e-0 dYnaPI CIVozJ8XNPJ60uMN23Yg btn_left_content_search_svg" viewBox="0 0 16 16">
                            <path d="M7 1.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5zM.25 7a6.75 6.75 0 1 1 12.096 4.12l3.184 3.185a.75.75 0 1 1-1.06 1.06L11.304 12.2A6.75 6.75 0 0 1 .25 7z" className="btn_left_content_search_path"></path>
                        </svg>
                    </div>
                    <div className="left_content_heading_end_container dff">
                        <h5 className="left_content_head">Recents</h5>
                        <div className="btn_left_content_hamburger dff">
                            <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 cAMMLk btn_left_content_hamburger_svg">
                                <path d="M15 14.5H5V13h10v1.5zm0-5.75H5v-1.5h10v1.5zM15 3H5V1.5h10V3zM3 3H1V1.5h2V3zm0 11.5H1V13h2v1.5zm0-5.75H1v-1.5h2v1.5z" className="btn_left_content_hamburger_path"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="custom-scrollbar">
                    <div className="thumb"></div>
                </div>
                {/* Render the cards dynamically */}
                { leftContentCards }
            </div>
        </>
    );
}
