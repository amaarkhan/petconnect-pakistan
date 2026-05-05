"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const AUTH_MESSAGES: Record<string, { title: string; body: string; tone: "success" | "info" }> = {
  signup: {
    title: "Registered successfully",
    body: "Welcome aboard. You can now publish posts and comment.",
    tone: "success",
  },
  login: {
    title: "Signed in",
    body: "You are now logged in. Create a post or comment on listings.",
    tone: "success",
  },
};

export default function AuthNotice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = searchParams.get("auth");
  const message = useMemo(() => (auth ? AUTH_MESSAGES[auth] : null), [auth]);

  useEffect(() => {
    if (!auth) {
      return;
    }
    const timer = setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete("auth");
      const query = nextParams.toString();
      router.replace(query ? `/?${query}` : "/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [auth, router, searchParams]);

  if (!message) {
    return null;
  }

  const toneClass =
    message.tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-sky-200 bg-sky-50 text-sky-700";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClass}`}>
      <p className="font-semibold">{message.title}</p>
      <p className="mt-1 text-sm">{message.body}</p>
    </div>
  );
}
