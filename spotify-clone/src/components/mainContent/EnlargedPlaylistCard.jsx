import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./EnlargedPlaylistCard.css";
import "react-loading-skeleton/dist/skeleton.css";
// import { getAllPlaylistsWithSongs, getSongDetails } from "./EnlargedPlaylistDetails"; // Commented out - using backend API instead
import Footer from "./centreContent/Footer";
import { useMusicPlayer } from "../musicPlayer/MusicPlayerContext";

const SPOTIFY_API_URL = "http://localhost:5000/api/spotify";

export default function EnlargedPlaylistCard(props) {
  const { playSong } = useMusicPlayer();
  const { name } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [playListSongs, setPlayListSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linear_styles, setLinearStyles] = useState({});
  const [linear_styles2, setLinearStyles2] = useState({});
  const [individualSongDetail, setIndividualSongDetail] = useState({});
  const [audioURL, setAudioURL] = useState("");
  const [audioLoading, setAudioLoading] = useState(true);
  const [audioError, setAudioError] = useState("");

  useEffect(() => {
    async function fetchSongFromYoutube(songName, artist, album, releaseYear) {
      setAudioLoading(true);
      setAudioError("");
      setAudioURL("");
      try {
        const response = await fetch(
          `http://localhost:5000/api/youtube/search?songName=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artist || "")}&album=${encodeURIComponent(album || "")}&releaseYear=${encodeURIComponent(releaseYear || "")}`
        );
  
        const data = await response.json();
  
        if (response.ok && data.audioUrl) {
          setAudioURL(data.audioUrl);
        } else {
          setAudioError(data.error || "No audio found.");
        }
      } catch (err) {
        setAudioError("Failed to fetch audio. Please try again.");
      }
  
      setAudioLoading(false);
    }
  
    fetchSongFromYoutube("Shape of You", "Ed Sheeran", "Divide", "2017");
  }, []);


  async function getSongDetailsObject(songFullName) {
    try {
      // Old method using direct import (commented out)
      // const songDetails = await getSongDetails(songFullName);

      // New method using backend API
      const response = await fetch(`${SPOTIFY_API_URL}/song/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ songName: songFullName })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const songDetails = await response.json();
  
      // Check if the song details were fetched successfully
      if (songDetails) {
        // console.log("Hello hello: ", songDetails);
        // Return the song details as an object
        return {
          song_name: songDetails.song_name,
          song_album: songDetails.song_album,
          album_image: songDetails.album_image,
          song_artists: songDetails.song_artists,
          release_date: songDetails.release_date,
          song_length_ms: songDetails.song_length_ms,
          song_length_min: songDetails.song_length_min,
          song_length_sec: songDetails.song_length_sec,
          external_url: songDetails.external_url
        };
      } else {
        throw new Error("Song details could not be fetched.");
      }
    } catch (error) {
      console.error("Error occurred while fetching song details:", error);
      return null;
    }
  }

  async function FetchSongInfo(song_full_name) {
  
    // Get song details by awaiting the promise
    const current_song_detail = await getSongDetailsObject(song_full_name);
  
    // Set the fetched song details to the state
    setIndividualSongDetail(current_song_detail);
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      try {
        // Old method using direct import (commented out)
        // const playlists = await getAllPlaylistsWithSongs();

        // New method using backend API
        const response = await fetch(`${SPOTIFY_API_URL}/playlists/songs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const playlists = await response.json();
        // console.log("Hello hello 2: ", playlists);
        
        const selectedPlaylist = playlists.find(
          (playlist) => playlist.playlist_name === name
        );

      const img_url = selectedPlaylist.main_image;
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

      selectedPlaylist.songs.map((element) => {
        element.song_full_name = element.song_name;
        if (element.song_name.length > 25) {
          element.song_name = element.song_name.slice(0, 25) + "..."; // Use .slice() to truncate
        }
        if (element.song_singers.length > 20) {
          element.song_singers = element.song_singers.slice(0, 20) + "..."; // Use .slice() to truncate
        }
        if (element.song_album.length > 20) {
          element.song_album = element.song_album.slice(0, 20) + "..."; // Use .slice() to truncate
        }
        const secLength = element.song_length_sec.toString().length;
        if (secLength == 1) {
          element.song_length_sec = "0" + element.song_length_sec.toString();
        }
      });

      if (selectedPlaylist) {
        selectedPlaylist.total_playtime_min = Math.floor(selectedPlaylist.total_playtime_sec / 60);
        selectedPlaylist.total_playtime_sec = selectedPlaylist.total_playtime_sec % 60;
        
        selectedPlaylist.total_playtime_hr = Math.floor(selectedPlaylist.total_playtime_min / 60);
        selectedPlaylist.total_playtime_min = selectedPlaylist.total_playtime_sec % 60;

        setPlaylist(selectedPlaylist);

        setPlayListSongs(
          selectedPlaylist.songs.map((element, index) => (
            <tr key={index} className="table_row table_row_item df-ai" onDoubleClick={() => FetchSongInfo(element.song_full_name)} onClick={() => playSong({ song_name: element.song_full_name, artists: element.song_singers, image: element.song_image, duration: element.song_length_ms })}>
              <td className="enlarged_card_col enlarged_card_col1 dff">
                {index + 1}
              </td>
              <td className="enlarged_card_col enlarged_card_col2 df-ai">
                <div className="enlarged_card_col_img_container dff">
                  <img
                    src={element.song_image}
                    alt="Song"
                    className="song-image"
                  />
                </div>
                <div className="enlarged_card_col_content df-jc">
                  <div className="enlarged_card_col_content_name">
                    {element.song_name}
                  </div>
                  <div className="enlarged_card_col_content_singer">
                    {element.song_singers}
                  </div>
                </div>
              </td>
              <td className="enlarged_card_col enlarged_card_col3 df-ai">
                {element.song_album}
              </td>
              <td className="enlarged_card_col enlarged_card_col4 df-ai">
                {element.date_added}
              </td>
              <td className="enlarged_card_col enlarged_card_col5 dff">
                {element?.song_length_min} : {element?.song_length_sec}
              </td>
            </tr>
          ))
        );
      }
      } catch (error) {
        console.error("Error fetching playlists:", error);
        setPlaylist(null);
      } finally {
        setLoading(false);
      }
      // console.log("Playlist data fetched successfully:", playlist.songs);
    }

    fetchData();
  }, [name]);

  const formattedSongs = playlist?.songs?.map((song) => ({
    song_name: song.song_name,
    artists: song.song_singers,
    image: song.song_image,
    album: song.song_album,
    // optionally add more fields like `date_added` or `id` if needed
  }));

  // console.log("This is the formatted songs: "+JSON.stringify(formattedSongs))

  if (loading) {
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

  const cutString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };

