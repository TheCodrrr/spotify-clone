let cache = {
    accessToken: null,
    tokenExpiry: null,
    playlistsCache: null,
    cacheTimestamp: null,
    cachedPlaylists: null,
    cachedPlaylists2: null,
    cachedPlaylists3: null,
    cachedSongPromise: null,
    allPlaylistsWithSongs: null,
    allPlaylistsWithSongs_timestamp: null,
    categoriesCache: {
        data: null,
        timestamp: null,
        expiryTime: 30 * 60 * 1000,
    },
    searchCache: {},
};

export default cache