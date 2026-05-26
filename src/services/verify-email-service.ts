const VERIFY_API_URL = "https://shiko-email-verification-api.azurewebsites.net";

export const verifyEmailService = {
    
    async sendCode(request: { email: string }) : Promise<void> {
        const res = await fetch(`${VERIFY_API_URL}/send-code`, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(request),
        });

        if(!res.ok) {
            throw new Error("Could not send verification code.");
        }
    },

    async verifyCode(request: { email: string, code: string }) : Promise<void> {
        const res = await fetch(`${VERIFY_API_URL}/verify-code`, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(request),
        });

        if(!res.ok) {
            throw new Error("Invalid verification code.");
        }
    },

    async resendCode(request: { email: string }) : Promise<void> {
        const res = await fetch(`${VERIFY_API_URL}/resend-code`, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(request),
        });

        if(!res.ok) {
            throw new Error("Could not resend verification code.");
        }
    }
};