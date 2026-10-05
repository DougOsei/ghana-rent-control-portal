"use client";

import { useState, useEffect } from "react";
import { User, Role } from "./types";

export const DEMO_USERS: {
  role: Role;
  name: string;
  title: string;
  email: string;
  card: string;
  id: string;
  password: string;
}[] = [
  {
    role: "ADMIN_OFFICER",
    name: "Chief Insp. Sampson Abbey",
    title: "Rent Control Officer (HQ Accra)",
    email: "officer.sampson@rentcontrol.gov.gh",
    card: "GHA-849302194-9",
    id: "user-admin-1",
    password: "admin123",
  },
  {
    role: "LANDLORD",
    name: "Kwame Mensah Boakye",
    title: "Verified Landlord (East Legon)",
    email: "kwame.mensah@gmail.com",
    card: "GHA-102938475-1",
    id: "user-landlord-1",
    password: "landlord123",
  },
  {
    role: "TENANT",
    name: "Abena Serwaa Osei",
    title: "Verified Tenant (Accra)",
    email: "abena.serwaa@gmail.com",
    card: "GHA-594837261-4",
    id: "user-tenant-1",
    password: "tenant123",
  },
];

const LS_USER_KEY = "grc_current_user";
const LS_AUTH_KEY = "grc_signed_in";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Restore session from localStorage
    const savedAuth = localStorage.getItem(LS_AUTH_KEY);
    const savedUser = localStorage.getItem(LS_USER_KEY);
    if (savedAuth === "true" && savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setIsSignedIn(true);
      } catch {
        // ignore parse errors
      }
    }
    setHydrated(true);

    // Listen for cross-component user changes
    const handleUserChanged = (event: CustomEvent<User>) => {
      if (event.detail) {
        setCurrentUser(event.detail);
        setIsSignedIn(true);
      }
    };

    const handleUserSignedOut = () => {
      setCurrentUser(null);
      setIsSignedIn(false);
    };

    window.addEventListener("grc-user-changed" as any, handleUserChanged);
    window.addEventListener("grc-user-signed-out" as any, handleUserSignedOut);
    return () => {
      window.removeEventListener("grc-user-changed" as any, handleUserChanged);
      window.removeEventListener("grc-user-signed-out" as any, handleUserSignedOut);
    };
  }, []);

  /**
   * Authenticate a user by email + password against the demo roster.
   * Returns an error string on failure, or null on success.
   */
  const signIn = (email: string, password: string): string | null => {
    const match = DEMO_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );
    if (!match) {
      return "Invalid email or password. Please check your credentials.";
    }

    const user: User = {
      id: match.id,
      email: match.email,
      role: match.role,
      fullName: match.name,
      phone: "+233 24 492 8190",
      ghanaCardNumber: match.card,
      ghanaCardVerified: true,
      createdAt: "2024-01-10T08:00:00Z",
    };

    setCurrentUser(user);
    setIsSignedIn(true);
    localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    localStorage.setItem(LS_AUTH_KEY, "true");
    window.dispatchEvent(new CustomEvent("grc-user-changed", { detail: user }));
    return null; // success
  };

  /** Sign out — clears session entirely */
  const signOut = () => {
    setCurrentUser(null);
    setIsSignedIn(false);
    localStorage.removeItem(LS_USER_KEY);
    localStorage.removeItem(LS_AUTH_KEY);
    window.dispatchEvent(new CustomEvent("grc-user-signed-out"));
  };

  /**
   * Dev-only: directly switch persona without a password.
   * Only used internally when the user is already signed in via demo mode.
   */
  const switchUser = (demoUser: (typeof DEMO_USERS)[0]) => {
    const updated: User = {
      id: demoUser.id,
      email: demoUser.email,
      role: demoUser.role,
      fullName: demoUser.name,
      phone: "+233 24 492 8190",
      ghanaCardNumber: demoUser.card,
      ghanaCardVerified: true,
      createdAt: "2024-01-10T08:00:00Z",
    };
    setCurrentUser(updated);
    setIsSignedIn(true);
    localStorage.setItem(LS_USER_KEY, JSON.stringify(updated));
    localStorage.setItem(LS_AUTH_KEY, "true");
    window.dispatchEvent(
      new CustomEvent("grc-user-changed", { detail: updated })
    );
  };

  /**
   * Register or Sign In with Google
   */
  const signUpWithGoogle = (params: {
    fullName: string;
    email: string;
    role: Role;
    avatarUrl?: string;
    ghanaCardNumber?: string;
    phone?: string;
  }): User => {
    const randomCardDigits = Math.floor(100000000 + Math.random() * 900000000);
    const card =
      params.ghanaCardNumber && params.ghanaCardNumber.trim().length > 0
        ? params.ghanaCardNumber.trim()
        : `GHA-${randomCardDigits}-${Math.floor(Math.random() * 9)}`;

    const user: User = {
      id: `google-user-${Date.now()}`,
      email: params.email,
      role: params.role,
      fullName: params.fullName,
      phone: params.phone || "+233 24 555 0199",
      ghanaCardNumber: card,
      ghanaCardVerified: true,
      avatarUrl:
        params.avatarUrl ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(user);
    setIsSignedIn(true);
    localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    localStorage.setItem(LS_AUTH_KEY, "true");
    window.dispatchEvent(new CustomEvent("grc-user-changed", { detail: user }));
    return user;
  };

  return {
    currentUser,
    isSignedIn,
    hydrated,
    signIn,
    signUpWithGoogle,
    signOut,
    switchUser,
    demoUsers: DEMO_USERS,
  };
}
