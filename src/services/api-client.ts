import {authService} from "@/services/auth-service";

export async function apiFetch(url: string, options: RequestInit = {})
{
    let token = sessionStorage.getItem("token"); // Get the access token from session storage.

    // Make the initial API request with the access token.
    let response = await fetch(url, {...options, headers: {...options.headers, Authorization: `Bearer ${token}`}});

    // Check if the access token has expired and we get a 401 Unauthorized response.
    if (response.status === 401)
    {
        try {
            // Attempt to refresh the access token.
            const newToken = await authService.refreshAccessToken();

            // Retry the original request with the new access token.
            // ...options keeps all the original options (method, body, etc.) and we just update the Authorization header with the new token.
            response = await fetch(url, {...options, headers: {...options.headers, Authorization: `Bearer ${newToken}`}});
        }
        catch
        {
            sessionStorage.clear(); // Clear all session storage data, including tokens.

            window.location.href = "/sign-in"; // Redirect to the sign-in page.

            throw new Error("Session expired. Please sign in again.");
        }
    }

    return response; // Return the final response, whether it was successful on the first try or after refreshing the token.
}