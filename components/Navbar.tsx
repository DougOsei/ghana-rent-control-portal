"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Shield,
  FileCheck2,
  Calculator,
  ChevronDown,
  Menu,
  X,
  Scale,
  Search,
  PlusCircle,
  ClipboardList,
  LogIn,
  LogOut,
  UserCircle,
  RefreshCw,
  Home,
} from "lucide-react";
import { Role } from "@/lib/types";
import { useCurrentUser } from "@/lib/useCurrentUser";
import SignInModal from "./SignInModal";

interface NavLinkItem {
  href: string;
  label: string;
  icon: any;
  allowedRoles: Role[];
  badge?: string;
  badgeStyle?: string;
}

const ROLE_COLOR: Record<Role, string> = {
  ADMIN_OFFICER: "bg-emerald-700 text-white",
  LANDLORD: "bg-amber-600 text-white",
  TENANT: "bg-blue-600 text-white",
};

const ROLE_BADGE: Record<Role, string> = {
  ADMIN_OFFICER: "bg-emerald-100 text-emerald-900",
  LANDLORD: "bg-amber-100 text-amber-900",
  TENANT: "bg-blue-100 text-blue-900",
};

const ROLE_ABBR: Record<Role, string> = {
  ADMIN_OFFICER: "GOV",
  LANDLORD: "LL",
  TENANT: "TN",
};

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInMode, setSignInMode] = useState<"SIGN_IN" | "SIGN_UP">("SIGN_IN");
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { currentUser, isSignedIn, hydrated, signOut, switchUser, demoUsers } =
    useCurrentUser();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
        setSwitcherOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // All possible navigation items with permission rules
  const allNavLinks: NavLinkItem[] = [
    {
      href: "/admin",
      label: "Inspection Console",
      icon: Shield,
      allowedRoles: ["ADMIN_OFFICER"],
      badge: "Officer HQ",
      badgeStyle: "bg-emerald-100 text-emerald-900 border-emerald-300",
    },
    {
      href: "/landlord",
      label: "My Properties & Leases",
      icon: FileCheck2,
      allowedRoles: ["LANDLORD"],
      badge: "Landlord",
      badgeStyle: "bg-amber-100 text-amber-900 border-amber-300",
    },
    {
      href: "/tenant",
      label: "My Tenancy Dashboard",
      icon: Home,
      allowedRoles: ["TENANT"],
      badge: "Tenant",
      badgeStyle: "bg-blue-100 text-blue-900 border-blue-300",
    },
    {
      href: "/properties",
      label:
        currentUser?.role === "TENANT"
          ? "Find Fair-Rent Homes"
          : currentUser?.role === "LANDLORD"
          ? "Market Listings"
          : "Property Registry",
      icon: Building2,
      allowedRoles: ["TENANT", "LANDLORD", "ADMIN_OFFICER"],
      badge: currentUser?.role === "TENANT" ? "Act 220" : undefined,
      badgeStyle: "bg-blue-100 text-blue-900 border-blue-200",
    },
    {
      href: "/calculator",
      label:
        currentUser?.role === "TENANT"
          ? "Check My Rent Price"
          : currentUser?.role === "ADMIN_OFFICER"
          ? "Valuation Engine"
          : "Price Cap Estimator",
      icon: Calculator,
      allowedRoles: ["TENANT", "LANDLORD", "ADMIN_OFFICER"],
    },
    {
      href: "/disputes",
      label:
        currentUser?.role === "ADMIN_OFFICER"
          ? "Tribunal & Cases"
          : currentUser?.role === "TENANT"
          ? "Report Violation"
          : "Disputes & Complaints",
      icon: Scale,
      allowedRoles: ["TENANT", "LANDLORD", "ADMIN_OFFICER"],
    },
  ];

  const visibleNavLinks = isSignedIn && currentUser
    ? allNavLinks.filter((link) =>
        link.allowedRoles.includes(currentUser.role)
      )
    : [];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        {/* Government ribbon */}
        <div className="bg-[#004D2C] text-white text-xs px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex h-2.5 w-6 rounded-xs overflow-hidden border border-white/20">
                <span className="bg-[#CE1126] w-2 h-full" />
                <span className="bg-[#FCD116] w-2 h-full" />
                <span className="bg-[#006B3F] w-2 h-full" />
              </span>
              <span className="font-semibold tracking-wide">
                REPUBLIC OF GHANA • MINISTRY OF WORKS AND HOUSING
              </span>
            </div>
            <span className="hidden md:inline-block text-white/70">|</span>
            <span className="hidden md:inline-block text-emerald-200">
              Rent Control Department Official Portal (Rent Act 220)
            </span>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-[11px] text-emerald-200/90 hidden sm:inline">
                Toll-Free Helpline: 0800-RENT-ACT
              </span>
            </div>
          </div>
        </div>

        {/* Main nav bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-gray-950 text-base tracking-tight leading-tight">
                    GHANA RENT CONTROL
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    PORTAL
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-medium">
                  National Fair Rent & Valuation Gateway
                </p>
              </div>
            </Link>

            {/* Desktop nav — only when signed in */}
            <nav className="hidden lg:flex items-center gap-1">
              {visibleNavLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-50 text-emerald-900 font-bold border border-emerald-200 shadow-2xs"
                        : "text-gray-700 hover:text-emerald-800 hover:bg-gray-50"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-emerald-700" : "text-gray-400"
                      }`}
                    />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${item.badgeStyle}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side: CTA + profile / sign-in */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Contextual CTA — signed-in users only */}
              {isSignedIn && currentUser?.role === "LANDLORD" && (
                <Link
                  href="/landlord/new"
                  className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-all hover:shadow-md"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>List Property</span>
                </Link>
              )}

              {isSignedIn && currentUser?.role === "ADMIN_OFFICER" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-all hover:shadow-md border border-emerald-700"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Review Queue</span>
                </Link>
              )}

              {isSignedIn && currentUser?.role === "TENANT" && (
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-all hover:shadow-md"
                >
                  <Search className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Search Homes</span>
                </Link>
              )}

              {/* ───────── SIGNED IN: Profile dropdown ───────── */}
              {hydrated && isSignedIn && currentUser ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setSwitcherOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-emerald-300 transition-all text-left shadow-2xs"
                  >
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.fullName}
                        className="w-8 h-8 rounded-lg object-cover border border-emerald-600/30"
                      />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          ROLE_COLOR[currentUser.role]
                        }`}
                      >
                        {ROLE_ABBR[currentUser.role]}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-semibold text-gray-900 leading-tight flex items-center gap-1.5">
                        {currentUser.fullName.split(" ")[0]}
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            ROLE_BADGE[currentUser.role]
                          }`}
                        >
                          {currentUser.role.replace("_", " ")}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        {currentUser.ghanaCardNumber}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {/* Profile dropdown menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                      {/* User card */}
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          {currentUser.avatarUrl ? (
                            <img
                              src={currentUser.avatarUrl}
                              alt={currentUser.fullName}
                              className="w-10 h-10 rounded-xl object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                                ROLE_COLOR[currentUser.role]
                              }`}
                            >
                              {ROLE_ABBR[currentUser.role]}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-gray-900 truncate">
                              {currentUser.fullName}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {currentUser.email}
                            </div>
                            <div className="text-[10px] font-mono text-emerald-700 mt-0.5">
                              {currentUser.ghanaCardNumber}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Switch demo persona */}
                      <div className="p-2">
                        <button
                          onClick={() => setSwitcherOpen(!switcherOpen)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                            <span>Switch Demo Persona</span>
                          </div>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                              switcherOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {switcherOpen && (
                          <div className="mt-1 space-y-1">
                            {demoUsers.map((demo) => {
                              const isActive = currentUser.role === demo.role;
                              return (
                                <button
                                  key={demo.id}
                                  onClick={() => {
                                    switchUser(demo);
                                    setProfileDropdownOpen(false);
                                    setSwitcherOpen(false);
                                  }}
                                  className={`w-full text-left p-2.5 rounded-xl flex items-start gap-3 transition-colors ${
                                    isActive
                                      ? "bg-emerald-50/80 border border-emerald-200"
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${
                                      ROLE_COLOR[demo.role as Role]
                                    }`}
                                  >
                                    {ROLE_ABBR[demo.role as Role]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-xs font-bold text-gray-900 truncate">
                                        {demo.name}
                                      </span>
                                      {isActive && (
                                        <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold shrink-0">
                                          Active
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-gray-500 truncate">
                                      {demo.title}
                                    </div>
                                    <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                                      {demo.card}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Sign out */}
                      <div className="border-t border-gray-100 p-2">
                        <button
                          onClick={() => {
                            signOut();
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out of Portal</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : hydrated && !isSignedIn ? (
                /* ───────── SIGNED OUT: Sign In & Sign Up buttons ───────── */
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSignInMode("SIGN_IN");
                      setSignInOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:text-emerald-900 hover:bg-gray-100 transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      setSignInMode("SIGN_UP");
                      setSignInOpen(true);
                    }}
                    className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all hover:shadow-md"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Sign Up with Google</span>
                  </button>
                </div>
              ) : (
                /* Loading skeleton */
                <div className="w-32 h-9 rounded-xl bg-gray-100 animate-pulse" />
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Mobile sign-in button when logged out */}
              {hydrated && !isSignedIn && (
                <button
                  onClick={() => {
                    setSignInMode("SIGN_UP");
                    setSignInOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 bg-emerald-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold"
                >
                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign Up</span>
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ───────── Mobile Menu ───────── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-5 space-y-3">
            {isSignedIn && currentUser ? (
              <>
                {/* User identity card */}
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase text-white ${
                        ROLE_COLOR[currentUser.role]
                      }`}
                    >
                      {currentUser.role.replace("_", " ")}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {currentUser.fullName}
                    </span>
                  </div>
                </div>

                {/* Mobile nav links */}
                <div className="flex flex-col gap-1">
                  {visibleNavLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? "bg-emerald-50 text-emerald-900 font-bold border border-emerald-200"
                            : "text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-emerald-600" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${item.badgeStyle}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Switch persona section */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">
                    Switch Demo Persona
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {demoUsers.map((demo) => (
                      <button
                        key={demo.id}
                        onClick={() => {
                          switchUser(demo);
                          setMobileMenuOpen(false);
                        }}
                        className={`text-left p-2 rounded-xl text-xs font-medium border flex items-center justify-between ${
                          currentUser.role === demo.role
                            ? "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div>
                          <div>
                            {demo.name} ({demo.role.replace("_", " ")})
                          </div>
                          <div className="font-mono text-[10px] text-gray-400">
                            {demo.card}
                          </div>
                        </div>
                        {currentUser.role === demo.role && (
                          <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                            Active
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sign out */}
                <div className="border-t border-gray-100 pt-3">
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Portal</span>
                  </button>
                </div>
              </>
            ) : (
              /* Signed-out mobile state */
              <div className="text-center py-6 space-y-3">
                <UserCircle className="w-12 h-12 text-gray-300 mx-auto" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Welcome to Ghana Rent Control
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Sign up or log in to search homes, list properties, or verify rents.
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-1 max-w-xs mx-auto">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSignInMode("SIGN_UP");
                      setSignInOpen(true);
                    }}
                    className="flex items-center justify-center gap-2.5 bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Sign up with Google</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSignInMode("SIGN_IN");
                      setSignInOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-xl text-xs font-bold"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In with Email</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Sign-In / Sign-Up Modal — rendered outside header for stacking context */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        initialMode={signInMode}
      />
    </>
  );
}
