"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CITIES, POST_TYPES } from "@/lib/constants";
import type { Post, PostType } from "@/lib/types";
import PostCard from "@/components/PostCard";
import LoadingState from "@/components/LoadingState";

const typeOptions = [
  { value: "all", label: "All types" },
  ...POST_TYPES.map((type) => ({ value: type.value, label: type.label })),
];

export default function PostsBrowser() {
  const [type, setType] = useState<"all" | PostType>("all");
  const [city, setCity] = useState<string>(CITIES[0] ?? "Peshawar");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!db) {
      return;
    }
    const constraints: QueryConstraint[] = [where("status", "==", "active")];

    if (type !== "all") {
      constraints.push(where("type", "==", type));
    }

    constraints.push(where("location", "==", city));

    constraints.push(orderBy("createdAt", "desc"));

    const postsQuery = query(collection(db, "posts"), ...constraints);
    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Post,
        );
        setPosts(data);
        setLoading(false);
        setError("");
      },
      (err) => {
        console.error("Failed to load posts:", err);
        const message =
          err instanceof Error ? err.message : "Unable to load posts right now.";
        setError(message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [type, city, db]);

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-black/10 bg-white/80 p-4 backdrop-blur">
        <div>
          <p className="text-sm font-semibold text-zinc-700">Search & Filter</p>
          <p className="text-xs text-zinc-500">Find posts by city or category.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={type}
            onChange={(event) => setType(event.target.value as "all" | PostType)}
            className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {CITIES.length > 1 ? (
            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm"
            >
              {CITIES.map((cityOption) => (
                <option key={cityOption}>{cityOption}</option>
              ))}
            </select>
          ) : (
            <div className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm text-zinc-700">
              {city}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        {loading && <LoadingState label="Loading posts" />}
        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        {!loading && !error && posts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/20 bg-white px-4 py-10 text-center text-sm text-zinc-600">
            No posts match your filters yet.
          </div>
        )}
        {!loading && posts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
