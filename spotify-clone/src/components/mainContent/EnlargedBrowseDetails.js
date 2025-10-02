const client_id = 'fa99f1012dea4fa292a3b9a593e5fd19';
const client_secret = '909967f80ec44c33b1738a2e09edbe5d';
const refresh_token = "AQDJClGX6vWk1SX2hRWG4zM9wzYu275O2v1QWZU8noz9ZdU6HaBjogRdbkrOXZjK09d1mj8bSzCy9MxSwRjsJB26sQpYLjyXmUonHXrcmj1RA9xmadMnN3zx2hido4qVUrA";

// Cache object
let categoriesCache = {
    data: null,
    timestamp: null,
    expiryTime: 30 * 60 * 1000 // Cache expires in 30 minutes
};

async function getAccessToken() {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            })
        });
        const data = await response.json();
        return data.access_token || null;
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
}

const fetchCategoriesWithImages = async () => {
    // Check if cached data is available and still valid
    if (categoriesCache.data && (Date.now() - categoriesCache.timestamp) < categoriesCache.expiryTime) {
        // console.log("Returning cached categories...");
        return categoriesCache.data;
    }

    const accessToken = await getAccessToken(); // Fetch access token

    try {
        // Fetch categories
        const categoriesResponse = await fetch("https://api.spotify.com/v1/browse/categories?limit=25", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!categoriesResponse.ok) {
            throw new Error(`Error: ${categoriesResponse.status}`);
        }

        const categoriesData = await categoriesResponse.json();
        const categories = categoriesData.categories.items;

        // Fetch first playlist for each category to get a proper image
        const categoriesWithImages = await Promise.all(
            categories.map(async (category) => {
                const playlistResponse = await fetch(
                    `https://api.spotify.com/v1/browse/categories/${category.id}/playlists?limit=1`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const playlistData = await playlistResponse.json();
                const playlistImage = playlistData.playlists?.items[0]?.images[0]?.url || category.icons[0]?.url;

                return {
                    id: category.id,
                    name: category.name,
                    image: playlistImage // Using the playlist cover instead of category icon
                };
            })
        );

        // Store data in cache
        categoriesCache = {
            data: categoriesWithImages,
            timestamp: Date.now()
        };

        // console.log("Fetched and cached categories.");
        // console.log(categoriesWithImages)
        return categoriesWithImages;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }
};

// Call the function
fetchCategoriesWithImages();

export default fetchCategoriesWithImages;
