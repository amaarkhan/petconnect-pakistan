"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { useAuth } from "@/app/providers";
import type { Post } from "@/lib/types";
import LoadingState from "@/components/LoadingState";
import { formatDate } from "@/lib/format";

export default function UserPosts() {
  const { user } = useAuth();
  const [db, setDb] = useState<ReturnType<typeof getFirebaseDb>>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDb(getFirebaseDb());
  }, []);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    if (!user) {
      setLoading(false);
      return;
    }

    const postsQuery = query(
      collection(db, "posts"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Post,
      );
      setPosts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, db]);

  if (!user) {
    return null;
  }

  const handleDelete = (postId: string) => {
    if (!db) {
      return;
    }
    void deleteDoc(doc(db, "posts", postId));
  };

  return (
    <section className="mt-6">
      {loading && <LoadingState label="Loading your posts" />}
      {!loading && posts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/20 bg-white px-4 py-10 text-center text-sm text-zinc-600">
          You have not posted yet. Create your first listing to get started.
        </div>
      )}
      {!loading && posts.length > 0 && (
        <div className="grid gap-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  {post.type} • {post.status}
                </p>
                <h3 className="text-lg font-semibold text-zinc-900">{post.title}</h3>
                <p className="text-sm text-zinc-500">
                  {post.location} • {formatDate(post.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/posts/${post.id}`}
                  className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-black/30"
                >
                  View
                </Link>
                <Link
                  href={`/post/edit/${post.id}`}
                  className="rounded-full bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
