import React, { useState, useEffect, useRef } from "react";
import "./CreatePlaylist.css";
import Footer from "./Footer";
import { searchSpotify } from "../searchResult";
import axios from "axios"
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useMusicPlayer } from "../../musicPlayer/MusicPlayerContext";

const API_URL = "http://localhost:5000/api/playlists";
// const API_URL_SONG_ADD = "http://localhost:5000/api/playlists/"; // Updated API URL for adding songs

export default function CreatePlaylist(props) {
    const { playSong } = useMusicPlayer();
    const nameRef = useRef(null);
    const descRef = useRef(null);
    const imageInputRef = useRef(null); // Add this at the top of your component
    const selectedImageRef = useRef(null);
    const Navigate = useNavigate();
  const { id } = useParams();
  console.log("hello world the id is " + id);
  const [playlistImage, setPlaylistImage] = useState('')
  const [songAdded, setSongAdded] = useState(false);
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistDescription, setPlaylistDescription] = useState("Add a description");
  const [searchTerm, setSearchTerm] = useState("");
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchedParticularDetails, setFetchedParticularDetails] = useState([]);
  const [linear_styles, setLinearStyles] = useState({
    background: "linear-gradient(rgb(50, 50, 50) 0%, rgb(30, 30, 30) 30%)",
  });
  const [linear_styles2, setLinearStyles2] = useState({
    background: "linear-gradient(rgba(50, 50, 50, 0.8) 0px, #131313 280px)",
  });

