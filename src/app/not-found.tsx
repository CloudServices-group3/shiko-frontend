import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-p1 px-6">
      <div className="flex flex-col items-center text-center">
        <Image
        src="/images/404/404-error.svg"
        alt="404 Error Image"
        width={530}
        height={430}
        priority
         />

         <h1 className="mt-16 text-5xl font-semibold text-fff">
          Page Not Found!
         </h1>

         <p className="mt-4 figma-b1 text-[#7C8595]">
          Sorry, the page you are looking for doesn't exist or has been removed.
          <br />
          Keep exploring our site.
         </p>

         <Link href="#" className="mt-10 inline-flex items-center gap-2 rounded-xl bg-p2 px-8 py-4 font-semibold text-fff transition hover:opacity-90">
         Back to Dashboard
         <span className="text-lg">
          ↗
         </span>
         </Link>
      </div>
    </main>
  );
}