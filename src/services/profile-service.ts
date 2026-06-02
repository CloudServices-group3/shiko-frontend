export type Profile = {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    description?: string;
    profileImageUrl?: string;
}

const API_URL = "https://shiko-profile-provider.azurewebsites.net/api/profiles";

function getAuthData() {
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");

    if (!token || !user) {
        throw new Error("Missing auth data");
    }

    const userObj = JSON.parse(user);

    return {
        token,
        userId: userObj.userId,        
    };
}

async function handleResponse(response: Response) {
    if (response.status === 401) {
        sessionStorage.removeItem("token");
        window.location.replace("sign-in");

        throw new Error("Unauthorized");
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Status: ${response.status} - ${errorText}`);
    }

    return response.json();
}

export const profileService = {
    async getProfile(): Promise<Profile> {
    const { token, userId } = getAuthData();

    const response = await fetch(`${API_URL}/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (response.status === 404) {
        return {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            description: "",
            profileImageUrl: "",
        };
    }

    const data = await handleResponse(response);

    return {
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        phoneNumber: data.phoneNumber ?? "",
        description: data.description ?? "",
        profileImageUrl: data.profileImage ?? "",
    };
},

    async updateProfile(profile: Profile) {
        const { token, userId } = getAuthData();

        const response = await fetch(`${API_URL}/${userId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profile),
        });

        await handleResponse(response);
    },
};


