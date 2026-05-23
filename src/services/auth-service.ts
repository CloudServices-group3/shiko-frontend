const API_URL = "https://shiko-auth-api-2.azurewebsites.net/api";

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

export type CheckEmailResult = {
    status: "NotFound" | "ReadyForLogin";
}

export function saveAuth(result: LoginResponse) {
  sessionStorage.setItem("token", result.accessToken.accessToken);
  sessionStorage.setItem("refreshToken", result.refreshToken);
  sessionStorage.setItem("user", JSON.stringify(result.userInfo));
}

export const authService = {
    async checkEmail(email: string ) : Promise<CheckEmailResult> {
        const res = await fetch(`${API_URL}/auth/check-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if(!res.ok) throw new Error("check email failed");

        const data: CheckEmailResult = await res.json();
        return data;
    },

    async login(email: string, password: string): Promise<LoginResponse> {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if(!res.ok) throw new Error("login failed");

        const data: LoginResponse = await res.json();
        return data;
    },

    async register(email: string, password: string): Promise<LoginResponse> {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("register failed");

        const data: LoginResponse = await res.json();
        return data;
    }
};