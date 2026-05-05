"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/app/providers";
import { getFirebaseDb } from "@/lib/firebase";
import { CITIES, POST_TYPES } from "@/lib/constants";
import type { PostType } from "@/lib/types";

export default function CreatePostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [db, setDb] = useState<ReturnType<typeof getFirebaseDb>>(null);
  const [type, setType] = useState<PostType>("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<string>(CITIES[0] ?? "Peshawar");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDb(getFirebaseDb());
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !db) {
      setError("Please sign in before creating a post.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        userId: user.uid,
        type,
        title,
        description,
        location,
        contact,
        images: [],
        status: "active",
        createdAt: serverTimestamp(),
      });

      router.push(`/posts/${docRef.id}`);
    } catch (err) {
      setError("Unable to publish your post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!db) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <p className="text-sm text-zinc-600">Loading tools...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <p className="text-sm text-zinc-600">Checking your account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
          You must sign in before creating a post.
          <div className="mt-3">
            <Link href="/auth" className="font-semibold text-amber-800">
              Go to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <Link href="/" className="text-sm font-semibold text-emerald-700">
        ← Back to home
      </Link>
      <h1 className="mt-4 font-display text-3xl text-zinc-900">Create a post</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Share details clearly to help people respond quickly.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 rounded-[32px] border border-black/10 bg-white/80 p-8">
        <label className="text-sm text-zinc-600">
          Post type
          <select
            value={type}
            onChange={(event) => setType(event.target.value as PostType)}
            className="mt-2 w-full rounded-2xl border border-black/15 px-4 py-3"
          >
            {POST_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-zinc-600">
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Golden retriever missing in DHA"
            required
            className="mt-2 w-full rounded-2xl border border-black/15 px-4 py-3"
          />
        </label>

        <label className="text-sm text-zinc-600">
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            required
            className="mt-2 w-full rounded-2xl border border-black/15 px-4 py-3"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-zinc-600">
            City
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-black/15 px-4 py-3"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-zinc-600">
            Contact number
            <input
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="+92 300 1234567"
              required
              className="mt-2 w-full rounded-2xl border border-black/15 px-4 py-3"
            />
          </label>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-emerald-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          {saving ? "Publishing..." : "Publish post"}
        </button>
      </form>
    </div>
  );
}
