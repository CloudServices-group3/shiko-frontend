const API_URL = "https://shiko-auth-api-2.azurewebsites.net/api";

// The structure of the response returned by the login and refresh endpoints, containing access token, refresh token, and user information.
export type LoginResponse = {
    accessToken: {
        accessToken: string;
        tokenType: string;
        expires: number;
        expiresAtUtc: string;
    };
    
    refreshToken: string;

    userInfo: {
        userId: string;
        email: string;
        roles: string[];
    };
    
};

export type RefreshResponse = {
    accessToken: string;
    tokenType: string;
    expires: number;
    expiresAtUtc: string;
    refreshToken: string;
    userInfo: {
        userId: string;
        email: string;
        roles: string[];
    };
}

// The structure of the response returned by the register endpoint, containing a message indicating the result of the registration attempt.
export type RegisterResponse = {
    message: string;
};

// The possible results of checking an email's registration status, indicating whether the email is not found, ready for login, or pending verification.
export type CheckEmailResult = {
    status: "NotFound" | "ReadyForLogin" | "PendingVerification";
}

// A helper function to save authentication data (access token, refresh token, and user information) to session storage after a successful login or token refresh.
export function saveAuth(result: LoginResponse | RefreshResponse) {
  const token = typeof result.accessToken === "string" ? result.accessToken : result.accessToken.accessToken;

  sessionStorage.setItem("token", token);
  sessionStorage.setItem("refreshToken", result.refreshToken);
  sessionStorage.setItem("user", JSON.stringify(result.userInfo));
}

// The authService object provides methods for checking email registration status, logging in, registering, and refreshing access tokens.
export const authService = { 

    async checkEmail(email: string ) : Promise<CheckEmailResult> {
        const res = await fetch(`${API_URL}/auth/check-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
        const errorText = await res.text();

        console.log("Status:", res.status);
        console.log("Response:", errorText);

        throw new Error(
            `Check email failed (${res.status}): ${errorText}`
        );
    }

    return await res.json();
    },

    async login(email: string, password: string): Promise<LoginResponse> {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if(!res.ok) 
        {
            const error = await res.text(); throw new Error(error);
        }

        const data: LoginResponse = await res.json();

        return data;
    },

    async register(email: string, password: string): Promise<RegisterResponse> {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("register failed");

        const data: RegisterResponse = await res.json();

        return data;
    },

    async refreshAccessToken(): Promise<string> { // Returns the newly generated access token as a string.
        const refreshToken = sessionStorage.getItem("refreshToken");

        if (!refreshToken) {
            throw new Error("No refresh token");
        }

        const res = await fetch(`${API_URL}/auth/refresh`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({refreshToken}) // Send the refresh token in the request body as JSON.
            }
        );
        
        if (!res.ok) {
            throw new Error("Failed to refresh access token");
        }

        // Refresh endpoint returns the same structure as LoginResponse, allowing us to reuse the response and update stored authentication data.
        const data: RefreshResponse = await res.json(); 
        saveAuth(data);

        return  data.accessToken; // Return the new access token string to be used in retrying the original API request.
    }
}