"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import {
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  updateProfile,
  type ConfirmationResult,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import LoadingState from "@/components/LoadingState";
import { auth, db } from "@/lib/firebase";

export default function AuthPage() {
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const router = useRouter();

  const formatFirebaseError = (err: unknown) => {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case "auth/invalid-email":
          return "Please enter a valid email address.";
        case "auth/user-not-found":
        case "auth/wrong-password":
          return "Wrong email or password. Please try again.";
        case "auth/email-already-in-use":
          return "This email is already registered. Please sign in.";
        case "auth/weak-password":
          return "Password should be at least 6 characters.";
        case "auth/too-many-requests":
          return "Too many attempts. Please try again in a few minutes.";
        case "auth/network-request-failed":
          return "Network error. Check your connection and try again.";
        case "auth/invalid-phone-number":
          return "Please enter a valid phone number with country code.";
        case "auth/invalid-verification-code":
          return "Invalid code. Please try again.";
        default:
          return err.message || "Something went wrong. Please try again.";
      }
    }
    if (err instanceof Error) {
      return err.message;
    }
    return "Unknown error";
  };

  if (!auth || !db) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <LoadingState label="Loading authentication" />
      </div>
    );
  }

  const ensureUserDoc = async (userId: string, payload: Record<string, string>) => {
    const userRef = doc(db, "users", userId);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
      await setDoc(userRef, {
        id: userId,
        ...payload,
        createdAt: serverTimestamp(),
      });
    }
  };

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(result.user, { displayName: name });
        }
        await ensureUserDoc(result.user.uid, {
          name: name || result.user.displayName || "",
          email: result.user.email || "",
          phone: result.user.phoneNumber || "",
        });
        router.push("/?auth=signup");
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await ensureUserDoc(result.user.uid, {
          name: result.user.displayName || "",
          email: result.user.email || "",
          phone: result.user.phoneNumber || "",
        });
        router.push("/?auth=login");
      }
    } catch (err) {
      setError(formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.clear();
    }
    recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    return recaptchaRef.current;
  };

  const handleSendCode = async () => {
    setError("");
    setLoading(true);
    try {
      const verifier = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmation(result);
    } catch (err) {
      setError(formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmation) {
      setError("Please request a verification code first.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const result = await confirmation.confirm(code);
      await ensureUserDoc(result.user.uid, {
        name: result.user.displayName || "",
        email: result.user.email || "",
        phone: result.user.phoneNumber || "",
      });
      router.push("/?auth=login");
    } catch (err) {
      setError(formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <Link href="/" className="text-sm font-semibold text-emerald-700">
        ← Back to home
      </Link>
      <div className="mt-6 grid gap-8 rounded-[32px] border border-black/10 bg-white/80 p-8 md:grid-cols-[0.8fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Welcome
          </p>
          <h1 className="mt-3 font-display text-3xl text-zinc-900">Sign in to manage your posts</h1>
          <p className="mt-3 text-sm text-zinc-600">
            Save listings, follow updates, and manage your dashboard.
          </p>
        </div>
        <div>
          <div className="flex gap-2 rounded-full border border-black/10 bg-white p-1 text-sm">
            <button
              type="button"
              onClick={() => setTab("email")}
              className={`flex-1 rounded-full px-3 py-2 font-semibold ${
                tab === "email" ? "bg-emerald-800 text-white" : "text-zinc-600"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setTab("phone")}
              className={`flex-1 rounded-full px-3 py-2 font-semibold ${
                tab === "phone" ? "bg-emerald-800 text-white" : "text-zinc-600"
              }`}
            >
              Phone
            </button>
          </div>

          {tab === "email" && (
            <form onSubmit={handleEmailSubmit} className="mt-6 grid gap-4">
              <div className="flex gap-2 rounded-full border border-black/10 bg-white p-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                  }}
                  className={`flex-1 rounded-full px-3 py-2 font-semibold ${
                    mode === "login" ? "bg-zinc-900 text-white" : "text-zinc-600"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                  }}
                  className={`flex-1 rounded-full px-3 py-2 font-semibold ${
                    mode === "signup" ? "bg-zinc-900 text-white" : "text-zinc-600"
                  }`}
                >
                  Sign up
                </button>
              </div>

              {mode === "signup" && (
                <label className="text-sm text-zinc-600">
                  Name
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className="mt-2 w-full rounded-2xl border border-black/15 px-4 py-3"
                  />
                </label>
              )}

              <label className="text-sm text-zinc-600">
                Email
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="mt-2 w-full rounded-2xl border border-black/15 px-4 py-3"
                />
              </label>

              <label className="text-sm text-zinc-600">
                Password
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  required
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-2xl border border-black/15 px-4 py-3"
                />
              </label>

              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-emerald-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                {loading ? "Working..." : mode === "signup" ? "Create account" : "Login"}
              </button>
            </form>
          )}

          {tab === "phone" && (
            <div className="mt-6 grid gap-4">
              <label className="text-sm text-zinc-600">
                Phone number (include country code)
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+92 300 1234567"
                  className="mt-2 w-full rounded-2xl border border-black/15 px-4 py-3"
                />
              </label>
              <button
                type="button"
                disabled={loading}
                onClick={handleSendCode}
                className="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold text-zinc-700"
              >
                {loading ? "Sending..." : "Send code"}
              </button>

              <label className="text-sm text-zinc-600">
                Verification code
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="123456"
                  className="mt-2 w-full rounded-2xl border border-black/15 px-4 py-3"
                />
              </label>
              <button
                type="button"
                disabled={loading}
                onClick={handleVerifyCode}
                className="rounded-full bg-emerald-800 px-6 py-3 text-sm font-semibold text-white shadow-sm"
              >
                {loading ? "Verifying..." : "Verify & sign in"}
              </button>
              <div id="recaptcha-container" />
            </div>
          )}

          {loading && (
            <div className="mt-4">
              <LoadingState label="Please wait" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
