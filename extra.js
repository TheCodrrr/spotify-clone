const CLIENT_ID = "fa99f1012dea4fa292a3b9a593e5fd19";
const CLIENT_SECRET = "909967f80ec44c33b1738a2e09edbe5d";
// const fetch = require("node-fetch");

const REDIRECT_URI = "http://localhost:3000/callback";
const AUTH_CODE = "AQCRbSNyoBg9PkOQHVXMOfwYmxnsQypGwARjCR6IbfeKm5etRyPzZoJSNO5R07i5BmzYLF-0KJdfgU1Ow0TYbDL93ah9chWOkSBg4UvTlPYwaC5SOJ6ktNgnv1povOGDltSWruD3pPcxYlqGs5OtuWPDdad8R7HZnFt9WY9J-bOIZI0FbtFjMJwGP25A4SyNm-JmghmWnwYQcOV3DgYxzVx1AR5rLw";  // Extracted from the redirect URL

const access_token = "BQAs90mpP-GUoFv7mP7vkU9Bcl3oEymSWsAZmY9Q9o5i4mELUQ5x1YpVRmV7EPIxDnpfBFyal9Ecn7B1b3L35E2UFgroODDP0BgeBuRtuiJ4jbEpPhZgsoFs9Ey2bVk0zaa8VNzTtgCWWNtPAVBIm-mQPUHV3OwU9x52NxfoHG2lTtYtGlis7-f8rdshrBkfRNh5kHvV8mpvq9lPK_3fYozrbjM0g68kE6Y0OGTMiQV3hPuPIZJTwg"
const refresh_token = "AQDJClGX6vWk1SX2hRWG4zM9wzYu275O2v1QWZU8noz9ZdU6HaBjogRdbkrOXZjK09d1mj8bSzCy9MxSwRjsJB26sQpYLjyXmUonHXrcmj1RA9xmadMnN3zx2hido4qVUrA"

async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: AUTH_CODE,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })
  });

  const data = await response.json();
  console.log("Refresh Token:", data.refresh_token);
  console.log("Access Token:", data.access_token);
}

getAccessToken();


