import React, { useEffect, useState } from "react";
import Footer from "./centreContent/Footer";
import { fetchSongDetails } from "./fetchSongDetails";
import { useParams } from "react-router-dom";
import './EnlargedSong.css'

export default function EnlargedSong(props) {

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [linear_styles, setLinearStyles] = useState({});
    const [linear_styles2, setLinearStyles2] = useState({});
    const [songDetails, setSongDetails] = useState({});
    const [songArtist, setSongArtist] = useState([]);

    function formatMilliseconds(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    useEffect(() => {
        setLoading(true);

        fetchSongDetails(id)
            .then((fetchedSongDetails) => {
                if (fetchedSongDetails) {
                    setSongDetails(fetchedSongDetails);
                    setSongArtist(fetchedSongDetails.artists);
                }
            })
            .catch((error) => console.error("Error:", error))
            .finally(() => setLoading(false));

            const img_url = songDetails.album_image;
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Enable CORS for cross-origin images
            img.src = img_url;
            img.onload = () => {
                // Create a canvas dynamically
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // Set canvas size to match the image
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0, img.width, img.height);

                // Extract pixel data
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const dominantColor = getDominantColor(imageData);

                // Generate 10 shades of the dominant color
                const shades = generateShades(dominantColor, 10);
                setLinearStyles({
                // background: `linear-gradient(${shades.join(', ')})`,
                background: `linear-gradient(
                                ${shades.map((shade, index) => {
                                const percentage = (
                                    index *
                                    (30 / (shades.length - 1))
                                ).toFixed(2); // Evenly distribute between 0% and 15%
                                const darkerShade = darkenColor(shade, 0.4, 0.8); // Lighten by 40% and add transparency
                                return `${darkerShade} ${percentage}%`;
                                })})
                            
                            `,
                });
                function darkenColor(color, percentage, transparency) {
                // Extract RGB components from the color
                const [r, g, b] = color.match(/\d+/g).map(Number);

                // Darken the color by adjusting towards 0, with a much higher percentage
                const newR = Math.max(0, Math.round(r - r * percentage));
                const newG = Math.max(0, Math.round(g - g * percentage));
                const newB = Math.max(0, Math.round(b - b * percentage));

                return `rgb(${newR}, ${newG}, ${newB}, ${transparency})`;
                }

                setLinearStyles2({
                background: `linear-gradient(
                    ${shades
                        .map((shade, index) => {
                        const stepSize = 200 / (shades.length - 1); // Evenly distribute shades between 0px and 200px
                        const position = (index * stepSize).toFixed(2); // Calculate position for each shade
                        const darkerShade = darkenColor(shade, 0.8, 0.8); // Darken by 80% and add transparency
                        return `${darkerShade} ${position}px`;
                        })
                        .join(", ")}, 
                    #131313 280px
                    )`,
                // backgroundSize: "100% 600px" /* Fix the gradient height to 300px */,
                // backgroundRepeat: "no-repeat",
                });
            };

            function getDominantColor(imageData) {
                const pixels = imageData.data;
                const colorCount = {};
                let vibrantColor = "";
                let maxCount = 0;

                for (let i = 0; i < pixels.length; i += 4) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];

                // Skip dark colors (shades of black)
                if (r < 50 && g < 50 && b < 50) continue;

                // Skip shades of gray
                if (Math.abs(r - g) < 10 && Math.abs(g - b) < 10) continue;

                // Convert RGB to HSL for brightness and saturation filtering
                const [h, s, l] = rgbToHsl(r, g, b);

                // Skip desaturated (low saturation) or dark (low lightness) colors
                if (s < 0.4 || l < 0.5) continue;

                const rgb = `rgb(${r},${g},${b})`;
                colorCount[rgb] = (colorCount[rgb] || 0) + 1;

                if (colorCount[rgb] > maxCount) {
                    maxCount = colorCount[rgb];
                    vibrantColor = rgb;
                }
                }

                // Fallback to a default color if no vibrant color is found
                return vibrantColor || "rgb(200, 200, 200)";
            }
            function rgbToHsl(r, g, b) {
                r /= 255;
                g /= 255;
                b /= 255;

                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                let h,
                s,
                l = (max + min) / 2;

                if (max === min) {
                h = s = 0; // Achromatic
                } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                    case g:
                    h = (b - r) / d + 2;
                    break;
                    case b:
                    h = (r - g) / d + 4;
                    break;
                }
                h /= 6;
                }

                return [h, s, l];
            }
            function generateShades(color, numShades) {
                const [r, g, b] = color.match(/\d+/g).map(Number); // Extract RGB values
                const shades = [];

                for (let i = 0; i < numShades; i++) {
                const factor = 0.9 + i * 0.01; // Slightly vary the factor for lighter shades
                const newR = Math.min(255, Math.round(r * factor));
                const newG = Math.min(255, Math.round(g * factor));
                const newB = Math.min(255, Math.round(b * factor));

                shades.push(`rgb(${newR}, ${newG}, ${newB})`);
                }
                return shades;
            }

    }, [id]);

    return (
            <>
                <div
                  className="enlarged_playlist_container"
                  style={{ ...props.common_styles, ...props.specific_style }}
                >
                  <div
                    className="enlarged_playlist_upper_container dff"
                    style={{ ...linear_styles }}
                  >
                    <div className="enlarged_playlist_img_container dff">
                      <img
                        // src={ fetchedPlaylist.image }
                        src={ songDetails.album_image }
                        alt="Playlist"
                        className="banner_images"
                      />
                    </div>
                    <div className="enlarged_playlist_head_container df">
                      <h1 className="enlarged_content_name df-ai">
                      {/* { fetchedPlaylist.name } */}
                      { songDetails.name }
                      </h1>
                      <div className="enlarged_content_other_details df-ai">
                        <img
                        //   src={ songArtist[0].image }
                          src={ 'songArtist[0].image' }
                          alt="Owner"
                          className="enlarged_content_owner_image_container enlarged_content_other_details_child"
                        />
                        <a
                          href="#"
                          className="enlarged_content_other_details_child enlarged_content_owner_name"
                        >
                          { 'songArtist[0].name' }
                        </a>
                        <span className="enlarged_content_other_details_child">•</span>
                        <div className="enlarged_content_other_details_child">
                          {/* { fetchedPlaylist.total_saves } saves */}
                          { songDetails.album }
    
                        </div>
                        <span className="enlarged_content_other_details_child">•</span>
                        <div className="enlarged_content_other_details_child">
                          { songDetails.release_year }
                        </div>
                        <span className="enlarged_content_other_details_child">•</span>
                        <div className="enlarged_content_other_details_child">
                          { formatMilliseconds(songDetails.duration_ms) }
                        </div>
            
                      </div>
                    </div>
                  </div>
                  <div
                    className="enlarged_playlist_lower_container"
                    style={{ ...linear_styles2 }}
                  >
                  <div className="middle_navbar_tab_container df-ai">
                    <div className="middle_navbar_child middle_navbar_left_container dff">
                      <div className="middle_navbar_play_btn_container dff">
                        <i class="fa fa-play" aria-hidden="true"></i>
                      </div>
                      <div className="middle_navbar_expand_btn_container middle_navbar_add_btn_container dff">
                        <div className="middle_navbar_add_container dff">
                            <i class="fa-solid fa-plus"></i>
                        </div>
                      </div>
                      <div className="middle_navbar_expand_btn_container middle_navbar_expand_btn dff">
                       • • • 
                      </div>
                    </div>
                    <div className="middle_navbar_child middle_navbar_right_container dff">
                    </div>
                  </div>
                    <table className="enlarged_playlist_table_container df-ai">
                      <thead className="table_row_head">
                        <tr className="table_row table_row_item df-ai">
                          <th className="enlarged_card_col enlarged_card_col1 dff">#</th>
                          <th className="enlarged_card_col enlarged_card_col2 df-ai">
                            Title
                          </th>
                          <th className="enlarged_card_col enlarged_card_col3 df-ai">
                            Album
                          </th>
                          <th className="enlarged_card_col enlarged_card_col4 df-ai">
                            Date Added
                          </th>
                          <th className="enlarged_card_col enlarged_card_col5 dff">
                            <i className="fa-regular fa-clock"></i>
                          </th>
                        </tr>
                      </thead>
                      <hr className="table_head_divider" />
                      <tbody>{'playlistSongs'}</tbody>
                      {/* <tbody>{'playListSongs'}</tbody> */}
                    </table>
                  </div>
                  <Footer/>
                </div>
                  </>
        )
}