import Link from "next/link";
import AuthNotice from "@/components/AuthNotice";
import CommunityStats from "@/components/CommunityStats";
import PostsBrowser from "@/components/PostsBrowser";
import SectionHeader from "@/components/SectionHeader";
import { POST_TYPES } from "@/lib/constants";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16">
      <div className="mt-6">
        <AuthNotice />
      </div>
      <section className="relative mt-10 overflow-hidden rounded-[32px] border border-black/10 bg-white/80 p-8 shadow-sm md:mt-16 md:p-12">
        <div className="absolute -right-20 -top-24 h-60 w-60 rounded-full bg-emerald-100 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-60 w-60 rounded-full bg-rose-100 blur-3xl" />
        <div className="relative z-10 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Peshawar pet support
            </p>
            <h1 className="mt-4 font-display text-4xl text-zinc-900 md:text-5xl">
              Bring lost pets home, fast.
            </h1>
            <p className="mt-4 text-base text-zinc-600 md:text-lg">
              Post lost or found pets, share adoption listings, and connect with local services
              in Peshawar.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/post/new"
                className="rounded-full bg-emerald-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Post an Ad
              </Link>
              <Link
                href="/services"
                className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:border-black/30"
              >
                Find Services
              </Link>
            </div>
            <div className="mt-4">
              <CommunityStats />
            </div>
          </div>
          <div className="rounded-3xl border border-black/10 bg-[#f7f2ea] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
              Quick Actions
            </p>
            <div className="mt-4 grid gap-3">
              {POST_TYPES.map((type) => (
                <div
                  key={type.value}
                  className="flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3"
                >
                  <span className="text-sm font-semibold text-zinc-800">{type.label}</span>
                  <span className="text-xs text-zinc-500">Live updates</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeader title="Browse latest posts" subtitle="Discover" />
        <PostsBrowser />
      </section>

      <section className="mt-16 grid gap-6 rounded-[32px] border border-black/10 bg-white/70 p-8 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeader title="Services directory" subtitle="Support" />
          <p className="mt-4 text-sm text-zinc-600">
            Need a vet, groomer, or pet shop? Find verified services in Peshawar.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm">
            Vets and emergency clinics
          </div>
          <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm">
            Groomers with pickup options
          </div>
          <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm">
            Trusted pet shops
          </div>
          <Link
            href="/services"
            className="mt-2 inline-flex w-fit rounded-full bg-emerald-800 px-5 py-2 text-sm font-semibold text-white"
          >
            Explore services
          </Link>
        </div>
      </section>
    </div>
  );
}
