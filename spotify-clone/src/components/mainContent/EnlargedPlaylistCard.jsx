import React, { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import "./EnlargedPlaylistCard.css";
import "react-loading-skeleton/dist/skeleton.css";
// import { getAllPlaylistsWithSongs, getSongDetails } from "./EnlargedPlaylistDetails"; // Commented out - using backend API instead
import Footer from "./centreContent/Footer";
import { useMusicPlayer } from "../musicPlayer/MusicPlayerContext";
import { usePlaylistCache } from "./PlaylistCacheContext";

const SPOTIFY_API_URL = "http://localhost:5000/api/spotify";

export default function EnlargedPlaylistCard(props) {
  const { playSong } = useMusicPlayer();
  const { name } = useParams();
  const { getPlaylistSongs, loadMoreSongs } = usePlaylistCache();
  const [playlist, setPlaylist] = useState(null);
  // Removed playListSongs state since we're using memoizedSongRows directly
  const [allSongs, setAllSongs] = useState([]); // Store all loaded songs
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [linear_styles, setLinearStyles] = useState({});
  const [linear_styles2, setLinearStyles2] = useState({});
  const [individualSongDetail, setIndividualSongDetail] = useState({});
  const [audioURL, setAudioURL] = useState("");
  const [audioLoading, setAudioLoading] = useState(true);
  const [audioError, setAudioError] = useState("");
  const tableBodyRef = useRef(null); // Ref for infinite scroll
  const playlistContainerRef = useRef(null); // Ref for the playlist container scroll
  const prevSongsLengthRef = useRef(0); // Track previous songs length for scroll preservation
  const scrollPositionRef = useRef(0); // Store scroll position during updates
  const lastScrollTimeRef = useRef(0); // For throttling scroll events
  const dataLoadedRef = useRef(false); // Track if initial data has been loaded to prevent resets

  // Commented out problematic YouTube API call that was causing infinite re-renders
  // and 404 errors since the endpoint doesn't exist
  /*
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
  */


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

  // Utility function to cut strings to a maximum length
  const cutString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + "...";
    }
    return str;
  };

  async function FetchSongInfo(song_full_name) {
  
    // Get song details by awaiting the promise
    const current_song_detail = await getSongDetailsObject(song_full_name);
  
    // Set the fetched song details to the state
    setIndividualSongDetail(current_song_detail);
  }

  // Function to process songs data (truncate long names, format times, etc.)
  const processSongs = (songs) => {
    return songs.map((element) => {
      // Create a copy to avoid mutating original data
      const processedElement = { ...element };
      
      processedElement.song_full_name = processedElement.song_name;
      processedElement.song_name = cutString(processedElement.song_name, 25);
      processedElement.song_singers = cutString(processedElement.song_singers, 20);
      processedElement.song_album = cutString(processedElement.song_album, 20);
      
      const secLength = processedElement.song_length_sec.toString().length;
      if (secLength == 1) {
        processedElement.song_length_sec = "0" + processedElement.song_length_sec.toString();
      }
      
      return processedElement;
    });
  };

  // Function to load more songs when user scrolls - use refs to avoid dependency issues
  const loadMoreSongsHandler = useCallback(async () => {
    console.log('🔄 loadMoreSongsHandler called');
    
    // Access current values from state using callbacks to avoid closure issues
    let currentLoadingMore, currentHasMore, currentCurrentPage, currentAllSongs;
    
    // Get current state values
    setLoadingMore(loading => {
      currentLoadingMore = loading;
      console.log('Current loadingMore:', loading);
      return loading;
    });
    
    setHasMore(hasMore => {
      currentHasMore = hasMore;
      console.log('Current hasMore:', hasMore);
      return hasMore;
    });
    
    setCurrentPage(page => {
      currentCurrentPage = page;
      console.log('Current page:', page);
      return page;
    });
    
    setAllSongs(songs => {
      currentAllSongs = songs;
      console.log('Current songs count:', songs.length);
      return songs;
    });
    
    if (currentLoadingMore || !currentHasMore) {
      console.log('⚠️ Skipping load: loadingMore =', currentLoadingMore, ', hasMore =', currentHasMore);
      return;
    }

    // Store current scroll position before loading more
    const container = playlistContainerRef.current;
    if (container) {
      const currentScrollTop = container.scrollTop;
      scrollPositionRef.current = currentScrollTop;
      
      // Store backup data
      const avgSongHeight = container.scrollHeight / (currentAllSongs.length || 1);
      const scrolledSongs = Math.floor(currentScrollTop / avgSongHeight);
      
      container.dataset.savedScrollTop = currentScrollTop;
      container.dataset.savedScrolledSongs = scrolledSongs;
    }

    setLoadingMore(true);
    try {
      console.log('📥 Loading next page:', currentCurrentPage + 1);
      const nextPage = currentCurrentPage + 1;
      const updatedPlaylistData = await loadMoreSongs(name, currentAllSongs, nextPage, 10);
      
      console.log('✅ Received more songs:', updatedPlaylistData.songs.length);
      console.log('📊 Pagination info:', updatedPlaylistData.pagination);
      
      // Process the new songs before setting state
      const processedSongs = processSongs(updatedPlaylistData.songs);
      
      setAllSongs(processedSongs);
      setCurrentPage(nextPage);
      setHasMore(updatedPlaylistData.pagination.hasMore);
      
    } catch (error) {
      console.error('❌ Error loading more songs:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [name, loadMoreSongs]); // Minimal dependencies

  // Memoized song rows to prevent unnecessary re-renders and scroll position resets
  const memoizedSongRows = useMemo(() => {
    if (allSongs.length === 0) return [];
    
    return allSongs.map((element, index) => {
      // Create ultra-stable key using song data + playlist name to prevent re-rendering
      const stableKey = `${name}-${element.song_full_name || element.song_name}-${index}`;
      
      return (
        <tr key={stableKey} className="table_row table_row_item df-ai" 
            onDoubleClick={() => FetchSongInfo(element.song_full_name)} 
            onClick={() => playSong({ 
              song_name: element.song_full_name, 
              artists: element.song_singers, 
              image: element.song_image, 
              duration: element.song_length_ms 
            })}>
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
      );
    });
  }, [allSongs, name]); // Simplified dependencies to prevent infinite re-renders

  // Removed problematic useEffect that was causing infinite re-renders
  // The memoizedSongRows will automatically update when allSongs changes
  // and we'll set playListSongs directly from memoizedSongRows when needed

  // Aggressive scroll position restoration using useLayoutEffect (runs before paint)
  useLayoutEffect(() => {
    const container = playlistContainerRef.current;
    if (container && scrollPositionRef.current > 0) {
      const storedPosition = scrollPositionRef.current;
      
      // Method 1: Direct scroll restoration
      container.scrollTop = storedPosition;
      
      // Method 2: Use the backup data if available
      const savedScrollTop = container.dataset.savedScrollTop;
      const savedScrolledSongs = container.dataset.savedScrolledSongs;
      
      if (savedScrollTop) {
        container.scrollTop = parseInt(savedScrollTop);
        
        // Clear the backup data
        delete container.dataset.savedScrollTop;
        delete container.dataset.savedScrolledSongs;
      }
      
      // Method 3: Multiple restoration attempts
      setTimeout(() => {
        if (container.scrollTop !== storedPosition && storedPosition > 0) {
          container.scrollTop = storedPosition;
        }
      }, 0);
      
      setTimeout(() => {
        if (container.scrollTop !== storedPosition && storedPosition > 0) {
          container.scrollTop = storedPosition;
        }
      }, 10);
      
      // Reset after restoration
      scrollPositionRef.current = 0;
    }
  }, [allSongs.length]);

  // Backup scroll position restoration with regular useEffect
  useEffect(() => {
    if (playlistContainerRef.current && scrollPositionRef.current > 0 && allSongs.length > 10) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        if (playlistContainerRef.current) {
          // Maintain scroll position near where user was when loading more songs
          const containerHeight = playlistContainerRef.current.scrollHeight;
          const targetPosition = Math.min(scrollPositionRef.current, containerHeight * 0.85);
          
          playlistContainerRef.current.scrollTop = targetPosition;
          
          // Reset stored position after restoration
          scrollPositionRef.current = 0;
        }
      });
    }
  }, [allSongs.length]);

  // Function to render songs as table rows (kept for backwards compatibility but not used)
  const renderSongs = (songs) => {
    // This function is no longer needed as we use useEffect above
    // Keeping it for backwards compatibility but it won't be called
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      try {
        // Fetch first page of songs for the specific playlist
        const playlistData = await getPlaylistSongs(name, 1, 10);
        
        if (!playlistData) {
          setPlaylist(null);
          return;
        }

        // Process songs data using the processSongs function
        const processedSongs = processSongs(playlistData.songs);

        // Set pagination state
        setAllSongs(processedSongs);
        setCurrentPage(1);
        setHasMore(playlistData.pagination.hasMore);
        
        // Set playlist data
        setPlaylist(playlistData);
        
        // Mark that data has been loaded for this playlist
        dataLoadedRef.current = name;
        
        // Don't call renderSongs - the useEffect will handle it automatically

        // Process playlist image for background gradient
        const img_url = playlistData.main_image;
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

      } catch (error) {
        console.error("Error fetching playlists:", error);
        setPlaylist(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [name]); // Only depend on name, not getPlaylistSongs to prevent resets

  // Reset data loaded flag when playlist name changes
  useEffect(() => {
    dataLoadedRef.current = false;
  }, [name]);

  // Memoized scroll handler to prevent unnecessary re-renders with debouncing
  const handleScroll = useCallback(() => {
    const playlistContainer = playlistContainerRef.current;
    if (!playlistContainer) {
      return;
    }

    // Throttle scroll events to prevent rapid firing
    const now = Date.now();
    if (now - lastScrollTimeRef.current < 100) { // Throttle to 100ms
      return;
    }
    lastScrollTimeRef.current = now;

    const { scrollTop, scrollHeight, clientHeight } = playlistContainer;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    
    // Load more when user scrolls to 70% of the container content (earlier trigger for better UX)
    // Add debouncing to prevent rapid calls
    if (scrollPercentage >= 0.70 && hasMore && !loadingMore) {
      // Store current scroll position before triggering load
      scrollPositionRef.current = scrollTop;
      loadMoreSongsHandler();
    }
  }, [hasMore, loadingMore, loadMoreSongsHandler, allSongs.length]);

  // Infinite scroll effect - use playlist container scroll instead of window scroll
  useEffect(() => {
    const playlistContainer = playlistContainerRef.current;
    if (!playlistContainer) {
      return;
    }

    playlistContainer.addEventListener('scroll', handleScroll);
    return () => {
      playlistContainer.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

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

// console.log("This is the playlist: "+JSON.stringify(playlist))

  return playlist ? (
    <>
    <div
      ref={playlistContainerRef}
      className="enlarged_playlist_container"
      style={{ 
        ...props.common_styles, 
        ...props.specific_style,
        overflowY: 'auto',
        maxHeight: '100vh'
      }}
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
              // style={{background: 'red'}}
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
          <tbody ref={tableBodyRef}>
            {memoizedSongRows}
            {loadingMore && (
              <tr className="loading_row">
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <div className="loading_indicator" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <div className="load_btn_circle load_btn_circle1"></div>
                    <div className="load_btn_circle load_btn_circle2"></div>
                    <div className="load_btn_circle load_btn_circle3"></div>
                    <span style={{ color: '#b3b3b3', marginLeft: '10px' }}>Loading more songs...</span>
                  </div>
                </td>
              </tr>
            )}
            {!hasMore && allSongs.length > 0 && (
              <tr className="end_row">
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#b3b3b3', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  🎵 All songs loaded ({allSongs.length} total)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Footer/>
    </div>
      </>
  ) : (
    <div className="not-found">Playlist not found.</div>
  );
}