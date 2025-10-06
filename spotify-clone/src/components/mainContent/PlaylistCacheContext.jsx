import React, { createContext, useContext, useState, useCallback } from 'react';

const PlaylistCacheContext = createContext();

export const usePlaylistCache = () => {
  const context = useContext(PlaylistCacheContext);
  if (!context) {
    throw new Error('usePlaylistCache must be used within a PlaylistCacheProvider');
  }
  return context;
};

export const PlaylistCacheProvider = ({ children }) => {
  const [playlistCache, setPlaylistCache] = useState(new Map());
  const [playlistSongsCache, setPlaylistSongsCache] = useState(new Map()); // New cache for paginated songs
  const [isLoading, setIsLoading] = useState(false);

  const SPOTIFY_API_URL = "http://localhost:5000/api/spotify";

  const prefetchPlaylistData = useCallback(async () => {
    // Don't prefetch if already loading or if cache already exists
    if (isLoading || playlistCache.has('playlists')) {
      return;
    }

    setIsLoading(true);
    try {
      // Prefetch the general playlists list (without songs for listing)
      const response = await fetch(`${SPOTIFY_API_URL}/playlists/songs`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const playlists = await response.json();
      
      // Store in cache with timestamp
      setPlaylistCache(prev => new Map(prev).set('playlists', {
        data: playlists,
        timestamp: Date.now()
      }));
      
    } catch (error) {
      console.error('Error prefetching playlists:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, playlistCache]);

  const getPlaylistData = useCallback(async () => {
    const cached = playlistCache.get('playlists');
    
    // Check if cache exists and is less than 5 minutes old
    if (cached && (Date.now() - cached.timestamp < 5 * 60 * 1000)) {
      return cached.data;
    }

    // If no cache or cache is stale, fetch fresh data
    setIsLoading(true);
    try {
      const response = await fetch(`${SPOTIFY_API_URL}/playlists/songs`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const playlists = await response.json();
      
      // Update cache
      setPlaylistCache(prev => new Map(prev).set('playlists', {
        data: playlists,
        timestamp: Date.now()
      }));
      
      return playlists;
    } catch (error) {
      console.error('Error fetching playlists:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [playlistCache]);

  // New function to get paginated playlist songs
  const getPlaylistSongs = useCallback(async (playlistName, page = 1, limit = 10) => {
    const cacheKey = `${playlistName}_page_${page}`;
    const cached = playlistSongsCache.get(cacheKey);
    
    // Check if this page is cached and less than 5 minutes old
    if (cached && (Date.now() - cached.timestamp < 5 * 60 * 1000)) {
      return cached.data;
    }

    setIsLoading(true);
    try {
      const url = `${SPOTIFY_API_URL}/playlists/songs?playlistName=${encodeURIComponent(playlistName)}&page=${page}&limit=${limit}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const playlistData = await response.json();
      
      // Cache this page
      setPlaylistSongsCache(prev => new Map(prev).set(cacheKey, {
        data: playlistData,
        timestamp: Date.now()
      }));
      
      return playlistData;
    } catch (error) {
      console.error(`Error fetching songs for ${playlistName}:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [playlistSongsCache]);

  // Function to load more songs (for infinite scroll)
  const loadMoreSongs = useCallback(async (playlistName, currentSongs, nextPage, limit = 10) => {
    try {
      const response = await getPlaylistSongs(playlistName, nextPage, limit);
      
      // Merge new songs with existing ones
      const updatedPlaylistData = {
        ...response,
        songs: [...currentSongs, ...response.songs]
      };
      
      return updatedPlaylistData;
    } catch (error) {
      console.error('Error loading more songs:', error);
      throw error;
    }
  }, [getPlaylistSongs]);

  const clearCache = useCallback(() => {
    setPlaylistCache(new Map());
    setPlaylistSongsCache(new Map());
  }, []);

  const value = {
    prefetchPlaylistData,
    getPlaylistData,
    getPlaylistSongs,
    loadMoreSongs,
    clearCache,
    isLoading,
    isCached: playlistCache.has('playlists')
  };

  return (
    <PlaylistCacheContext.Provider value={value}>
      {children}
    </PlaylistCacheContext.Provider>
  );
};
