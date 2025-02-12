import React, { useState, useEffect, useRef } from "react";
import './CentreMainContent.css';
import CentreContentNavbar from "./CentreContentNavbar";
import CentreContentItemsContainer from "./CentreContentItemsContainer";
import { usePlaylistLoader } from "../../../customHooks/LoadPersonalPlaylist";
import Footer from "./Footer";

export default function CentreMainContent(props) {
    const [isScrolled1, setScrolled1] = useState(false);
    const [isScrolled2, setScrolled2] = useState(false);


    // const { loading, userPlaylistDetails } = usePlaylistLoader();


    const contentRef = useRef(null);  // Create a ref to reference the div element

    // if (loading) {
    //     console.log("The user playlists are loading.");
    // }

    // console.log(userPlaylistDetails);
    // const homePagePlaylist = userPlaylistDetails.slice(0, 8);
    
    // console.log(homePagePlaylist);
    // const targetPlaylist = homePagePlaylist[Math.floor(Math.random() * homePagePlaylist.length)];
    // console.log(targetPlaylist);
    // const targetPlaylistImageURL = targetPlaylist.user_playlist_image;
    // console.log(targetPlaylistImageURL);



    // const img_url = targetPlaylistImageURL;
    //   const img = new Image();
    //   img.crossOrigin = "Anonymous"; // Enable CORS for cross-origin images
    //   img.src = img_url;
    //   img.onload = () => {
    //     // Create a canvas dynamically
    //     const canvas = document.createElement("canvas");
    //     const ctx = canvas.getContext("2d");

    //     // Set canvas size to match the image
    //     canvas.width = img.width;
    //     canvas.height = img.height;

    //     // Draw the image on the canvas
    //     ctx.drawImage(img, 0, 0, img.width, img.height);

    //     // Extract pixel data
    //     const imageData = ctx.getImageData(0, 0, img.width, img.height);
    //     const dominantColor = getDominantColor(imageData);

    //     // Generate 10 shades of the dominant color
    //     const shades = generateShades(dominantColor, 20);
    //     console.log("These are the shades - \n\n" + shades);
    //     setLinearStyles({
    //       // background: `linear-gradient(${shades.join(', ')})`,
    //       background: `linear-gradient(
    //                     ${shades.map((shade, index) => {
    //                       const percentage = (
    //                         index *
    //                         (30 / (shades.length - 1))
    //                       ).toFixed(2); // Evenly distribute between 0% and 15%
    //                       const darkerShade = darkenColor(shade, 0.4, 0.8); // Lighten by 40% and add transparency
    //                       return `${darkerShade} ${percentage}%`;
    //                     })})
                    
    //                 `,
    //     });
    //     function darkenColor(color, percentage, transparency) {
    //       // Extract RGB components from the color
    //       const [r, g, b] = color.match(/\d+/g).map(Number);

    //       // Darken the color by adjusting towards 0, with a much higher percentage
    //       const newR = Math.max(0, Math.round(r - r * percentage));
    //       const newG = Math.max(0, Math.round(g - g * percentage));
    //       const newB = Math.max(0, Math.round(b - b * percentage));

    //       return `rgb(${newR}, ${newG}, ${newB}, ${transparency})`;
    //     }

    //     setLinearStyles2({
    //       background: `linear-gradient(
    //           ${shades
    //             .map((shade, index) => {
    //               const stepSize = 200 / (shades.length - 1); // Evenly distribute shades between 0px and 200px
    //               const position = (index * stepSize).toFixed(2); // Calculate position for each shade
    //               const darkerShade = darkenColor(shade, 0.8, 0.8); // Darken by 80% and add transparency
    //               return `${darkerShade} ${position}px`;
    //             })
    //             .join(", ")}, 
    //           #131313 280px
    //         )`,
    //       // backgroundSize: "100% 600px" /* Fix the gradient height to 300px */,
    //       // backgroundRepeat: "no-repeat",
    //     });
    //   };

    //   function getDominantColor(imageData) {
    //     const pixels = imageData.data;
    //     const colorCount = {};
    //     let vibrantColor = "";
    //     let maxCount = 0;

    //     for (let i = 0; i < pixels.length; i += 4) {
    //       const r = pixels[i];
    //       const g = pixels[i + 1];
    //       const b = pixels[i + 2];

    //       // Skip dark colors (shades of black)
    //       if (r < 50 && g < 50 && b < 50) continue;

    //       // Skip shades of gray
    //       if (Math.abs(r - g) < 10 && Math.abs(g - b) < 10) continue;

    //       // Convert RGB to HSL for brightness and saturation filtering
    //       const [h, s, l] = rgbToHsl(r, g, b);

    //       // Skip desaturated (low saturation) or dark (low lightness) colors
    //       if (s < 0.4 || l < 0.5) continue;

    //       const rgb = `rgb(${r},${g},${b})`;
    //       colorCount[rgb] = (colorCount[rgb] || 0) + 1;

    //       if (colorCount[rgb] > maxCount) {
    //         maxCount = colorCount[rgb];
    //         vibrantColor = rgb;
    //       }
    //     }

    //     // Fallback to a default color if no vibrant color is found
    //     return vibrantColor || "rgb(200, 200, 200)";
    //   }
    //   function rgbToHsl(r, g, b) {
    //     r /= 255;
    //     g /= 255;
    //     b /= 255;

    //     const max = Math.max(r, g, b);
    //     const min = Math.min(r, g, b);
    //     let h,
    //       s,
    //       l = (max + min) / 2;

    //     if (max === min) {
    //       h = s = 0; // Achromatic
    //     } else {
    //       const d = max - min;
    //       s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    //       switch (max) {
    //         case r:
    //           h = (g - b) / d + (g < b ? 6 : 0);
    //           break;
    //         case g:
    //           h = (b - r) / d + 2;
    //           break;
    //         case b:
    //           h = (r - g) / d + 4;
    //           break;
    //       }
    //       h /= 6;
    //     }

    //     return [h, s, l];
    //   }
    //   function generateShades(color, numShades) {
    //     const [r, g, b] = color.match(/\d+/g).map(Number); // Extract RGB values
    //     const shades = [];

    //     for (let i = 0; i < numShades; i++) {
    //       const factor = 0.9 + i * 0.01; // Slightly vary the factor for lighter shades
    //       const newR = Math.min(255, Math.round(r * factor));
    //       const newG = Math.min(255, Math.round(g * factor));
    //       const newB = Math.min(255, Math.round(b * factor));

    //       shades.push(`rgb(${newR}, ${newG}, ${newB})`);
    //     }

    //     console.log(shades);
    //     return shades;
    //   }

    useEffect(() => {
        const mainContent = contentRef.current;

        const handleScroll = () => {
            if (mainContent.scrollTop > 50) {
                setScrolled1(true);
            } else {
                setScrolled1(false);
            }

            if (mainContent.scrollTop > 200) {
                setScrolled2(true);
            } else {
                setScrolled2(false);
            }
        };

        mainContent.addEventListener('scroll', handleScroll);

        // Cleanup the event listener on component unmount
        return () => {
            mainContent.removeEventListener('scroll', handleScroll);
        };
    }, []);  // Empty dependency array to run the effect once when component mounts

    return (
        <>
            { isScrolled2 == false ? (
                <div 
                    className="centre_main_content_container" 
                    // style={{ ...props.common_styles, ...props.specific_style, background: 'red' }} 
                    style={{ ...props.common_styles, ...props.specific_style}} 
                    id="centre_main_content_container" 
                    ref={contentRef} // Attach the ref to the div
                >
                    <CentreContentNavbar scrollValue={isScrolled1} />
                    <CentreContentItemsContainer />
                    <Footer/>
                </div>
            ) : (
                <div 
                    className="centre_main_content_container content_scroll_effect" 
                    style={{ ...props.common_styles, ...props.specific_style }} 
                    id="centre_main_content_container" 
                    ref={contentRef} // Attach the ref to the div
                >
                    <CentreContentNavbar scrollValue={isScrolled1} />
                    <CentreContentItemsContainer />
                    <Footer/>
                </div>
            ) }
        </>
    );
}
