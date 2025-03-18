import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Create this file for styling

export default function Login() {
    const [authStatus, setAuthStatus] = useState({ loading: true, authenticated: false, user: null });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already authenticated
        const checkAuthStatus = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/auth/status", {
                    credentials: "include" // Important for cookies
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setAuthStatus({
                        loading: false,
                        authenticated: data.authenticated,
                        user: data.user
                    });
                    
                    // Redirect to home if already authenticated
                    if (data.authenticated) {
                        navigate("/");
                    }
                } else {
                    setAuthStatus({ loading: false, authenticated: false, user: null });
                }
            } catch (err) {
                setError("Failed to check authentication status");
                setAuthStatus({ loading: false, authenticated: false, user: null });
            }
        };
        
        // Check URL for error parameters
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get("error");
        if (errorParam) {
            setError(errorParam === "spotify_auth_failed" 
                ? "Failed to authenticate with Spotify. Please try again." 
                : "Authentication failed. Please try again.");
        }
        
        checkAuthStatus();
    }, [navigate]);

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/api/auth/google";
    };

    return (
        <div className="login-container" style={{ ...props.common_styles, ...props.specific_style }}>
            <div className="login-content">
                <div className="login-logo">
                    <i className="fa-brands fa-spotify"></i>
                    <h1>Spotify Clone</h1>
                </div>
                
                {authStatus.loading ? (
                    <div className="login-loading">Loading...</div>
                ) : authStatus.authenticated ? (
                    <div className="login-success">
                        <p>You are already logged in as {authStatus.user?.name}</p>
                        <button onClick={() => navigate("/")}>Go to Home</button>
                    </div>
                ) : (
                    <div className="login-options">
                        <h2>Log in to continue</h2>
                        
                        {error && <div className="login-error">{error}</div>}
                        
                        <button className="google-login-button" onClick={handleGoogleLogin}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
                            <span>Continue with Google</span>
                        </button>
                        
                        <div className="login-divider">
                            <span>OR</span>
                        </div>
                        
                        <p className="login-info">
                            By logging in, you'll be able to access your Spotify account and playlists.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}