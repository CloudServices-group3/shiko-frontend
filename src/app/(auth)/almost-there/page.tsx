"use client";

import { useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";

export default function AlmostThere() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load the email from session storage.
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");

    if (!storedEmail) {
      router.push("/sign-in");
      return;
    }

    setEmail(storedEmail);
  }, [router]);

  async function handleSubmit(): Promise<void> {

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    try {
      setLoading(true);
      setError("");

      const userId = await authService.register(email, password);

      // Redirect the user to dashboard.
      router.push("/verification-needed");
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
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
            src="images/auth/shiko-logo.svg"
            alt="Shiko Logo"
            className="absolute top-10 left-10 w-[260px] h-[50px]"
          />

          <img
            src="images/auth/auth-img.svg"
            alt="An image of gears"
            className="h-full w-full object-cover rounded-4xl"
          /> 
        </div>

        {/* Right side form */}
        <div className="w-full md:w-1/2 flex items-center p-10">
          

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="w-full max-w-md space-y-[40px] ml-[63px]">

            {/* Title */}
            <h1 className="text-display font-medium text-p1">
              Almost there
            </h1>

            <p className="w-[700px] figma-b1 text-aaa font-medium tracking-wide">
              Before you can sign in you need to verify your profile information and set a strong password. For security reasons, your password must be at least 8 characters long and include uppercase and lowercase letters, numbers, and special characters 
            </p>

            {/* Email */}

            <label htmlFor="email" className="text-title font-medium">
              Email address
            </label>

            <input id="email" type="email" disabled value={email} className="w-[700px] rounded-xl border border-ddd p-4 outline-none mt-2 bg-gray-100 cursor-not-allowed"/>

            {/* Password*/}
            <div>
              <label htmlFor="password" className="text-title font-medium">
                Password
              </label>

              <input id="password" type="password" placeholder="Type your password" value={password} onChange={(e) => {setPassword(e.target.value); setError("");}} className={`w-[700px] rounded-xl border border-ddd p-4 outline-none mt-2 transition ${error? "border-red-500 focus:border-red-500" : "focus:border-p2"}`}/>
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className="text-title font-medium">
                Confirm Password
              </label>

              <input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value); setError("");}} className={`w-[700px] rounded-xl border border-ddd p-4 outline-none mt-2 transition ${error? "border-red-500 focus:border-red-500" : "focus:border-p2"}`}/>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-red-500 mt-5">
                {error}
              </p>
            )}

            {/* button */}
            <button type="submit" disabled={loading || !password || !confirmPassword || password !== confirmPassword} className="w-[700px] h-[70px] rounded-xl bg-p2 text-fff text-h2 border-2 border-transparent hover:border-black cursor-pointer transition-colors">
              {loading ? "Loading..." : "Complete"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
