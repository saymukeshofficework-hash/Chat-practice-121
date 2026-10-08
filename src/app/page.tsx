"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    window.location.replace("/login.html");
  }, []);

  return (
    <main className="min-h-screen grid place-items-center bg-white text-ink-700">
      <p>लॉगिन पेज खोला जा रहा है…</p>
    </main>
  );
}
