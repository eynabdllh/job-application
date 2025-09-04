import { Suspense } from "react";
import ApplyClient from "./ApplyClient";

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <ApplyClient />
    </Suspense>
  );
}
