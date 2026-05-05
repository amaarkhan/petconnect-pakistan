"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuth } from "@/app/providers";
import { db, storage } from "@/lib/firebase";
import { CITIES, POST_TYPES } from "@/lib/constants";
import type { Post, PostType } from "@/lib/types";
import LoadingState from "@/components/LoadingState";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [type, setType] = useState<PostType>("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);

  useEffect(() => {
    if (!db) {
      return;
    }
    const fetchPost = async () => {
      try {
        const snapshot = await getDoc(doc(db, "posts", params.id));
        if (!snapshot.exists()) {
          setError("Post not found.");
          setLoadingPost(false);
          return;
        }
        const data = { id: snapshot.id, ...snapshot.data() } as Post;
        setPost(data);
        setType(data.type);
        setTitle(data.title);
        setDescription(data.description);
        setLocation(data.location);
        setContact(data.contact);
      } catch (err) {
        setError("Unable to load this post.");
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPost();
  }, [params.id, db]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !post || !db || !storage) {
      setError("You cannot edit this post.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const uploadedUrls = [...(post.images || [])];
      for (const file of files) {
        const storageRef = ref(
          storage,
          `posts/${user.uid}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`,
        );
        await uploadBytes(storageRef, file);
        uploadedUrls.push(await getDownloadURL(storageRef));
      }

      await updateDoc(doc(db, "posts", post.id), {
        type,
        title,
        description,
        location,
        contact,
        images: uploadedUrls,
        updatedAt: serverTimestamp(),
      });

      router.push(`/posts/${post.id}`);
    } catch (err) {
      setError("Unable to update this post.");
    } finally {
      setSaving(false);
    }
  };

  if (!db || !storage) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <LoadingState label="Loading tools" />
      </div>
    );
  }

  if (loading || loadingPost) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <LoadingState label="Loading post" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
          Please sign in to edit posts.
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error || "Post not found."}
        </div>
      </div>
    );
  }

  if (post.userId !== user.uid) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          You can only edit your own posts.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <Link href="/dashboard" className="text-sm font-semibold text-emerald-700">
        ← Back to dashboard
      </Link>
      <h1 className="mt-4 font-display text-3xl text-zinc-900">Edit post</h1>

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
              required
              className="mt-2 w-full rounded-2xl border border-black/15 px-4 py-3"
            />
          </label>
        </div>

        <label className="text-sm text-zinc-600">
          Add more images
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            className="mt-2 w-full rounded-2xl border border-dashed border-black/20 bg-white px-4 py-3"
          />
        </label>

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
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
