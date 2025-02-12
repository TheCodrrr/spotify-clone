import React from "react";
import './CentreContentNavbar.css'

export default function CentreContentNavbar(props) {
    return (
        <>
            { props.scrollValue == false ? (
                <div className="centre_navbar df-ai">
                    <a href="#" className="centre_navlinks dff active_centre">All</a>
                    <a href="#" className="centre_navlinks dff">Music</a>
                    <a href="#" className="centre_navlinks dff">Podcasts</a>
                </div>
            ) : (
                <div className="centre_navbar scroll_effect df-ai">
                    <a href="#" className="centre_navlinks dff active_centre">All</a>
                    <a href="#" className="centre_navlinks dff">Music</a>
                    <a href="#" className="centre_navlinks dff">Podcasts</a>
                </div>
            ) }
        </>
    )
}