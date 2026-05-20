import { useEffect, useState } from "react";
import type { Answers } from "./assessment";

const KEY = "webscale-dz:assessment-v1";
const PROFILE_KEY = "webscale-dz:profile-v1";

export type SavedAssessment = {
  companyName: string;
  industry: string;
  employees: string;
  answers: Answers;
  completedAt: string;
};

export function loadAssessment(): SavedAssessment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedAssessment) : null;
  } catch {
    return null;
  }
}

export function saveAssessment(a: SavedAssessment) {
  localStorage.setItem(KEY, JSON.stringify(a));
}

export function clearAssessment() {
  localStorage.removeItem(KEY);
}

export type Profile = { companyName: string; industry: string; employees: string };

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function useAssessment(): SavedAssessment | null {
  const [a, setA] = useState<SavedAssessment | null>(null);
  useEffect(() => {
    setA(loadAssessment());
  }, []);
  return a;
}