const CLIENT_ID = '6851ea5bb45f419d9f69400298b93e11';
const CLIENT_SECRET = 'd1eb8bd2b5354c81a2349834c814abe2';
const REFRESH_TOKEN = 'AQBdhVWJvGnPYI-H-X_XQb7uikU9wGPZnA2sPWC93KdrovbrSpELfjn4b1iudQm7-99uvRO28EZngmc3PLPOyJ-ZI-lCtX0peIFCqoQM9u_WzwOusaZKpyySr_igoZKy2vE';

const getAccessToken = async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}`,
    });
    const data = await response.json();
    return data.access_token;
};

const fetchAllCategories = async (accessToken) => {
    let categories = [];
    let url = 'https://api.spotify.com/v1/browse/categories?limit=20';
    
    while (url) {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
        if (data.categories && data.categories.items) {
            categories = categories.concat(data.categories.items);
            url = data.categories.next; // Fetch the next page if available
        } else {
            url = null; // No more pages
        }
    }
    return categories;
};

const fetchBrowseData = async () => {
    const accessToken = await getAccessToken();

    // Fetch all categories
    const browseAllList = await fetchAllCategories(accessToken);
    const formattedCategories = browseAllList.map((category) => ({
        id: category.id,
        name: category.name,
        image: category.icons[0]?.url || category.images?.[0]?.url || category.alternativeImage?.url || "default_image_url",
    }));

    return formattedCategories;
};

export { fetchBrowseData };
