"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/app/providers";
import { getFirebaseDb } from "@/lib/firebase";
import type { Comment, Post } from "@/lib/types";
import LoadingState from "@/components/LoadingState";
import { formatDate } from "@/lib/format";

export default function PostDetailPage() {
  const { user } = useAuth();
  const params = useParams<{ id: string }>();
  const postId = params?.id;
  const db = getFirebaseDb();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!db || !postId) {
      return;
    }
    const fetchPost = async () => {
      try {
        const snapshot = await getDoc(doc(db, "posts", postId));
        if (!snapshot.exists()) {
          setError("Post not found.");
          setLoading(false);
          return;
        }
        setPost({ id: snapshot.id, ...snapshot.data() } as Post);
      } catch (err) {
        setError("Unable to load this post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, db]);

  useEffect(() => {
    if (!db || !postId) {
      return;
    }
    const commentsQuery = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(
      commentsQuery,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Comment,
        );
        setComments(data);
      },
      () => {
        setCommentError("Unable to load comments right now.");
      },
    );

    return () => unsubscribe();
  }, [postId, db]);

  const handleMarkFound = async () => {
    if (!post || !db) {
      return;
    }
    await updateDoc(doc(db, "posts", post.id), { status: "found" });
    setPost({ ...post, status: "found" });
  };

  const handleAddComment = async () => {
    if (!db || !postId) {
      return;
    }
    if (!user) {
      setCommentError("Please sign in to comment.");
      return;
    }
    const trimmed = commentText.trim();
    if (!trimmed) {
      setCommentError("Please write a comment first.");
      return;
    }
    setCommentError("");
    setCommentLoading(true);

    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        userId: user.uid,
        name: user.displayName || user.email || "Anonymous",
        body: trimmed,
        createdAt: serverTimestamp(),
      });
      setCommentText("");
    } catch (err) {
      setCommentError("Unable to add comment right now.");
    } finally {
      setCommentLoading(false);
    }
  };

  const shareLink = useMemo(() => {
    if (!post) {
      return "";
    }
    const text = `PetConnect Pakistan: ${post.title} (${post.location}). Contact: ${post.contact}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [post]);

  if (!db) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <LoadingState label="Loading post" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <LoadingState label="Loading post" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {error || "Post not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <Link href="/" className="text-sm font-semibold text-emerald-700">
        ← Back to home
      </Link>
      <div className="mt-6 grid gap-8 rounded-[32px] border border-black/10 bg-white/80 p-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {post.images?.length ? (
              post.images.map((image, index) => (
                <div key={image} className="relative h-40 w-40 overflow-hidden rounded-2xl">
                  <Image
                    src={image}
                    alt={`${post.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-black/20 px-6 py-10 text-sm text-zinc-500">
                No images uploaded.
              </div>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              {post.type} • {post.status}
            </p>
            <h1 className="mt-2 font-display text-3xl text-zinc-900">{post.title}</h1>
            <p className="mt-2 text-sm text-zinc-500">{formatDate(post.createdAt)}</p>
          </div>
          <p className="text-sm text-zinc-700">{post.description}</p>
          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-900">Comments</p>
              <span className="text-xs text-zinc-500">{comments.length}</span>
            </div>

            <div className="mt-4 space-y-4">
              {comments.length === 0 && !commentError && (
                <p className="text-sm text-zinc-500">No comments yet. Be the first.</p>
              )}
              {commentError && (
                <p className="text-sm text-rose-700">{commentError}</p>
              )}
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-2xl border border-black/10 p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-700">{comment.name}</span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-700">{comment.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <label className="text-sm text-zinc-600">
                Add a comment
                <textarea
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-black/15 px-4 py-3 text-sm"
                  placeholder="Share tips or sightings..."
                />
              </label>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  {user ? "Signed in" : "Sign in to comment"}
                </p>
                <button
                  type="button"
                  onClick={handleAddComment}
                  disabled={commentLoading}
                  className="rounded-full bg-emerald-800 px-5 py-2 text-sm font-semibold text-white"
                >
                  {commentLoading ? "Posting..." : "Post comment"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-3xl border border-black/10 bg-[#f7f2ea] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Location</p>
            <p className="mt-2 text-lg font-semibold text-zinc-900">{post.location}</p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Contact</p>
            <p className="mt-2 text-lg font-semibold text-zinc-900">{post.contact}</p>
            <a
              href={shareLink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-full bg-emerald-800 px-5 py-2 text-sm font-semibold text-white"
            >
              Share on WhatsApp
            </a>
          </div>

          {post.type === "lost" && post.status === "active" && user?.uid === post.userId && (
            <button
              type="button"
              onClick={handleMarkFound}
              className="w-full rounded-full border border-emerald-700 px-4 py-3 text-sm font-semibold text-emerald-700"
            >
              Mark as Found
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
