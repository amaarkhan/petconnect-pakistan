"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";

export default function CommunityStats() {
  const db = getFirebaseDb();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!db) {
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        setCount(snapshot.size);
      },
      () => {
        setCount(null);
      },
    );

    return () => unsubscribe();
  }, [db]);

  return (
    <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-700">
      <span className="font-semibold">Community</span>
      <span className="mx-2 text-zinc-300">•</span>
      {count === null ? "Loading members..." : `${count} members in Peshawar`}
    </div>
  );
}
