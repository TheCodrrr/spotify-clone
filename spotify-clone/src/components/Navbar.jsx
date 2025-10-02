import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import './Navbar.css'
import { useNavigate, useLocation } from "react-router-dom";
// import { useLocation } from "react-router-dom";

export default function Navbar() {
    // const { searchType, setSearchType } = useContext(SearchContext);
    const { searchType } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [currRoute, setCurrRoute] = useState("");

    // setInterval(() => {
    //     if (id !== searchTerm) {
    //         navigate(`/find/${searchTerm}`);
    //     }
    // }, 1000);

    useEffect(() => {
        if (location.pathname === "/") {
            setCurrRoute("");
            setSearchTerm("");
        } else {
            setCurrRoute(location.pathname);
        }
    }, [location.pathname])

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (location.pathname.startsWith("/find/track") || location.pathname.startsWith("/find/playlist") || location.pathname.startsWith("/find/album") || location.pathname.startsWith("/find/artist") || location.pathname.startsWith("/find/show,episode"));
            else if (location.pathname === "/search" || location.pathname.startsWith("/find/")) {
                if (searchTerm === "") {
                    navigate('/search');
                } else if (searchType === undefined) {
                    navigate(`/find/${searchTerm}`);
                } else {
                    const expectedPath = `/find/${searchType}/${searchTerm}`;
                    if (location.pathname !== expectedPath) {
                        navigate(expectedPath);
                    }
                }
            }
        }, 0);
    
        return () => clearTimeout(timeout);  // Cleanup on unmount
    }, [searchTerm, searchType, location.pathname, navigate]);  
    

    return (
        <>
            <div className="navbar_container dff">
                <h1 className="navbar_logo_container dff">
                    <a href="#" className="navbar_logo_link dff">
                        <i className="fa-brands fa-spotify navbar_logo"></i>
                    </a>
                </h1>
                <div className="navbar_elms_container navbar_elms_container1 df-ai">
                    <Link className="home_icon_container dff" to='/'>
                        { currRoute === "" ? (
                            <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" className="Svg-sc-ytk21e-0 bneLcE"><path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z"></path></svg>
                        ) : (
                            <svg data-encore-id="icon" role="img" aria-hidden="true" className="e-9800-icon e-9800-baseline" viewBox="0 0 24 24"><path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z"></path></svg>
                        ) }
                    </Link>
                    <Link className="web_search_input_container df-ai" to={searchTerm === "" ? "/search" : location.pathname}>
                        <div className="btn_web_search dff">
                            {/* <i className="fa-solid fa-magnifying-glass btn_web_search_icon"></i> */}
                            <svg data-encore-id="icon" role="img" aria-hidden="true" data-testid="search-icon" className="Svg-sc-ytk21e-0 bHdpig M9l40ptEBXPm03dU3X1k" viewBox="0 0 24 24"><path d="M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z" className="search_path"></path></svg>
                        </div>
                        <div className="btn_search_input_container dff">
                            <input type="text" name="search" id="search" className="btn_search_input dff" placeholder="What do you want to play?" value={searchTerm} onChange={handleChange} />
                        </div>
                        <div className="btn_browse_search_container dff">
                            {/* <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" className="btn_browse_search">
                                <path d="M4 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4H4V2zM1.513 9.37A1 1 0 0 1 2.291 9H21.71a1 1 0 0 1 .978 1.208l-2.17 10.208A2 2 0 0 1 18.562 22H5.438a2 2 0 0 1-1.956-1.584l-2.17-10.208a1 1 0 0 1 .201-.837zM12 17.834c1.933 0 3.5-1.044 3.5-2.333 0-1.289-1.567-2.333-3.5-2.333S8.5 14.21 8.5 15.5c0 1.289 1.567 2.333 3.5 2.333z"></path>
                            </svg> */}

                            { currRoute === "/search" ? (
                                <svg data-encore-id="icon" role="img" aria-hidden="true" className="e-9800-icon e-9800-baseline" viewBox="0 0 24 24"><path className="setWhite" d="M4 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4H4V2zM1.513 9.37A1 1 0 0 1 2.291 9H21.71a1 1 0 0 1 .978 1.208l-2.17 10.208A2 2 0 0 1 18.562 22H5.438a2 2 0 0 1-1.956-1.584l-2.17-10.208a1 1 0 0 1 .201-.837zM12 17.834c1.933 0 3.5-1.044 3.5-2.333 0-1.289-1.567-2.333-3.5-2.333S8.5 14.21 8.5 15.5c0 1.289 1.567 2.333 3.5 2.333z"></path></svg>
                            ) : (
                                <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" className="Svg-sc-ytk21e-0 bneLcE"><path d="M15 15.5c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"></path><path d="M1.513 9.37A1 1 0 0 1 2.291 9h19.418a1 1 0 0 1 .979 1.208l-2.339 11a1 1 0 0 1-.978.792H4.63a1 1 0 0 1-.978-.792l-2.339-11a1 1 0 0 1 .201-.837zM3.525 11l1.913 9h13.123l1.913-9H3.525zM4 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4h-2V3H6v3H4V2z"></path></svg>
                            )}

                        </div>
                    </Link>
                </div>
                <div className="navbar_elms_container navbar_elms_container2 df-ai">
                    {/* <Link to={`/login`} className="btn_web_elm btn_web_elm1 dff">
                        Login
                    </Link> */}
                    <div className="btn_web_elm btn_web_elm1 dff">
                        Explore Premium
                    </div>
                    <div className="btn_web_elm btn_web_elm2 dff">
                        <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 dYnaPI btn_install_now"><path d="M4.995 8.745a.75.75 0 0 1 1.06 0L7.25 9.939V4a.75.75 0 0 1 1.5 0v5.94l1.195-1.195a.75.75 0 1 1 1.06 1.06L8 12.811l-.528-.528a.945.945 0 0 1-.005-.005L4.995 9.805a.75.75 0 0 1 0-1.06z"></path><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z"></path></svg>
                        Install App
                    </div>
                    <div className="btn_web_elm btn_web_elm3 dff">
                        <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 dYnaPI btn_notify dff"><path d="M8 1.5a4 4 0 0 0-4 4v3.27a.75.75 0 0 1-.1.373L2.255 12h11.49L12.1 9.142a.75.75 0 0 1-.1-.374V5.5a4 4 0 0 0-4-4zm-5.5 4a5.5 5.5 0 0 1 11 0v3.067l2.193 3.809a.75.75 0 0 1-.65 1.124H10.5a2.5 2.5 0 0 1-5 0H.957a.75.75 0 0 1-.65-1.124L2.5 8.569V5.5zm4.5 8a1 1 0 1 0 2 0H7z"></path></svg>
                    </div>
                    <div className="btn_web_elm btn_web_elm4 dff">
                        <img src="/profile.jpeg" alt="" className="btn_web_elm_profile_img" />
                    </div>
                </div>
            </div>
        </>
    )
}