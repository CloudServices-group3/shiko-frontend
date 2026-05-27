"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, saveAuth } from "@/services/auth-service";

export default function SignInPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get email from session storage.
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");

    if (!storedEmail) {
      router.push("/sign-in");
      return;
    }

    setEmail(storedEmail);
  }, [router]);

  async function handleSubmit(): Promise<void> {
  try {
    setLoading(true);
    setError("");
    
    if (!password) {
      setError("Please enter your password.");
      setLoading(false);
      return;
    }

    const result = await authService.login(email, password);

    // Save auth tokens.
    saveAuth(result);

    // Remove user email from session storage.
    sessionStorage.removeItem("email");

    router.push("/dashboard");

    }catch (err) {
    console.error(err);
    setError("Invalid password.")
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl bg-fff w-full">
      <div className="flex min-h-screen">

        {/* Left side picture */}
        <div className="hidden md:block md:w-1/2 relative h-full">
          <img
            src="/images/auth/shiko-logo.svg"
            alt="Shiko Logo"
            className="absolute top-10 left-10 w-[260px] h-[50px]"/>

          <img
            src="/images/auth/auth-img.svg"
            alt="A image of gears"
            className="h-full w-full object-cover rounded-4xl"/>
        </div>

        {/* Right side form */}
        <div className="w-full md:w-1/2 flex items-center p-10">
          <div className="w-full max-w-md space-y-[40px] ml-[63px] mb-[240px]">


            {/* Title */}
            <div className="space-y-1">

            <h1 className="text-display font-medium text-p1 w-[700px]">
              Enter Password
            </h1>

            <p className="figma-b1 text-aaa font-medium tracking-wide w-[700px]">
              Please enter your password to log in to your account.
            </p>
          </div>

          {/* Email (readonly) */}
          <div>

            <label htmlFor="email" className="text-title font-medium">
              Email address
            </label>

            <input 
              value={email}
              disabled
              className="w-[700px] rounded-xl border border-ddd p-4 mt-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="text-title font-medium">
              Password
            </label>
          
            <input
              id="password"
              type="password"
              placeholder="Type your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError("");}}
              className={`w-[700px] rounded-xl border border-ddd p-4 mt-2 outline-none transition ${error ? "border-red-500" : ""}`}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !password}
            className="w-[700px] h-[70px] rounded-xl bg-p2 text-fff text-h2 border-2 border-transparent hover:border-black cursor-pointer transition-colors"
          >
            {loading ? "Loading..." : "Log In"}
          </button>

          </div>
        </div>
      </div>
    </section>
  );
}