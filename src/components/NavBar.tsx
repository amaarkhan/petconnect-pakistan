"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { useAuth } from "@/app/providers";
import { auth } from "@/lib/firebase";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/post/new", label: "Post Ad" },
  { href: "/services", label: "Services" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function NavBar() {
  const { user, loading } = useAuth();
  const userInitial = (user?.displayName || user?.email || "U").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-[#f7f2ea]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-800 text-white">
            PC
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg">PetConnect</p>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Pakistan</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-700 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-black">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/post/new"
            className="hidden rounded-full bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 md:inline-flex"
          >
            Post Ad
          </Link>
          {!loading && user ? (
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-800 text-sm font-semibold text-white">
                {userInitial}
              </div>
              <button
                type="button"
                onClick={() => auth && signOut(auth)}
                className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-black/30"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-black/30"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      <div className="border-t border-black/10 px-4 py-3 text-sm text-zinc-600 md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-black">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
