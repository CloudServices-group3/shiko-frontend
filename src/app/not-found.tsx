import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <div>
        <Image
        src="/images/404/404-error.svg"
        alt="404 Error Image"
        width={530}
        height={430}
         />

         <h1>
          Page Not Found!
         </h1>

         <p>
          Sorry, the page you are looking for doesn't exist or has been removed.
          <br />
          Keep exploring our site.
         </p>
         <Link href="#">
         Back to Dashboard
         <span>
          ↗
         </span>
         </Link>
      </div>
    </main>
  );
}