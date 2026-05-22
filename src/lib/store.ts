import { useEffect, useState } from "react";
import type { Answers } from "./assessment";
import { supabase } from "@/integrations/supabase/client";
import { overallScore, stageFor } from "./assessment";

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

export type CloudAssessment = {
  id: string;
  company_name: string;
  industry: string | null;
  employees: string | null;
  answers: Answers;
  overall_score: number | null;
  stage: string | null;
  completed_at: string;
};

export async function saveAssessmentToCloud(a: SavedAssessment): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "غير مسجّل" };
  const score = overallScore(a.answers);
  const stage = stageFor(score).label;
  const { error } = await supabase.from("assessments").insert({
    user_id: user.id,
    company_name: a.companyName,
    industry: a.industry,
    employees: a.employees,
    answers: a.answers,
    overall_score: score,
    stage,
    completed_at: a.completedAt,
  });
  // Also upsert profile snapshot
  await supabase.from("profiles").update({
    company_name: a.companyName,
    industry: a.industry,
    employees: a.employees,
  }).eq("id", user.id);
  return { error: error?.message ?? null };
}

export async function listCloudAssessments(): Promise<CloudAssessment[]> {
  const { data, error } = await supabase
    .from("assessments")
    .select("id, company_name, industry, employees, answers, overall_score, stage, completed_at")
    .order("completed_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []) as unknown as CloudAssessment[];
}