import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Providers } from "@/app/providers";

const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "PetConnect Pakistan",
    template: "%s | PetConnect Pakistan",
  },
  description:
    "Report lost pets, share found pets, and connect with adoption listings across Pakistan.",
  metadataBase: new URL("https://petconnect-pakistan.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-black/10 bg-white/70">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-display text-lg text-zinc-900">PetConnect Pakistan</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    Find. Rescue. Adopt.
                  </p>
                </div>
                <p>Built for communities that care about pets.</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
