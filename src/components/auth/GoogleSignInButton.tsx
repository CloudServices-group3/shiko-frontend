"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}


export default function GoogleSignInButton() {
  useEffect(() => {
  const init = () => {
    if (!window.google) {
      setTimeout(init, 100); // försök igen om 100ms
      return;
    }

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (response: { credential: string }) => {
        const result = await fetch("https://localhost:7112/api/external-auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: response.credential })
        });
        console.log("API svar:", await result.json());
      }
    });

   window.google.accounts.id.renderButton(
  document.getElementById("google-btn"),
  { theme: "outline", size: "large", text: "continue_with", language: "en" }
);
  };

  init();
}, []); 

return <div id="google-btn" className="w-full flex justify-center" />;

}