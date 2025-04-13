import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import './EnlargedBrowseCard.css'
import fetchCategoriesWithImages from "./EnlargedBrowseDetails";
import EnlargedBrowseCardLoader from "./EnlargedBrowseCardLoader";

export default function EnlargedBrowseCard(props) {
    const [loading, setLoading] = useState(true);
    const [fetchedCategory, setFetchedCategory] = useState([]);
    const [displayingCategory, setDisplayingCategory] = useState([]);
    const location = useLocation();
    
    const brightColors = [
        "#FF4C4C", // Neon Red  
        "#FF6A00", // Bright Orange  
        "#FFC300", // Electric Yellow  
        "#FF1493", // Neon Pink  
        "#FF33FF", // Magenta  
        "#FF00FF", // Fuchsia  
        "#00FF00", // Neon Green  
        "#00FF7F", // Bright Aqua Green  
        "#1E90FF", // Vivid Blue  
        "#007FFF", // Neon Sky Blue  
        "#00BFFF", // Deep Neon Cyan  
        "#9933FF", // Electric Purple  
        "#FF5733", // Bright Coral  
        "#FFD700", // Gold  
        "#FF8C00"  // Vivid Orange-Yellow  
    ];

    let lastUsedColors = [];

    function getRandomBrightColor(brightColors) {
        if (lastUsedColors.length >= brightColors.length) {
            lastUsedColors = []; // Reset if all colors are used
        }

        let availableColors = brightColors.filter(color => !lastUsedColors.includes(color));
        let randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];

        lastUsedColors.push(randomColor);
        
        return randomColor;
    }


    useEffect(() => {
        if (location.pathname === '/search') {
            setLoading(true);

            async function loadData() {
                const loadedData = await fetchCategoriesWithImages();

                // Fetch colors and update the category objects
                // const updatedCategories = await Promise.all(loadedData.map(async (category) => {
                //     try {
                //         const color = await getDominantBrightColor(category.image);
                //         return { ...category, backgroundColor: color }; // Add color to category object
                //     } catch {
                //         return { ...category, backgroundColor: "#FFFFFF" }; // Default white on error
                //     }
                // }));

                setFetchedCategory(loadedData);
                setLoading(false);
            }

            loadData();
        }
    }, [location.pathname]);



    // ✅ Separate useEffect to update displayingCategory after fetchedCategory is updated
    useEffect(() => {
        if (fetchedCategory.length > 0) {

            const tempDisplayData = fetchedCategory.map((category) => (
                <Link to={`/search/category/${category.id}`} className="browse_elm" key={category.id}
                style={{backgroundColor: `${
                    getRandomBrightColor(brightColors)
                }`}}
                >
                    <div className="browse_elm_head">
                        {category.name}
                    </div>
                    <div className="browse_elm_img_container dff">
                        <img src={category.image} alt={category.name} className="browse_elm_img" />
                    </div>
                </Link>
            ));

            setDisplayingCategory(tempDisplayData);
            setLoading(false);
        }
    }, [fetchedCategory]); // ✅ Dependency on fetchedCategory

    return (
        <>
            {/* {loading ? <EnlargedBrowseCardLoader common_styles = {props.common_styles} specific_style = {props.specific_style} /> : ( */}
            {loading ? <EnlargedBrowseCardLoader common_styles = {props.common_styles} specific_style = {props.specific_style} /> : (
                <div className="enlarged_browser_card_container" style={{ ...props.common_styles, ...props.specific_style  }}>
                    <h1 className="browse_head">Start browsing</h1>
                    <div className="browse_elms_container dff">
                        <Link to="/category/music" className="browse_elm"
                        style={{backgroundColor: `${ brightColors[9] }`}}
                        >
                            <div className="browse_elm_head">Music</div>
                            <div className="browse_elm_img_container browse_elm_img_container1 dff"></div>
                        </Link>
                        <Link to="/category/podcast" className="browse_elm"
                        style={{backgroundColor: `${ brightColors[11] }`}}
                        >
                            <div className="browse_elm_head">Podcasts</div>
                            <div className="browse_elm_img_container browse_elm_img_container2 dff"></div>
                        </Link>
                        <Link to="/category/live_event" className="browse_elm"
                        style={{backgroundColor: `${ brightColors[14] }`}}
                        >
                            <div className="browse_elm_head">Live Events</div>
                            <div className="browse_elm_img_container browse_elm_img_container3 dff"></div>
                        </Link>
                    </div>
                    <h1 className="browse_head">Browse all</h1>
                    <div className="browse_elms_container dff">
                        {displayingCategory}
                    </div>
                </div>
            )}
        </>
    );
}