// console.log("This is the playlist: "+JSON.stringify(playlist))

  return playlist ? (
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
            src={playlist.main_image}
            alt="Playlist"
            className="banner_images"
          />
        </div>
        <div className="enlarged_playlist_head_container df">
          <h1 className="enlarged_content_name df-ai">
            {cutString(playlist?.playlist_name, 25)}
          </h1>
          <div className="enlarged_content_other_details df-ai">
            <img
              src="/profile.jpeg"
              alt="Owner"
              className="enlarged_content_owner_image_container enlarged_content_other_details_child"
            />
            <a
              href="#"
              className="enlarged_content_other_details_child enlarged_content_owner_name"
            >
              {playlist.playlist_owner}
            </a>
            <span className="enlarged_content_other_details_child">•</span>

            <div className="enlarged_content_other_details_child">
              {playlist.no_of_songs} songs{playlist.total_playtime_hr ? `, about ${playlist.total_playtime_hr != 0 ? playlist.total_playtime_hr + " hr " + playlist.total_playtime_min + " min" : playlist.total_playtime_min + " min " + playlist.total_playtime_sec + " sec"}` : ""}
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
          <tbody>{playListSongs}</tbody>
        </table>
      </div>
      <Footer/>
    </div>
      </>
  ) : (
    <div className="not-found">Playlist not found.</div>
  );
}