//   useEffect(() => {
//     if (songAdded) {
//         fetchCurrentPlaylistSongs()
//     }
//   }, [songAdded])

  const frontendDetails = async () => {
    try {
        const res = await axios.get(`${API_URL}/${id}`);
        console.log("Playlist details fetched:", JSON.stringify(res.data));
        setPlaylistImage(res.data.photo);
        setPlaylistName(res.data.name);
        setPlaylistDescription(res.data.description);
        // setPlaylist(res.data);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setLoading(false);
      }
  }

  const deleteSongFromPlaylist = async (songId) => {
    console.log("Deleting song with ID:", songId);
    try {
        // const API_URL = "http://localhost:5000/api/playlists";
        const response = await axios.delete(`${API_URL}/song`, {
          data: { playlistId: id, songId },
        });

        if (response.status === 200) {
        //   alert("Song deleted successfully!");
          return response.data.playlist;
        }
      } catch (error) {
        console.error("Error deleting song:", error);
        // alert("Failed to delete song.");
      } finally {
          fetchCurrentPlaylistSongs()
      }

  }


  const fetchCurrentPlaylistSongs = async () => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            console.log("Fetched songs 1:", JSON.stringify(response));
            setPlaylistSongs(response.data.songs);

        } catch (err) {
            // setError('Error fetching songs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // useEffect(() => {
    //     if (!loading && playlistSongs.length > 0) {
    //         console.log("Fetched songs 2 (Updated):", JSON.stringify(playlistSongs));
    //     }
    // }, [playlistSongs, loading])

  useEffect(() => {
    frontendDetails()
    fetchCurrentPlaylistSongs()
  }, [id])  

  const cutString = (str, maxLength) => {
    return str.length > maxLength
      ? str.substring(0, maxLength) + "..." // Add ellipsis if string is too long
      : str;
  }

  useEffect(() => {
    setLoading(true);

    // if (!searchType) {
    //     console.log("Fetching all results for:", id);
    //     searchSpotify(id)
    //         .then((fetchedDetails) => {
    //             if (fetchedDetails) {
    //                 console.log("Fetched details:", fetchedDetails);
    //                 setFetchedSearchDetails(fetchedDetails);
    //             }
    //         })
    //         .catch((error) => console.error("Error:", error))
    //         .finally(() => setLoading(false));
    // } else {
    //     // Reset the state before fetching new data
    //     setFetchedParticularDetails([]);

    // console.log("Fetching specific type:", searchType, "for:", id);
    searchSpotify(searchTerm, "track,album")
      .then((fetchedDetails) => {
        if (fetchedDetails) {
          console.log("Fetched details:", fetchedDetails);
          setFetchedParticularDetails(fetchedDetails);
          console.log("FetchedParticularDetails:", fetchedParticularDetails);
        }
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoading(false));

    console.log(
      "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhheeeeeeeeeeellllllllllllooooooooo" +
        JSON.stringify(fetchedParticularDetails)
    );
  }, [searchTerm]);

  // Placeholder image for new playlist
  const placeholderImage =
    "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999";

  // Handle input changes
  const handleNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setPlaylistDescription(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  

  const AddSongToDatabase = async (item) => {
    // setSongAdded(false);
    const song = {
        songId: item.id,
        name: item.name,
        image: item.image,
        artists: item.artists,
        album: item.album,
        duration: item.duration,
        addedDate: new Date()
    }

    console.log("THis is song: " + JSON.stringify(song));

    try {
        const response = await axios.post(API_URL+'/song', {
          playlistId: id,
          song,
        });
  
        console.log("Response from server:", JSON.stringify(response));

        // if (response.status === 200) {
        //   setSongId("");
        //   setName("");
        //   setImage("");
        //   setArtists("");
        //   setAlbum("");
        // }
      } catch (error) {
        console.error("Error adding song:", error);
      } finally {
        // setSongAdded(true);
        fetchCurrentPlaylistSongs()
      }
    
    console.log("what are you doing: " + JSON.stringify(item));
  }

  const deleteEntirePlaylist = async (playlistId) => {
    try {
        const response = await axios.delete(`${API_URL}/playlist/${playlistId}`);
        if (response.status === 200) {
        //   alert("Playlist deleted successfully!");
          // Optionally refresh your playlists or redirect
          // fetchAllPlaylists(); 
        }
      } catch (error) {
        console.error("Error deleting playlist:", error);
        // alert("Failed to delete playlist.");
      } finally {
        Navigate('/');
      }
  }

  const handleSaveDetails = async () => {
    let imageUrl = 'https://cdn.pixabay.com/photo/2021/01/29/08/10/musician-5960112_1280.jpg';
  
    console.log("Selected image ref:", selectedImageRef.current);
    const formData = new FormData();
    formData.append("photo", selectedImageRef.current);
    formData.append("name", nameRef.current.value);
    formData.append("description", descRef.current.value);
    console.log("Form data:", formData.get("photo"));
    try {
      const res = await axios.put(`${API_URL}/info/${id}`, formData);
      console.log("Playlist details saved:", JSON.stringify(res));
    } catch (error) {
      console.error("Error saving playlist details:", error);
    }
  
    console.log("Saving playlist details:", {
      photo: imageUrl,
      name: playlistName,
      description: playlistDescription,
    });
  
    frontendDetails();
    setShowEditModal(false);
  };
  

  const formatDuration = ms => ms >= 3600000 ? `${Math.floor(ms/3600000)}:${String(Math.floor((ms%3600000)/60000)).padStart(2,'0')}:${String(Math.floor((ms%60000)/1000)).padStart(2,'0')}` : ms >= 60000 ? `${Math.floor(ms/60000)}:${String(Math.floor((ms%60000)/1000)).padStart(2,'0')}` : `${Math.floor(ms/1000)} sec`;


  // Edit Modal Component
  const EditDetailsModal = () => {
    if (!showEditModal) return null;

    return (
        <div
          className="edit_modal_overlay"
          onMouseDown={(e) => {
            // Prevent modal from stealing focus on mouse events
            if (e.target.classList.contains("edit_modal_overlay")) e.preventDefault();
          }}
        >
          <div className="edit_modal_container">
            <div className="edit_modal_header">
              <h2>Edit details</h2>
              <button className="cancel_button dff" onClick={handleCloseEditModal}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
      
            <div className="edit_modal_content">
            <div className="edit_modal_image_container">
                <img
                    src={playlistImage || placeholderImage}
                    alt="Playlist"
                    className="edit_modal_image"
                />

                <div
                    className="image_overlay"
                    onClick={() => imageInputRef.current.click()} // 👈 Triggers file input
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <i className="fa fa-camera" aria-hidden="true"></i>
                    <span>Choose photo</span>
                </div>

                {/* Hidden file input triggered by click on .image_overlay */}
                <input
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const tempUrl = URL.createObjectURL(file);
                        setPlaylistImage(tempUrl); // Optional: preview image
                        selectedImageRef.current = file; // Store for uploading later
                    }
                    }}
                />
            </div>


      
              <div className="edit_modal_inputs">
                <input
                  type="text"
                  className="modal_playlist_name_input"
                //   value="My Playlist"
                //   onChange={handleNameChange}
                defaultValue={playlistName}
                ref={nameRef}
                  placeholder="Add a name"
                  onClick={(e) => e.stopPropagation()} // prevent blur
                />
                <textarea
                  className="modal_playlist_description_input"
                  defaultValue={playlistDescription}
                //   onChange={handleDescriptionChange}
                ref={descRef}
                  placeholder="Add an optional description"
                  onClick={(e) => e.stopPropagation()} // prevent blur
                />
              </div>
            </div>
      
            <div className="edit_modal_footer">
              <button className="save_button" onClick={handleSaveDetails}>
                Save
              </button>
              <p className="disclaimer_text">
                By proceeding, you agree to give Spotify access to the image you
                choose to upload. Please make sure you have the right to upload the
                image.
              </p>
            </div>
          </div>
        </div>
      );
      
  };

  return (
    <div
      className="enlarged_playlist_container"
      style={{ ...props.common_styles, ...props.specific_style }}
    >
      <div
        className="enlarged_playlist_upper_container dff"
        style={{ ...linear_styles }}
      >
        <div
          className="enlarged_playlist_img_container dff"
          onClick={handleOpenEditModal}
        >
          <img
            src={playlistImage || placeholderImage}
            alt="Playlist"
            className="banner_images"
          />
        </div>
        <div className="enlarged_playlist_head_container df">
          <h5 className="enlarged_content_type">Public Playlist</h5>
          <h1
            className="enlarged_content_name enlarged_content_name2 df-ai"
            onClick={handleOpenEditModal}
          >
            {playlistName}
          </h1>
          <div className="enlarged_content_other_details df-ai">
            <img
              src="#"
              alt="User Profile"
              className="enlarged_content_other_details_child enlarged_content_other_details_child_image"
            />
            <div className="enlarged_content_other_details_child">
              The Aryan
            </div>
            <span className="enlarged_content_other_details_child">•</span>
          </div>
        </div>
      </div>
      <div
        className="enlarged_playlist_lower_container"
        style={{ ...linear_styles2 }}
      >
        <div className="middle_navbar_tab_container df-ai">
          <div className="middle_navbar_child middle_navbar_left_container dff">
            { playlistSongs.length > 0 ? (
                <div className="playlist_play_btn dff">
                    <i className="fa fa-play" aria-hidden="true"></i>
                </div>
            ) : null}
            <button className="invite_collaborators_button">
              <i className="fa fa-user-plus" aria-hidden="true"></i>
            </button>
            <div className="middle_navbar_expand_btn_container dff" onClick={() => deleteEntirePlaylist(id)}>
                <i class="fa-solid fa-trash"></i>
            </div>
          </div>
          <div className="middle_navbar_child middle_navbar_right_container dff">
            <div className="middle_navbar_content_list_btn dff">
              List
              <svg
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="Svg-sc-ytk21e-0 cAMMLk btn_left_content_list_svg"
              >
                <path
                  d="M15 14.5H5V13h10v1.5zm0-5.75H5v-1.5h10v1.5zM15 3H5V1.5h10V3zM3 3H1V1.5h2V3zm0 11.5H1V13h2v1.5zm0-5.75H1v-1.5h2v1.5z"
                  className="btn_left_content_list_path"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        {playlistSongs.length > 0 ? (
            <table className="playlist_songs_container_table dff">
            <tr className="playlist_songs_table_header_row dff">
                <th className="playlist_songs_table_header r1 dff">#</th>
                <th className="playlist_songs_table_header r2 df-ai">Title</th>
                <th className="playlist_songs_table_header r3 df-ai">Album</th>
                <th className="playlist_songs_table_header r4 df-ai">Date Added</th>
                <th className="playlist_songs_table_header r5 df-ai"></th>
                <th className="playlist_songs_table_header r6 dff">
                    <i class="fa-solid fa-clock"></i>
                </th>
                <th className="playlist_songs_table_header r7"></th>
            </tr>
            <span className="playlist_table_divider dff"></span>
                {playlistSongs.map((song, index) => (
                    <>
                        <tr className="playlist_songs_table_row dff" onClick={() => playSong({ song_name: song?.name, artists: song.artists })}>
                            <td className="playlist_songs_table_row_child r1 dff">{index + 1}</td>
                            <td className="playlist_songs_table_row_child r2 df-ai">
                                <div className="playlist_songs_table_row_child_img_container dff">
                                    {/* <img src={song.image} alt="Song" className="playlist_songs_table_row_child_img" /> */}
                                    <div className="playlist_songs_table_row_child_img_overlay dff" style={{background: `url(${song.image})`, backgroundSize: "100%"}}>
                                        <div className="playlist_songs_icon_container">
                                            <i className="fa fa-play"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="playlist_songs_table_row_child_content df-jc">
                                    <h4>{cutString(song.name, 20)}</h4>
                                    <p>{cutString(song.artists.join(", "), 20)}</p>
                                </div>
                            </td>
                            <td className="playlist_songs_table_row_child r3 df-ai">
                                <div className="playlist_album_container">
                                    {cutString(song.album, 20)}
                                </div>
                            </td>
                            <td className="playlist_songs_table_row_child r4 df-ai">{new Date(song.addedDate).toLocaleDateString()}</td>
                            <td className="playlist_songs_table_row_child r5 df-ai">
                                <div className="check_container">
                                    <i class="fa-solid fa-check"></i>
                                </div>
                            </td>
                            <td className="playlist_songs_table_row_child r6 dff">
                                {formatDuration(song.duration)}
                            </td>
                            <td className="playlist_songs_table_row_child r7 dff">
                                <div className="expand_btn_container" onClick={() => deleteSongFromPlaylist(song.songId)}>
                                    <i class="fa-solid fa-trash"></i>
                                </div>
                            </td>
                        </tr>
                    </>
                ))}
                <span className="playlist_table_divider dff"></span>
        </table>
        ) : null}
        <div className="search_songs_container">
          <div className="search_bar_parent_container df-ai">
            <div className="search_bar_left dff">
              <div className="search_header">
                <h2>Let's find something for your playlist</h2>
              </div>
              <div className="search_bar_container">
                <div className="search_icon">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </div>
                <input
                  type="text"
                  className="search_input"
                  placeholder="Search for songs or episodes"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="search_input_cancel">
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>

          <div className="search_results_container">
            {searchTerm.length > 0 && !loading ? (
              fetchedParticularDetails.map((item, index) => (
                <div
                  key={item.id || index}
                  className="fetched_details_container df-ai"
                  onClick={() => playSong({ song_name: item?.name, artists: item?.artists, image: item?.image, duration: item?.duration })}
                >
                  <div className="fetched_item_details_container df-ai">
                    <div
                      style={{
                        background: `url(${item.image || ""})`,
                        backgroundSize: "100%",
                      }}
                      className="fetched_item_img dff"
                    >
                        <div className={`play_icon_container ${item.extractType === 'track' ? "play_icon_container_track" : "play_icon_container_others"}`}>
                            <i className="fa fa-play"></i>
                        </div>
                    </div>
                    <div className="fetched_item_details_content df-jc">
                      <h4 className="fetched_item_name">{cutString(item.name, 20)}</h4>
                      <p className={`fetched_item_artist ${item.extractType === 'track' ? "fetched_item_artist_type_track" : ""}`}>
                        {item.extractType === 'track' ? cutString(item.artists?.join(", "), 30) : item.extractType.charAt(0).toUpperCase() + item.extractType.slice(1)}
                      </p>
                    </div>
                  </div>
                    <div className="fetched_other_details_container df-ai">
                      <h5 className="fetched_other_detail_album">
                        {item.extractType === 'track' ? cutString(item.album || "", 30) : null}
                      </h5>
                      {item.extractType === 'track' ? (
                        <button className="fetched_other_details_add_btn dff" onClick={() => AddSongToDatabase(item)}>
                            Add
                        </button>
                      ) : (
                        <i class="fa-solid fa-chevron-right" style={{color: '#a1a1a1'}}></i>
                      )}
                    </div>
                </div>
              ))
            ) : (
              <div className="empty_search_message">
                <p>Search for your favorite songs to add to your playlist</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <EditDetailsModal />
    </div>
  );
}
