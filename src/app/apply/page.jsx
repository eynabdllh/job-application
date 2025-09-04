import { Suspense } from "react";
import ApplyClient from "./ApplyClient";

// --- Data ---
const projects = [
  "AI Data Extraction", "Machine Learning Enablement", "Genealogy",
  "Natural Language Processing", "AI-Enabled Customer Service",
  "Computer Vision", "Autonomous Driving Technology"
];
const degreeOptions = [
  "High School / GED", "Associate's Degree", "Bachelor's Degree",
  "Master's Degree", "Doctorate (PhD)", "Other"
];
const courseOptions = [
  "Computer Science", "Data Science", "Artificial Intelligence", "Machine Learning",
  "Software Engineering", "Information Technology", "Mathematics", "Statistics",
  "Physics", "Engineering", "Business Administration", "Economics", "Other"
];
const steps = [
  { id: 1, name: 'Personal' },
  { id: 2, name: 'Background' },
  { id: 3, name: 'Details' },
  { id: 4, name: 'Review & Submit' },
];

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <ApplyClient />
    </Suspense>
  );
}
