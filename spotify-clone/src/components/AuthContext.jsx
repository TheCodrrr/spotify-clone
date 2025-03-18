import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [spotifyCredentials, setSpotifyCredentials] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/status', {
                    withCredentials: true
                });
                
                if (response.data.authenticated) {
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                    fetchSpotifyCredentials();
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                    setSpotifyCredentials(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setUser(null);
                setIsAuthenticated(false);
                setSpotifyCredentials(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const fetchSpotifyCredentials = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/spotify/credentials', {
                withCredentials: true
            });
            setSpotifyCredentials(response.data);
        } catch (error) {
            console.error('Failed to get Spotify credentials:', error);
            setSpotifyCredentials(null);
        }
    };

    const logout = async () => {
        try {
            await axios.get('http://localhost:5000/api/auth/logout', {
                withCredentials: true
            });
            setUser(null);
            setIsAuthenticated(false);
            setSpotifyCredentials(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const refreshSpotifyToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/spotify/credentials', {
                withCredentials: true
            });
            setSpotifyCredentials(response.data);
            return response.data.accessToken;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return null;
        }
    };

    // Spotify API call helper
    const callSpotifyApi = async (endpoint, options = {}) => {
        if (!spotifyCredentials) {
            throw new Error('Not authenticated with Spotify');
        }

        try {
            const response = await axios({
                url: `https://api.spotify.com/v1/${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${spotifyCredentials.accessToken}`,
                    ...options.headers
                },
                ...options
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Token expired, refresh and retry
                const newToken = await refreshSpotifyToken();
                if (newToken) {
                    return axios({
                        url: `https://api.spotify.com/v1/${endpoint}`,
                        headers: {
                            'Authorization': `Bearer ${newToken}`,
                            ...options.headers
                        },
                        ...options
                    }).then(response => response.data);
                }
            }
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            spotifyCredentials,
            logout,
            refreshSpotifyToken,
            callSpotifyApi
        }}>
            {children}
        </AuthContext.Provider>
    );
};