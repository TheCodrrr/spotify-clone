import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './EnlargedMediumPlaylist.css';

// Import the images explicitly
import bgImage1 from "../../../assets/image/bgImage1.webp";
import bgImage2 from "../../../assets/image/bgImage2.webp";
import bgImage3 from "../../../assets/image/bgImage3.webp";
import bgImage4 from "../../../assets/image/bgImage4.webp";
import bgImage5 from "../../../assets/image/bgImage5.webp";

export default function EnlargedMediumPlaylist(props) {
    const playlist_data = props['section_playlist_data'];

    // Use the imported images in the array
    let bgImages = [bgImage1, bgImage2, bgImage3, bgImage4, bgImage5];

    // Select a random backup image
    const backupImage = bgImages[Math.floor(Math.random() * bgImages.length)];

    // Default and backup images
    const defaultImage = playlist_data['image'];

    // State to track the image URL
    const [imageUrl, setImageUrl] = useState(defaultImage);

    // Check if the image is valid
    useEffect(() => {
        const img = new Image();
        img.src = defaultImage;

        img.onload = () => {
            setImageUrl(defaultImage);
        };

        img.onerror = () => {
            console.error("Image failed to load, using backup");
            setImageUrl(backupImage);
        };
    }, [defaultImage, backupImage]);

    const backgroundPlaylists = {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <Link to={`/item/${playlist_data.id}`} className="enlarged_section_playlist">
            <div className="enlarged_section_playlist_img_container dff">
                <div style={backgroundPlaylists} className="enlarged_section_playlist_img df">
                    <div className="enlarged_playlist_play_pause_btn dff">
                        <i className="fa-solid fa-play enlarged_playlist_play_pause_btn_icon"></i>
                    </div>
                </div>
            </div>
            <h5 className="enlarged_section_playlist_tagline">
                {
                playlist_data['description'] == "No description available" ? playlist_data['name'] : playlist_data['description']
                }
            </h5>
        </Link>
    );
}
