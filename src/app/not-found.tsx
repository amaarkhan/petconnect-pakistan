import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl text-zinc-900">Page not found</h1>
      <p className="mt-3 text-sm text-zinc-600">We could not find what you were looking for.</p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-emerald-800 px-5 py-2 text-sm font-semibold text-white"
      >
        Back to home
      </Link>
    </div>
  );
}
