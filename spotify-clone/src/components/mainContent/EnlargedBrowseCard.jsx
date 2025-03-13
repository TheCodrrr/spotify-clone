import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import './EnlargedBrowseCard.css'
import fetchCategoriesWithImages from "./EnlargedBrowseDetails";

export default function EnlargedBrowseCard(props) {
    const [loading, setLoading] = useState(true);
    const [fetchedCategory, setFetchedCategory] = useState([]);
    const [displayingCategory, setDisplayingCategory] = useState([]);
    const location = useLocation();

    function getDominantBrightColor(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Avoid CORS issues
            img.src = imageUrl;
    
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
    
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
    
                const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
                let colorCounts = {};
    
                for (let i = 0; i < imageData.length; i += 4) {
                    let r = imageData[i];
                    let g = imageData[i + 1];
                    let b = imageData[i + 2];
    
                    let hex = rgbToHex(r, g, b);
    
                    // Exclude black, white, and dull colors
                    if (!isDullOrDark(r, g, b) && hex !== "#000000" && hex !== "#FFFFFF") {
                        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
                    }
                }
    
                let dominantColor = findMostVibrantColor(colorCounts);
                let boostedColor = boostBrightnessAndSaturation(dominantColor); // Make it brighter
    
                resolve(boostedColor);
            };
    
            img.onerror = () => reject("#FFFFFF"); // Default to white if error occurs
        });
    }
    
    // Convert RGB to HEX
    function rgbToHex(r, g, b) {
        return (
            "#" +
            [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase()
        );
    }
    
    // Convert HEX to RGB
    function hexToRgb(hex) {
        let bigint = parseInt(hex.slice(1), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }
    
    // Find the most vibrant color
    function findMostVibrantColor(colorCounts) {
        let maxCount = 0;
        let vibrantColor = "#FFFFFF"; // Default to white if no bright color found
    
        Object.keys(colorCounts).forEach((hex) => {
            let [r, g, b] = hexToRgb(hex);
            let brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255; // Perceived brightness
            let saturation = Math.max(r, g, b) - Math.min(r, g, b); // Saturation calculation
    
            // Prioritize highly saturated and bright colors
            if (saturation > 80 && brightness > 0.4 && brightness < 0.95 && hex !== "#000000" && hex !== "#FFFFFF") {
                if (colorCounts[hex] > maxCount) {
                    maxCount = colorCounts[hex];
                    vibrantColor = hex;
                }
            }
        });
    
        return vibrantColor;
    }
    
    // Check if the color is dull or dark
    function isDullOrDark(r, g, b) {
        let brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        let saturation = Math.max(r, g, b) - Math.min(r, g, b);
    
        return brightness < 0.3 || saturation < 50 || (r === g && g === b); // Ignore dull, dark, or gray colors
    }
    
    // Boost brightness and saturation
    function boostBrightnessAndSaturation(hex) {
        let [r, g, b] = hexToRgb(hex);
    
        // Boost brightness by 20%
        r = Math.min(255, r * 1.2);
        g = Math.min(255, g * 1.2);
        b = Math.min(255, b * 1.2);
    
        // Boost saturation manually (pull colors away from grayscale)
        let max = Math.max(r, g, b);
        if (max > 0) {
            let factor = 255 / max;
            r = Math.min(255, r * factor);
            g = Math.min(255, g * factor);
            b = Math.min(255, b * factor);
        }
    
        let boostedHex = rgbToHex(Math.round(r), Math.round(g), Math.round(b));
    
        // Ensure the boosted color is not white or black
        if (boostedHex === "#000000" || boostedHex === "#FFFFFF") {
            return "#FFD700"; // Return gold if the boosted color is invalid
        }
    
        return boostedHex;
    }
    
    // Example Usage:
    // getDominantBrightColor("https://t.scdn.co/images/8a0fabf4d537486e9b5a4623c921f77e.jpeg")
    //     .then((color) => console.log("Brighter Color:", color))
    //     .catch((err) => console.error(err));
    
    
      
    // Example Usage:
    // getDominantBrightColor("https://t.scdn.co/images/8a0fabf4d537486e9b5a4623c921f77e.jpeg")
    // .then((color) => color)
    // .catch(() => '#fff');
    
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
        <div className="enlarged_browser_card_container" style={{ ...props.common_styles, ...props.specific_style }}>
            <h1 className="browse_head">Start browsing</h1>
            <div className="browse_elms_container dff">
                <Link to="/" className="browse_elm"
                style={{backgroundColor: `${
                    getRandomBrightColor(brightColors)
                }`}}
                >
                    <div className="browse_elm_head">Music</div>
                    <div className="browse_elm_img_container dff">hello</div>
                </Link>
                <Link to="/" className="browse_elm"
                style={{backgroundColor: `${
                    getRandomBrightColor(brightColors)
                }`}}
                >
                    <div className="browse_elm_head">Podcasts</div>
                    <div className="browse_elm_img_container dff">hello</div>
                </Link>
                <Link to="/" className="browse_elm"
                style={{backgroundColor: `${
                    getRandomBrightColor(brightColors)
                }`}}
                >
                    <div className="browse_elm_head">Live Events</div>
                    <div className="browse_elm_img_container dff">hello</div>
                </Link>
            </div>
            <h1 className="browse_head">Browse all</h1>
            <div className="browse_elms_container dff">
                {loading ? <p>Loading...</p> : displayingCategory}
            </div>
        </div>
    );
}
