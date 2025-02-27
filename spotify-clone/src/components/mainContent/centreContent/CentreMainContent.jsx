import React, { useState, useEffect, useRef, useContext } from "react";
import './CentreMainContent.css';
import CentreContentNavbar from "./CentreContentNavbar";
import CentreContentItemsContainer from "./CentreContentItemsContainer";
import { usePlaylistLoader } from "../../../customHooks/LoadPersonalPlaylist";
import Footer from "./Footer";
import { HoverContext } from "./HoverContext";


export default function CentreMainContent(props) {

    const { hoverImage } = useContext(HoverContext);
    const [isScrolled1, setScrolled1] = useState(false);
    const [isScrolled2, setScrolled2] = useState(false);
    const [linear_styles, setLinearStyles] = useState({});
    const [linear_styles2, setLinearStyles2] = useState({});

    console.log("centre Main Content The hover image: " + hoverImage);


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



    useEffect(() => {
      if (!hoverImage) {
          setLinearStyles({ background: "linear-gradient(#515860, #42494e, #121212)" });
          return;
      }
  
      const img = new Image();
      img.crossOrigin = "Anonymous"; // CORS handling
      img.src = hoverImage;
  
      img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
  
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const dominantColor = getDominantColor(imageData);
          const darkenedColor = darkenColor(dominantColor, 0.4, 1); // Darker shade
          const shades = generateShades(darkenedColor, 15); // Generate shades
  
          setLinearStyles({
              background: `linear-gradient(${shades.map((shade, i) => `${shade} ${(i * (70 / shades.length))}%`).join(", ")}, 
              #42494e 70%, #121212 100%)`,
          });
      };
  
      console.log(`The linear styles are: ${JSON.stringify(linear_styles)}`);
  }, [hoverImage]);
  
  function getDominantColor(imageData) {
      const pixels = imageData.data;
      const colorCount = {};
      let dominantColor = "";
      let maxCount = 0;
  
      for (let i = 0; i < pixels.length; i += 4) {
          let r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
  
          if (r < 40 && g < 40 && b < 40) continue;
          if (Math.abs(r - g) < 15 && Math.abs(g - b) < 15) continue;
  
          const [h, s, l] = rgbToHsl(r, g, b);
          if (s < 0.3 || l < 0.4) continue;
  
          const roundedColor = `rgb(${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10})`;
  
          colorCount[roundedColor] = (colorCount[roundedColor] || 0) + 1;
          if (colorCount[roundedColor] > maxCount) {
              maxCount = colorCount[roundedColor];
              dominantColor = roundedColor;
          }
      }
      return dominantColor || "rgb(100, 100, 100)";
  }
  
  function darkenColor(color, percentage, transparency) {
      const [r, g, b] = color.match(/\d+/g).map(Number);
  
      const newR = Math.max(0, Math.round(r * (1 - percentage)));
      const newG = Math.max(0, Math.round(g * (1 - percentage)));
      const newB = Math.max(0, Math.round(b * (1 - percentage)));
  
      return `rgb(${newR}, ${newG}, ${newB}, ${transparency})`;
  }
  
  function generateShades(color, numShades) {
      const [r, g, b] = color.match(/\d+/g).map(Number);
      const shades = [];
  
      for (let i = 0; i < numShades; i++) {
          const blendFactor = i / (numShades - 1);
          const newR = Math.round(r * (1 - blendFactor) + 66 * blendFactor);
          const newG = Math.round(g * (1 - blendFactor) + 73 * blendFactor);
          const newB = Math.round(b * (1 - blendFactor) + 78 * blendFactor);
          shades.push(`rgb(${newR}, ${newG}, ${newB})`);
      }
  
      console.log("Generated Shades:", shades);
      return shades;
  }
  
  function rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) {
          h = s = 0;
      } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
      }
      return [h, s, l];
  }
  

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
                    style={{ ...props.common_styles, ...props.specific_style, ...linear_styles }} 
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
