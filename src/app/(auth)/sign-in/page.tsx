"use client";
import {useState} from "react";
import { useRouter } from "next/navigation";
import {authService} from "@/services/auth-service";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleContinue() : Promise<void> {
    try {
      setLoading(true);
      setError("");

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
      }

      //call backend to check if email exists
      const result = await authService.checkEmail(email);

      // Saving the email to session storage temporarily until the user completes the sign-in or sign-up process
      sessionStorage.setItem("email", email);

      // Redirecting the user based on wheter the email exists or not.
      switch (result.status) {
        case "NotFound":
          router.push("/almost-there");
        break;

        case "PendingVerification":
          router.push("/verification-needed");
        break;
        
        case "ReadyForLogin":
          router.push("/sign-in-password");
        break;

        default:
          setError("An unexpected error occurred. Please try again.");
        break;
      }
    } catch (err) 
    {
      console.error(err);

      if(err instanceof Error) 
        setError(err.message);
      else
      console.error(err);
      setError("Something went wrong.");

    } finally {
      setLoading(false);
    }
  }


  return (
    <section className="rounded-3xl bg-fff w-full">
      {/* Left side picture */}
      <div className="flex min-h-screen">

        <div className="hidden md:block md:w-1/2 relative h-full">
          
          <img
            src="/images/auth/shiko-logo.svg"
            alt="Shiko Logo"
            className="absolute top-10 left-10 h-16 w-16 w-[260px] h-[50px]"
          />
          <img
            src="images/auth/auth-img.svg"
            alt="A image of gears"
            className="h-full w-full object-cover rounded-4xl"
          />
        </div>

        {/* Right side form */}
        <div className="w-full md:w-1/2 flex items-center p-10">

          <div className="w-full max-w-md space-y-[104px] ml-[63px] mb-[240px]">

            {/* Title */}
            <div className="space-y-1">
              <h1 className="text-display font-medium text-p1">
                Welcome
              </h1>

              <p className="figma-b1 text-aaa font-medium tracking-wide">
                Please log in to your account to continue.
              </p>
            </div>

              <label htmlFor="email" className="text-title font-medium">
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Type your email address"
                value={email}
                onChange={(e) => {setEmail(e.target.value); setError("");}}
                className={`
                  w-[700px] rounded-xl border border-ddd p-4 outline-none mt-2 transition
                  ${ error? "border-red-500 focus:border-red-500" : "focus:border-p2"}
                  `}
              />
              {error && (
                <p className="text-sm text-red-500 mt-5">
                  {error}
                </p>
              )}

              <button
                onClick={(e) => {e.preventDefault(); handleContinue(); }}
                disabled={loading || !email}
                className="w-[700px] h-[70px] rounded-xl bg-p2 text-fff text-h2 border-2 border-transparent hover:border-black cursor-pointer transition-colors">
                  {loading ? "Loading..." : "Continue"}
              </button>

          </div>
        </div>
      </div>
    </section>
  );
}