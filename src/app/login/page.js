"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
  User,
} from "lucide-react";

const BRAND = {
  navy: "#003349",
  navyDeep: "#001f2e",
  teal: "#007fad",
  tealLight: "#22aaff",
};

const TICKS = [
  { label: "Stand", major: true },
  { pos: 1 },
  { pos: 2 },
  { pos: 3 },
  { label: "Sit", major: true },
];

function ElevationMark() {
  return (
    <div className="relative flex h-[260px] w-14 flex-col items-start justify-between">
      <div className="absolute inset-y-0 left-[6px] w-0.5 bg-white/[0.18]" />

      {TICKS.map((tick, i) => (
        <div key={i} className="relative flex items-center gap-2.5">
          <div
            className={`h-0.5 ${tick.major ? "w-3.5 ml-0 bg-white" : "ml-[3px] w-2 bg-white/35"}`}
          />
          {tick.label && (
            <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-white/85">
              {tick.label}
            </span>
          )}
        </div>
      ))}

      <div className="elevation-dot absolute left-[-6px] h-[3px] w-[26px] rounded-sm bg-[#22aaff] shadow-[0_0_12px_#22aaff]" />

      <style>{`
        .elevation-dot {
          animation: riseAndSit 5.5s ease-in-out infinite;
        }
        @keyframes riseAndSit {
          0%, 8% { top: calc(100% - 1px); }
          20%, 30% { top: 0px; }
          42%, 58% { top: calc(100% - 1px); }
          70%, 92% { top: 0px; }
          100% { top: calc(100% - 1px); }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState("signin"); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [showPointsToast, setShowPointsToast] = useState(false);

  const isSignup = mode === "signup";

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setResetSent(false);
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    const freshSession = await getSession();
    router.push(freshSession?.user?.isAdmin ? "/admin" : "/");
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: email.trim(), password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email: email.trim(), password, redirect: false });
    setShowPointsToast(true);
    setTimeout(() => router.push("/"), 1800);
  }

  async function handleReset(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    await fetch("/api/auth/reset-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });

    setResetSent(true);
    setLoading(false);
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] overflow-hidden bg-[#f6f8f9]">
      {/* Sidebar – Desktop only, slides right when in signup mode */}
      <div
        className={`relative z-[2] hidden w-[42%] flex-col justify-between overflow-hidden p-10 transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] md:flex ${
          isSignup ? "translate-x-[138.1%]" : "translate-x-0"
        }`}
        style={{
          background: `linear-gradient(160deg, ${BRAND.navy} 0%, ${BRAND.navyDeep} 100%)`,
        }}
      >
        <span className="text-2xl font-extrabold tracking-tight text-white">
          vari.
        </span>

        <div className="flex items-center gap-8">
          <ElevationMark />

          <div>
            <p className="max-w-[280px] text-[1.9rem] font-extrabold leading-tight tracking-tight text-white">
              Built for the way work moves.
            </p>
            <p className="mt-3 max-w-[260px] text-sm text-white/65">
              Sign in to shop, track your orders, and manage your account.
            </p>
          </div>
        </div>

        <span className="text-xs text-white/40">Vari · Sit-Stand Desks</span>
      </div>

      {/* Main Panel - The Form, slides left when in signup mode */}
      <div
        className={`relative z-[1] flex flex-1 items-center justify-center p-6 transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isSignup ? "md:-translate-x-[72.41%]" : "md:translate-x-0"
        }`}
      >
        <div className="w-full max-w-[380px]">
          <span className="mb-8 block text-2xl font-extrabold text-[#003349] md:hidden">
            vari.
          </span>

          {error && (
            <div className="mb-5 rounded-[10px] bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {mode === "signin" && (
            <>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#003349]">
                Sign in
              </h1>
              <p className="mb-6 mt-1 text-sm text-[#6b7c84]">
                Enter your details to continue.
              </p>

              <form onSubmit={handleSignIn}>
                <label className="mb-1 block text-xs font-semibold text-[#6b7c84]">
                  Email
                </label>
                <div className="mb-4 flex items-center rounded-[10px] border border-black/10 bg-white px-3 focus-within:border-[#007fad] focus-within:border-[1.5px]">
                  <Mail size={18} className="text-[#6b7c84]" />
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="you@vari.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full bg-transparent px-2 text-sm outline-none"
                  />
                </div>

                <div className="mb-1 flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#6b7c84]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode("reset")}
                    className="text-xs font-semibold text-[#007fad] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="mb-1.5 flex items-center rounded-[10px] border border-black/10 bg-white px-3 focus-within:border-[#007fad] focus-within:border-[1.5px]">
                  <Lock size={18} className="text-[#6b7c84]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full bg-transparent px-2 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-[#6b7c84]"
                    aria-label="Show/hide password"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#003349] font-semibold text-white transition-colors hover:bg-[#001f2e] disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[#6b7c84]">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="font-bold text-[#007fad] hover:underline"
                >
                  Create an account
                </button>
              </p>
            </>
          )}

          {mode === "signup" && (
            <>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#003349]">
                Create account
              </h1>
              <p className="mb-6 mt-1 text-sm text-[#6b7c84]">
                Create your account to get started.
              </p>

              <form onSubmit={handleSignUp}>
                <label className="mb-1 block text-xs font-semibold text-[#6b7c84]">
                  Full Name
                </label>
                <div className="mb-4 flex items-center rounded-[10px] border border-black/10 bg-white px-3 focus-within:border-[#007fad] focus-within:border-[1.5px]">
                  <User size={18} className="text-[#6b7c84]" />
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 w-full bg-transparent px-2 text-sm outline-none"
                  />
                </div>

                <label className="mb-1 block text-xs font-semibold text-[#6b7c84]">
                  Email
                </label>
                <div className="mb-4 flex items-center rounded-[10px] border border-black/10 bg-white px-3 focus-within:border-[#007fad] focus-within:border-[1.5px]">
                  <Mail size={18} className="text-[#6b7c84]" />
                  <input
                    type="email"
                    required
                    placeholder="you@vari.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full bg-transparent px-2 text-sm outline-none"
                  />
                </div>

                <label className="mb-1 block text-xs font-semibold text-[#6b7c84]">
                  Password
                </label>
                <div className="mb-4 flex items-center rounded-[10px] border border-black/10 bg-white px-3 focus-within:border-[#007fad] focus-within:border-[1.5px]">
                  <Lock size={18} className="text-[#6b7c84]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full bg-transparent px-2 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-[#6b7c84]"
                    aria-label="Show/hide password"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <label className="mb-1 block text-xs font-semibold text-[#6b7c84]">
                  Confirm Password
                </label>
                <div className="mb-6 flex items-center rounded-[10px] border border-black/10 bg-white px-3 focus-within:border-[#007fad] focus-within:border-[1.5px]">
                  <Lock size={18} className="text-[#6b7c84]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 w-full bg-transparent px-2 text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#003349] font-semibold text-white transition-colors hover:bg-[#001f2e] disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[#6b7c84]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="font-bold text-[#007fad] hover:underline"
                >
                  Sign in
                </button>
              </p>
            </>
          )}

          {mode === "reset" && (
            <>
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-[#6b7c84] hover:text-[#003349]"
              >
                <ArrowLeft size={16} />
                Back to sign in
              </button>

              <h1 className="text-3xl font-extrabold tracking-tight text-[#003349]">
                Reset password
              </h1>
              <p className="mb-6 mt-1 text-sm text-[#6b7c84]">
                We&apos;ll email you a link to set a new password.
              </p>

              {resetSent ? (
                <div className="rounded-[10px] bg-[#e6f4ea] px-4 py-3 text-sm text-[#1f8a3d]">
                  If an account exists for {email}, a reset link is on its way.
                </div>
              ) : (
                <form onSubmit={handleReset}>
                  <label className="mb-1 block text-xs font-semibold text-[#6b7c84]">
                    Email
                  </label>
                  <div className="mb-6 flex items-center rounded-[10px] border border-black/10 bg-white px-3 focus-within:border-[#007fad] focus-within:border-[1.5px]">
                    <Mail size={18} className="text-[#6b7c84]" />
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="you@vari.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full bg-transparent px-2 text-sm outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#003349] font-semibold text-white transition-colors hover:bg-[#001f2e] disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 size={22} className="animate-spin" />
                    ) : (
                      "Send reset link"
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {showPointsToast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded bg-[#007fad] px-5 py-3 text-sm font-semibold text-white shadow-lg">
          🎉 Welcome! You just earned 50 points
        </div>
      )}
    </div>
  );
}