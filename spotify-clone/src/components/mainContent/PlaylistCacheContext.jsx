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
  const [isLoading, setIsLoading] = useState(false);

  const SPOTIFY_API_URL = "http://localhost:5000/api/spotify";

  const prefetchPlaylistData = useCallback(async () => {
    // Don't prefetch if already loading or if cache already exists
    if (isLoading || playlistCache.has('playlists')) {
      return;
    }

    setIsLoading(true);
    try {
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
      
      console.log('Playlist data prefetched and cached');
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
      console.log('Using cached playlist data');
      return cached.data;
    }

    // If no cache or cache is stale, fetch fresh data
    console.log('Fetching fresh playlist data');
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

  const clearCache = useCallback(() => {
    setPlaylistCache(new Map());
  }, []);

  const value = {
    prefetchPlaylistData,
    getPlaylistData,
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
