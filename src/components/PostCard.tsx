import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";
import { POST_TYPES } from "@/lib/constants";

const typeStyles: Record<string, string> = {
  lost: "bg-rose-100 text-rose-800",
  found: "bg-emerald-100 text-emerald-800",
  adoption: "bg-amber-100 text-amber-800",
  sale: "bg-sky-100 text-sky-800",
};

export default function PostCard({ post }: { post: Post }) {
  const typeLabel = POST_TYPES.find((item) => item.value === post.type)?.label ?? post.type;
  const image = post.images?.[0];

  return (
    <Link
      href={`/posts/${post.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-black/20 hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
        {image ? (
          <Image
            src={image}
            alt={post.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
            No image uploaded
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
              typeStyles[post.type] ?? "bg-zinc-100 text-zinc-700"
            }`}
          >
            {typeLabel}
          </span>
          <span className="text-xs text-zinc-500">{formatDate(post.createdAt)}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 line-clamp-2">{post.title}</h3>
          <p className="mt-2 text-sm text-zinc-600 line-clamp-2">{post.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between text-sm text-zinc-600">
          <span>{post.location}</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {post.status === "found" ? "Found" : "Active"}
          </span>
        </div>
      </div>
    </Link>
  );
}
