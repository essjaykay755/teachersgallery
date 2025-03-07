"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FavouriteTeachersRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new location
    router.replace("/account/favourite-teachers");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Redirecting...</h1>
        <p className="text-gray-500">Please wait while we redirect you to the new page.</p>
        <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
      </div>
    </div>
  );
} 