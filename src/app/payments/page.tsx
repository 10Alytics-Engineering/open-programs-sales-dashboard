"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PaymentsPageContent } from "./components/payments-page-content";

export default function PaymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <PaymentsPageContent />
    </Suspense>
  );
}
