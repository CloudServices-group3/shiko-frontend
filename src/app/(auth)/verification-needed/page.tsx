"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyEmailService } from "@/services/verify-email-service";

export default function VerificationNeeded() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState(Array(6).fill("")); // State to hold each digit of the verification code
    const [secondsLeft, setSecondsLeft] = useState(15); // Timer for resending code

    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Countdown timer
    useEffect(() => {

        if (secondsLeft <= 0)
            return;

        const timer = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);

    }, [secondsLeft]);

    // Send code automatically when page loads
    useEffect(() => {

        const storedEmail = sessionStorage.getItem("email");

        if (!storedEmail) {
            router.push("/sign-in");
            return;
        }

        setEmail(storedEmail);

        async function sendCode() {

            try {

                setSending(true);

                await verifyEmailService.sendCode({
                    email: storedEmail!
                });

                setSuccess(
                    "A verification code has been sent to your email."
                );

            } catch (err) {

                console.error(err);

            } finally {

                setSending(false);
            }
        }

        sendCode();

    }, [router]);

    async function handleVerify(): Promise<void> {

        try {

            setLoading(true);
            setError("");

            const verificationCode = code.join("");

            await verifyEmailService.verifyCode({
                email,
                code: verificationCode
            });

            router.push("/sign-in-password");

        } catch (err) {

            console.error(err);
            setError("Invalid verification code.");

        } finally {

            setLoading(false);
        }
    }

    async function handleResend(): Promise<void> {

        try {

            setSending(true);
            setError("");
            setSuccess("");

            await verifyEmailService.resendCode({
                email
            });

            setSecondsLeft(15);

            setSuccess(
                "A new verification code has been sent."
            );

        } catch (err) {

            console.error(err);
            setError(
                "Could not resend verification code."
            );

        } finally {

            setSending(false);
        }
    }

    return (

        <section className="rounded-3xl bg-fff w-full">

            <div className="flex min-h-screen">

                {/* Left side */}
                <div className="hidden md:block md:w-1/2 relative h-full">

                    <img
                        src="/images/auth/shiko-logo.svg"
                        alt="Shiko Logo"
                        className="absolute top-10 left-10 w-[260px] h-[50px]"
                    />

                    <img
                        src="/images/auth/auth-img.svg"
                        alt="A image of gears"
                        className="h-full w-full object-cover rounded-4xl"
                    />

                </div>

                {/* Right side */}
                <div className="w-full md:w-1/2 flex items-center p-10">

                    <div className="w-full max-w-md space-y-[50px] ml-[63px]">

                        {/* Header */}
                        <div>

                            <h1 className="text-display font-medium text-p1 w-[700px]">
                                Verification Needed
                            </h1>

                            <p className="figma-b1 text-aaa font-medium tracking-wide w-[700px] mt-2">

                                Please verify your account with the verification code that has been sent to your specified email address.

                            </p>

                            <p className="text-title font-medium text-p1 mt-3">
                                {email}
                            </p>

                        </div>

                        {/* Verification section */}
                        <div className="space-y-5">

                            <p className="text-title font-medium">
                                Enter verification code
                            </p>

                            {/* 6 code boxes */}
                            <div className="flex gap-4">

                                {code.map((digit, index) => (

                                    <input
                                        key={index}
                                        id={`code-${index}`} // For focusing the next input
                                        type="text" 
                                        maxLength={1} // Only allow one digit per box
                                        value={digit} 
                                        onChange={(e) => {

                                            const value =
                                                e.target.value.replace(/\D/g, ""); // Accept only digits.

                                            const updated = [...code]; // Create a copy of the code array.
                                            updated[index] = value; // Update the specific index with the new value.

                                            setCode(updated); // Update the state with the new code array.

                                            if (value && index < 5) { // If a digit was entered and it's not the last box, focus the next input.

                                                const next =
                                                    document.getElementById( 
                                                        `code-${index + 1}` // Get the next input by its ID.
                                                    );

                                                (
                                                    next as HTMLInputElement // Type assertion to HTMLInputElement to access the focus method.
                                                )?.focus();
                                            }

                                        }}

                                        className="
                                            w-[90px]
                                            h-[90px]
                                            rounded-xl
                                            border
                                            border-ddd
                                            text-center
                                            text-2xl
                                            outline-none
                                            focus:border-p2
                                        "
                                    />

                                ))}

                            </div>

                            {/* Timer + resend */}
                            <div className="flex justify-between w-[700px]">

                                <p className="text-sm text-aaa">

                                    {secondsLeft > 0
                                        ? `New code can be sent in ${secondsLeft}s`
                                        : "You can request a new code"}

                                </p>

                                <button
                                    onClick={handleResend} // Resend code handler
                                    disabled={sending || secondsLeft > 0} // Disable while sending or if timer is not finished
                                    className={`
                                        text-sm
                                        underline
                                        ${secondsLeft > 0
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-p2 hover:text-black"}
                                    `}
                                >

                                    Resend verification code

                                </button>

                            </div>

                            {/* Messages */}
                            <div className="h-[20px]">

                                {error && (
                                    <p className="text-sm text-red-500">
                                        {error}
                                    </p>
                                )}

                                {success && (
                                    <p className="text-sm text-green-600">
                                        {success}
                                    </p>
                                )}

                            </div>

                            {/* Continue button */}
                            <button
                                onClick={handleVerify}
                                disabled={
                                    loading ||
                                    code.join("").length !== 6 // If code is not 6 digits, disable the button
                                }
                                className="
                                    w-[700px]
                                    h-[70px]
                                    rounded-xl
                                    bg-p2
                                    text-fff
                                    text-h2
                                    border-2
                                    border-transparent
                                    hover:border-black
                                    cursor-pointer
                                    transition-colors
                                "
                            >

                                {loading
                                    ? "Loading..."
                                    : "Continue"}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );
}