"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  X,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lock,
  Mail,
  User,
  Check,
  CreditCard,
  Building,
  Home,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useCurrentUser, DEMO_USERS } from "@/lib/useCurrentUser";
import { Role } from "@/lib/types";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optional: initial mode when opening */
  initialMode?: "SIGN_IN" | "SIGN_UP";
  /** Optional: pre-select a role tab when opening */
  defaultRole?: "ADMIN_OFFICER" | "LANDLORD" | "TENANT";
}

const ROLE_CONFIG = {
  ADMIN_OFFICER: {
    label: "Rent Control Officer",
    abbr: "GOV",
    color: "bg-emerald-700 text-white",
    ring: "ring-emerald-600",
    border: "border-emerald-600",
    activeBg: "bg-emerald-50",
    activeText: "text-emerald-900",
    badge: "bg-emerald-100 text-emerald-900 border-emerald-300",
    btn: "bg-emerald-800 hover:bg-emerald-900 focus:ring-emerald-600",
    hint: "Government account — Ministry of Works & Housing",
  },
  LANDLORD: {
    label: "Landlord",
    abbr: "LL",
    color: "bg-amber-600 text-white",
    ring: "ring-amber-500",
    border: "border-amber-500",
    activeBg: "bg-amber-50",
    activeText: "text-amber-900",
    badge: "bg-amber-100 text-amber-900 border-amber-300",
    btn: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    hint: "Registered property owner / housing agent",
  },
  TENANT: {
    label: "Tenant",
    abbr: "TN",
    color: "bg-blue-600 text-white",
    ring: "ring-blue-500",
    border: "border-blue-500",
    activeBg: "bg-blue-50",
    activeText: "text-blue-900",
    badge: "bg-blue-100 text-blue-900 border-blue-300",
    btn: "bg-blue-700 hover:bg-blue-800 focus:ring-blue-500",
    hint: "Looking for an Act 220 fair-rent home",
  },
} as const;

type RoleKey = keyof typeof ROLE_CONFIG;

// Preset Google accounts for realistic testing
const SAMPLE_GOOGLE_ACCOUNTS = [
  {
    name: "Kwesi Appiah",
    email: "kwesi.appiah.gh@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    card: "GHA-789201948-2",
  },
  {
    name: "Ama Serwaa Mensah",
    email: "ama.serwaa.m@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    card: "GHA-629103847-5",
  },
];

