import React, { useEffect, useRef } from "react";
import './MyPlaylistContainer.css';
import MyPlaylistCard from "./MyPlaylistCard";
import { usePlaylistLoader } from "../../../customHooks/LoadPersonalPlaylist";
import MyPlaylistLoadingCard from "./MyPlaylistLoadingCard";
import { usePlaylistCache } from "../PlaylistCacheContext";

export default function MyPlaylistContainer() {
    const { loading, userPlaylistDetails } = usePlaylistLoader();
    const { prefetchPlaylistData } = usePlaylistCache();
    const containerRef = useRef(null);

    // Use Intersection Observer to detect when container is visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Container is visible, prefetch playlist data
                        prefetchPlaylistData();
                    }
                });
            },
            {
                root: null, // relative to viewport
                rootMargin: '100px', // trigger 100px before component becomes visible
                threshold: 0.1 // trigger when 10% of component is visible
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [prefetchPlaylistData]);

    // Render loading state while data is being fetched
    if (loading) {
        return (
            <div className="my_playlist_container df" ref={containerRef}>
                {[...Array(8)].map((_, i) => <MyPlaylistLoadingCard key={i} />)}
            </div>
        );
    }

    // Slice the first 8 playlists for the home page display
    const homePagePlaylist = userPlaylistDetails?.slice(0, 8);

    // Render the playlist cards once the data is available
    const MyPlaylistCards = homePagePlaylist?.map((item) => (
        <MyPlaylistCard key={item.id} details={item} />
    ));

    return (
        <div className="my_playlist_container df" ref={containerRef}>
            {MyPlaylistCards}
        </div>
    );
}
