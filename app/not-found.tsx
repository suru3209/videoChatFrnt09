"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-gray-400">Page not found 😅</p>

      <Link className="px-6 py-2 bg-black text-white  rounded-md" href="/">
        Go Home
      </Link>
    </div>
  );
}
