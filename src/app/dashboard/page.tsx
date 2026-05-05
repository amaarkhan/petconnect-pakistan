"use client";

import Link from "next/link";
import { useAuth } from "@/app/providers";
import UserPosts from "@/components/UserPosts";
import LoadingState from "@/components/LoadingState";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <LoadingState label="Loading dashboard" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
          Please sign in to access your dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Dashboard</p>
          <h1 className="mt-3 font-display text-3xl text-zinc-900">Your posts</h1>
        </div>
        <Link
          href="/post/new"
          className="rounded-full bg-emerald-800 px-5 py-2 text-sm font-semibold text-white"
        >
          Post a new ad
        </Link>
      </div>
      <UserPosts />
    </div>
  );
}
