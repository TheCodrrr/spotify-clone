import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import './EnlargedPlaylistCard.css';
import './PlaylistPublic.css'
import Footer from "./centreContent/Footer";
import { fetchPublicPlaylist } from "./fetchPublicPlaylist";

export default function PublicPlaylist(props) {
    const { id } = useParams();
    console.log(`Here is your id: ${id} and its type: ${typeof(id)}`);

    const [loading, setLoading] = useState(true);
    const [fetchedPlaylist, setFetchedPlaylist] = useState({});
    const [songList, setSongList] = useState([]);
    const [linear_styles, setLinearStyles] = useState({});
    const [linear_styles2, setLinearStyles2] = useState({});
    const [playlistSongs, setPlaylistSongs] = useState([]);

    console.log(`PublicPlaylist.jsx: ${id}`);

    function formatTime(ms) {
        if (ms < 0) return "Invalid input"; // Handle negative input
    
        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
    
        seconds %= 60;
        minutes %= 60;
    
        if (hours >= 24) return "above 24 hr";
        if (hours > 0) return `about ${hours} hr, ${minutes} min, ${seconds} sec`;
        if (minutes > 0) return `about ${minutes} min, ${seconds} sec`;
        return `${seconds} sec`;
    }

    function formatText1(text, len) {
        if (text.length > len) return text.slice(0, len) + '...'
        return text;
    }
    function formatText2(text, len) {
        if (text.length > len) return text.slice(0, len)
        return text;
    }
    function formatSingers(singersList) {
        let singers = ""
        for (let singer of singersList) {
            singers += singer + ", ";
        }
        singers = singers.slice(0, singers.length - 2);
        return singers;
    }
    function formatDate(isoString) {
        const date = new Date(isoString);
    
        const options = { year: "numeric", month: "short", day: "2-digit" };
        return date.toLocaleDateString("en-US", options);
    }
    function formatMilliseconds(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    useEffect(() => {
        setLoading(true); // ✅ Set loading before fetching
    
        fetchPublicPlaylist(id)
            .then((playlistDetails) => {
                if (playlistDetails) {
                    setFetchedPlaylist(playlistDetails);
                    setSongList(playlistDetails.songs);
    
                    // ✅ Use playlistDetails.songs instead of songList
                    setPlaylistSongs(
                        playlistDetails.songs.map((element, index) => (
                            <tr key={index} className="table_row table_row_item df-ai">
                                <td className="enlarged_card_col enlarged_card_col1 dff">{index + 1}</td>
                                <td className="enlarged_card_col enlarged_card_col2 df-ai">
                                    <div className="enlarged_card_col_img_container dff">
                                        <img src={element.image} alt="Song" className="song-image" />
                                    </div>
                                    <div className="enlarged_card_col_content df-jc">
                                        <Link to={`/song/${element.id}`} className="enlarged_card_col_content_name">
                                            {formatText1(element.name, 20)}
                                        </Link>
                                        <div className="enlarged_card_col_content_singer">
                                            {formatText1(formatSingers(element.artists), 30)}
                                        </div>
                                    </div>
                                </td>
                                <td className="enlarged_card_col enlarged_card_col3 df-ai">
                                    {formatText1(element.album, 20)}
                                </td>
                                <td className="enlarged_card_col enlarged_card_col4 df-ai">
                                    {formatDate(element.date_added)}
                                </td>
                                <td className="enlarged_card_col enlarged_card_col5 dff">
                                    {formatMilliseconds(element.duration_ms)}
                                </td>
                            </tr>
                        ))
                    );
                }
            })
            .catch((error) => console.error("Error:", error))
            .finally(() => setLoading(false)); // ✅ Set loading to false after fetching completes
            
            const img_url = fetchedPlaylist.image;
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

                console.log(shades);
                return shades;
            }

    }, [id]); // ✅ Use only id as a dependency
    

    console.log("getting song list: " + JSON.stringify(songList));

    console.log(`type of songlist is ${typeof(songList)}`);

    let total_ms = 0;

    
    for (let song of songList) {
        total_ms += song.duration_ms;
    }

    let total_time = formatTime(total_ms);

    console.log(JSON.stringify(linear_styles));

    // console.log(`The time: ${total_time}`);

    // console.log(`fetchedPlaylist = ${JSON.stringify(fetchedPlaylist)}`);
    

    if (loading) {
        console.log("Loading is true.")
        return (
            <div
            className="enlarged_playlist_container enlarged_playlist_loading_container dff"
            style={{ ...props.common_styles, ...props.specific_style }}
            >
            <div className="load_btn_circle load_btn_circle1"></div>
            <div className="load_btn_circle load_btn_circle2"></div>
            <div className="load_btn_circle load_btn_circle3"></div>
            </div>
        );
      }

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
                    src={ fetchedPlaylist.image }
                    alt="Playlist"
                    className="banner_images"
                  />
                </div>
                <div className="enlarged_playlist_head_container df">
                  <h1 className="enlarged_content_name enlarged_content_name2 df-ai">
                  { fetchedPlaylist.name }
                  </h1>
                  <div className="enlarged_content_other_details df-ai">
                    <img
                      src=''
                      alt="Owner"
                      className="enlarged_content_owner_image_container enlarged_content_other_details_child"
                    />
                    <a
                      href="#"
                      className="enlarged_content_other_details_child enlarged_content_owner_name"
                    >
                      {/* { fetchedPlaylist.owner.name } */}
                    </a>
                    <span className="enlarged_content_other_details_child">•</span>
                    <div className="enlarged_content_other_details_child">
                      { fetchedPlaylist.total_saves } saves

                    </div>
                    <span className="enlarged_content_other_details_child">•</span>
                    <div className="enlarged_content_other_details_child">
                      {/* {playlist.no_of_songs} songs, about {playlist.total_playtime_hr != 0 ? playlist.total_playtime_hr + " hr " + playlist.total_playtime_min + " min" : playlist.total_playtime_min + " min " + playlist.total_playtime_sec + " sec"} */}
                      { fetchedPlaylist.total_songs } songs, { total_time }

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
                  <div className="middle_navbar_expand_btn_container dff">
                    • • •
                  </div>
                </div>
                <div className="middle_navbar_child middle_navbar_right_container dff">
                  <div className="middle_navbar_content_list_btn dff">
                    List
                    <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" className="Svg-sc-ytk21e-0 cAMMLk btn_left_content_list_svg">
                    <path d="M15 14.5H5V13h10v1.5zm0-5.75H5v-1.5h10v1.5zM15 3H5V1.5h10V3zM3 3H1V1.5h2V3zm0 11.5H1V13h2v1.5zm0-5.75H1v-1.5h2v1.5z" className="btn_left_content_list_path"></path>
                    </svg>
                  </div>
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
                  <tbody>{playlistSongs}</tbody>
                  {/* <tbody>{'playListSongs'}</tbody> */}
                </table>
              </div>
              <Footer/>
            </div>
              </>
    )
}