"use client";
import { useEffect } from "react";
import { saveAuth } from "@/services/auth-service";

// Extends the global Window interface to include the Google Identity Services object,
// which is injected at runtime by the Google GSI script.
declare global {
  interface Window {
    google: any;
  }
}


export default function GoogleSignInButton() {
  useEffect(() => {
    const init = () => {
      if (!window.google) {
        setTimeout(init, 100); // If google is not loaded, try again
        return;
      }

      // initialize google login, using client-id added to an environment variable
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: { credential: string }) => {
          const result = await fetch("https://shiko-externalauth-cje2hud5d8akbkhs.swedencentral-01.azurewebsites.net/api/external-auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: response.credential })
          });
          if (result.ok) {
            // get LoginResult 
            const data = await result.json();

            // use built in method from auth
            // save token, refreshToken and user in sessionStorage.
            saveAuth(data);

            console.log("Auth data saved via saveAuth! Redirecting...");

            // redirect
            window.location.href = "/dashboard";

          } else {
            console.error("Something went wrong:", result.status);
          }
        }

      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-btn"),
        {
          type: "icon",
          theme: "filled_blue",
          size: "large",
          shape: "circle"
        }
      );

    };

    init();
  }, []);

  return <div id="google-btn" className="w-full flex justify-center" />;

}