export default function SignInModal({
  isOpen,
  onClose,
  initialMode = "SIGN_IN",
  defaultRole = "TENANT",
}: SignInModalProps) {
  const { signIn, signUpWithGoogle } = useCurrentUser();

  const [mode, setMode] = useState<"SIGN_IN" | "SIGN_UP">(initialMode);
  const [selectedRole, setSelectedRole] = useState<RoleKey>(defaultRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [ghanaCardNumber, setGhanaCardNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);

  // Google OAuth Flow State
  const [googleStep, setGoogleStep] = useState<"IDLE" | "SELECT_ACCOUNT" | "CONFIRM_ROLE" | "AUTHORIZING">("IDLE");
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<(typeof SAMPLE_GOOGLE_ACCOUNTS)[0] | "CUSTOM">(
    SAMPLE_GOOGLE_ACCOUNTS[0]
  );
  const [googleCustomName, setGoogleCustomName] = useState("");
  const [googleCustomEmail, setGoogleCustomEmail] = useState("");
  const [googleRole, setGoogleRole] = useState<"TENANT" | "LANDLORD">("TENANT");
  const [googleCard, setGoogleCard] = useState("GHA-789201948-2");

  const emailRef = useRef<HTMLInputElement>(null);

  // Sync mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Pre-fill email when switching role tabs in SIGN_IN mode
  useEffect(() => {
    if (mode === "SIGN_IN") {
      const match = DEMO_USERS.find((u) => u.role === selectedRole);
      if (match) setEmail(match.email);
      setPassword("");
    } else {
      if (selectedRole === "LANDLORD") {
        setFullName("Kwadwo Owusu");
        setEmail("kwadwo.owusu@gmail.com");
        setGhanaCardNumber("GHA-829104821-3");
      } else {
        setFullName("Efua Badu");
        setEmail("efua.badu@gmail.com");
        setGhanaCardNumber("GHA-491028471-8");
      }
    }
    setError(null);
    setSuccess(false);
  }, [selectedRole, mode]);

  // Focus email on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => emailRef.current?.focus(), 80);
      setError(null);
      setSuccess(false);
      setGoogleStep("IDLE");
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (googleStep !== "IDLE") {
          setGoogleStep("IDLE");
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, googleStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    await new Promise((res) => setTimeout(res, 500));

    if (mode === "SIGN_IN") {
      const err = signIn(email, password);
      setLoading(false);

      if (err) {
        setError(err);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setPassword("");
        }, 900);
      }
    } else {
      // Direct sign-up with email
      if (selectedRole === "ADMIN_OFFICER") {
        setLoading(false);
        setError("Officer accounts cannot self-register. Please contact Rent Control Headquarters.");
        return;
      }

      signUpWithGoogle({
        fullName: fullName || (selectedRole === "LANDLORD" ? "Kwame Boakye" : "Abena Serwaa"),
        email,
        role: selectedRole,
        ghanaCardNumber: ghanaCardNumber || undefined,
      });

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 900);
    }
  };

  const startGoogleSignUp = () => {
    setError(null);
    setGoogleStep("SELECT_ACCOUNT");
  };

  const handleConfirmGoogleAuth = async () => {
    setGoogleStep("AUTHORIZING");
    await new Promise((res) => setTimeout(res, 900));

    let finalName = "";
    let finalEmail = "";
    let finalAvatar = "";
    let finalCard = googleCard;

    if (selectedGoogleAccount === "CUSTOM") {
      finalName = googleCustomName.trim() || "Google User";
      finalEmail = googleCustomEmail.trim() || "user@gmail.com";
      finalAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80";
    } else {
      finalName = selectedGoogleAccount.name;
      finalEmail = selectedGoogleAccount.email;
      finalAvatar = selectedGoogleAccount.avatar;
      finalCard = selectedGoogleAccount.card || googleCard;
    }

    signUpWithGoogle({
      fullName: finalName,
      email: finalEmail,
      role: googleRole,
      avatarUrl: finalAvatar,
      ghanaCardNumber: finalCard,
    });

    setSuccess(true);
    setTimeout(() => {
      onClose();
      setSuccess(false);
      setGoogleStep("IDLE");
    }, 900);
  };

  if (!isOpen) return null;

  const cfg = ROLE_CONFIG[selectedRole];

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-gray-950/65 backdrop-blur-sm transition-opacity" />

      {/* Modal card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top accent strip — Ghana colours */}
        <div className="h-1.5 w-full flex shrink-0">
          <div className="flex-1 bg-[#CE1126]" />
          <div className="flex-1 bg-[#FCD116]" />
          <div className="flex-1 bg-[#006B3F]" />
        </div>

        {/* Header */}
        <div className="bg-[#004D2C] px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/60 flex items-center justify-center border border-emerald-500/40">
              <Shield className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight">
                Ghana Rent Control
              </h2>
              <p className="text-emerald-300 text-xs font-medium">
                Official Property Portal · Rent Act 220
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-4">
          {/* ========================================================= */}
          {/* GOOGLE OAUTH INTERACTIVE FLOW                             */}
          {/* ========================================================= */}
          {googleStep !== "IDLE" ? (
            <div className="space-y-4">
              {/* Google Brand Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <button
                  type="button"
                  onClick={() => setGoogleStep("IDLE")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to email</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span className="text-xs font-semibold text-gray-700">Google Accounts</span>
                </div>
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-gray-900">
                  {mode === "SIGN_UP" ? "Sign up with Google" : "Continue with Google"}
                </h3>
                <p className="text-xs text-gray-500">
                  Select an account to authorize with Ghana Rent Control Portal
                </p>
              </div>

              {/* Account Selection */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Choose a Google Account
                </p>
                {SAMPLE_GOOGLE_ACCOUNTS.map((acc) => {
                  const isSelected = selectedGoogleAccount !== "CUSTOM" && selectedGoogleAccount.email === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => {
                        setSelectedGoogleAccount(acc);
                        setGoogleCard(acc.card);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                          : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900 truncate">{acc.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate">{acc.email}</div>
                        <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                          Ghana Card: {acc.card}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Custom Google account */}
                <button
                  type="button"
                  onClick={() => setSelectedGoogleAccount("CUSTOM")}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    selectedGoogleAccount === "CUSTOM"
                      ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                      : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">Use another Google account</span>
                      {selectedGoogleAccount === "CUSTOM" && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-gray-500">Enter custom name & gmail address</div>
                  </div>
                </button>

                {selectedGoogleAccount === "CUSTOM" && (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5 mt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Samuel K. Asante"
                        value={googleCustomName}
                        onChange={(e) => setGoogleCustomName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">Google Email</label>
                      <input
                        type="email"
                        placeholder="e.g. samuel.asante@gmail.com"
                        value={googleCustomEmail}
                        onChange={(e) => setGoogleCustomEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Role Selection for Google Account */}
              <div className="space-y-2 pt-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Register My Portal Account As
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGoogleRole("TENANT")}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all ${
                      googleRole === "TENANT"
                        ? "border-blue-600 bg-blue-50/60 text-blue-950 font-bold"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <Home className={`w-4 h-4 shrink-0 ${googleRole === "TENANT" ? "text-blue-600" : "text-gray-400"}`} />
                    <div>
                      <div className="text-xs font-bold leading-tight">Tenant</div>
                      <div className="text-[10px] text-gray-500 font-normal">Search & apply for homes</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGoogleRole("LANDLORD")}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all ${
                      googleRole === "LANDLORD"
                        ? "border-amber-600 bg-amber-50/60 text-amber-950 font-bold"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <Building className={`w-4 h-4 shrink-0 ${googleRole === "LANDLORD" ? "text-amber-600" : "text-gray-400"}`} />
                    <div>
                      <div className="text-xs font-bold leading-tight">Landlord</div>
                      <div className="text-[10px] text-gray-500 font-normal">List & manage properties</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Ghana Card Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ghana Card (NIA Verification)</span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                    NIA Verified
                  </span>
                </div>
                <input
                  type="text"
                  value={googleCard}
                  onChange={(e) => setGoogleCard(e.target.value)}
                  placeholder="GHA-XXXXXXXXX-X"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Google Security & Privacy note */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-500 leading-relaxed">
                By continuing, Google shares your verified name, email address, and profile photo with the{" "}
                <strong>Republic of Ghana Rent Control Department</strong> in compliance with the Data Protection Act (Act 843).
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleConfirmGoogleAuth}
                disabled={googleStep === "AUTHORIZING" || success}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-70"
              >
                {googleStep === "AUTHORIZING" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Connecting with Google OAuth 2.0…</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                    <span>Google Account Linked!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Complete Google Authorization</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* ========================================================= */
            /* STANDARD SIGN-IN / SIGN-UP FORM WITH GOOGLE BUTTON        */
            /* ========================================================= */
            <div className="space-y-4">
              {/* Mode switch tabs: Sign In vs Sign Up */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMode("SIGN_IN");
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    mode === "SIGN_IN"
                      ? "bg-white text-gray-900 shadow-2xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("SIGN_UP");
                    setError(null);
                    if (selectedRole === "ADMIN_OFFICER") setSelectedRole("TENANT");
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    mode === "SIGN_UP"
                      ? "bg-white text-gray-900 shadow-2xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* PRIMARY: SIGN UP / SIGN IN WITH GOOGLE BUTTON */}
              <div>
                <button
                  type="button"
                  onClick={startGoogleSignUp}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-800 text-xs sm:text-sm font-bold rounded-xl border border-gray-300 shadow-2xs hover:shadow-xs hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-[0.99]"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{mode === "SIGN_UP" ? "Sign up with Google" : "Continue with Google"}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded ml-auto">
                    Instant
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-2 text-gray-400 font-semibold tracking-wider">
                    Or with credentials
                  </span>
                </div>
              </div>

              {/* Role selector tabs */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {mode === "SIGN_UP" ? "Registering as" : "Sign in as"}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(ROLE_CONFIG) as RoleKey[]).map((role) => {
                    const rc = ROLE_CONFIG[role];
                    const active = selectedRole === role;
                    const isOfficer = role === "ADMIN_OFFICER";
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                          active
                            ? `${rc.border} ${rc.activeBg} ${rc.activeText}`
                            : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${rc.color}`}
                        >
                          {rc.abbr}
                        </span>
                        <span className="leading-tight text-center text-[11px]">{rc.label}</span>
                        {mode === "SIGN_UP" && isOfficer && (
                          <span className="text-[8px] bg-red-100 text-red-700 px-1 rounded font-bold">
                            Gov Only
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-gray-500 mt-2 text-center">
                  {cfg.hint}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full name (in sign-up mode) */}
                {mode === "SIGN_UP" && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Kwame Mensah Boakye"
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={emailRef}
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      placeholder="your@email.com"
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Ghana Card (in sign-up mode) */}
                {mode === "SIGN_UP" && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Ghana Card PIN (National ID)
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={ghanaCardNumber}
                        onChange={(e) => setGhanaCardNumber(e.target.value)}
                        placeholder="GHA-123456789-0"
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "SIGN_UP" ? "new-password" : "current-password"}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder={mode === "SIGN_UP" ? "Create a secure password" : "Enter your password"}
                      className="w-full pl-9 pr-11 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                )}

                {/* Success message */}
                {success && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <p className="text-xs text-emerald-700 font-semibold">
                      {mode === "SIGN_UP"
                        ? "Account created successfully! Welcome to the portal."
                        : "Signed in successfully! Welcome back."}
                    </p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading || success}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed ${cfg.btn}`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>{mode === "SIGN_UP" ? "Creating account…" : "Verifying credentials…"}</span>
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{mode === "SIGN_UP" ? "Account Created!" : "Signed In!"}</span>
                    </>
                  ) : mode === "SIGN_UP" ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Register as {cfg.label}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Portal</span>
                    </>
                  )}
                </button>

                {/* Demo hint collapsible (in sign-in mode) */}
                {mode === "SIGN_IN" && (
                  <div className="border border-gray-200 rounded-xl overflow-hidden mt-2">
                    <button
                      type="button"
                      onClick={() => setShowHints(!showHints)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold">🔑 Demo accounts (one-click autofill)</span>
                      {showHints ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    {showHints && (
                      <div className="border-t border-gray-100 divide-y divide-gray-100">
                        {DEMO_USERS.map((u) => {
                          const rc = ROLE_CONFIG[u.role as RoleKey];
                          return (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => {
                                setSelectedRole(u.role as RoleKey);
                                setEmail(u.email);
                                setPassword(u.password);
                                setError(null);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                            >
                              <span
                                className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-black shrink-0 ${rc.color}`}
                              >
                                {rc.abbr}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-semibold text-gray-800 truncate">
                                    {u.email}
                                  </span>
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ml-2 shrink-0 ${rc.badge}`}
                                  >
                                    {rc.label}
                                  </span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono">
                                  password: <span className="font-bold text-gray-600">{u.password}</span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
