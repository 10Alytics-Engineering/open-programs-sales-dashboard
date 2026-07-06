"use client";

import { FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { formatDate, formatPrice } from "@/lib/utils";
import { Transaction } from "@/types";

type StudentRevenueCardProps = {
  student: any;
  lifetimeValue: number;
  transactions: Transaction[];
  purchasedCourses: any[];
};

export function StudentRevenueCard({
  student,
  lifetimeValue,
  transactions,
  purchasedCourses,
}: StudentRevenueCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl shadow-slate-200 md:rounded-4xl md:p-8">
      <div className="absolute right-0 top-0 h-24 w-24 -translate-y-12 translate-x-12 rounded-full bg-indigo-500/10 md:h-32 md:w-32 md:-translate-y-16 md:translate-x-16" />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-500">
            <TrendingUp className="h-3 w-3" />
          </div>

          <h3 className="text-md font-black uppercase tracking-tight">
            Revenue Impact
          </h3>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Lifetime Value
          </p>

          <p className="text-xl font-black text-white">
            {formatPrice(lifetimeValue)}
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6">
          <button
            onClick={() =>
              exportStudentProfile({
                student,
                transactions,
                lifetimeValue,
                purchasedCourses,
              })
            }
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-xs font-black uppercase tracking-widest text-slate-900 transition hover:bg-slate-100"
          >
            <FileText size={14} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

function exportStudentProfile({
  student,
  transactions,
  lifetimeValue,
  purchasedCourses,
}: {
  student: any;
  transactions: Transaction[];
  lifetimeValue: number;
  purchasedCourses: any[];
}) {
  const htmlContent = `
    <h1 style="font-family: Arial, sans-serif; text-align: center; color: #4f46e5;">
      Student Profile: ${student.name}
    </h1>

    <div style="font-family: Arial, sans-serif; margin-bottom: 20px;">
      <p><strong>Email:</strong> ${student.email || "N/A"}</p>
      <p><strong>Phone:</strong> ${student.phone_number || "N/A"}</p>
      <p><strong>Total Lifetime Value:</strong> ${formatPrice(lifetimeValue)}</p>
    </div>

    <h2 style="font-family: Arial, sans-serif; color: #4f46e5; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
      Program Enrollments
    </h2>

    <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; margin-bottom: 20px;">
      <thead style="background-color: #f8fafc;">
        <tr>
          <th>Program</th>
          <th>Payment Status</th>
          <th>Plan</th>
          <th>Amount Paid</th>
          <th>Total Amount</th>
        </tr>
      </thead>

      <tbody>
        ${purchasedCourses
          .map((purchase: any) => {
            const stats = purchase.courseStats || {};

            return `
              <tr>
                <td>${purchase.course?.title || "N/A"}</td>
                <td>${stats.paymentStatus || "UNKNOWN"}</td>
                <td>${stats.paymentPlan || "FULL"}</td>
                <td>${formatPrice(Number(stats.amountPaid || 0))}</td>
                <td>${formatPrice(Number(stats.totalAmount || 0))}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>

    <h2 style="font-family: Arial, sans-serif; color: #4f46e5; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
      Transaction History
    </h2>

    <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
      <thead style="background-color: #f8fafc;">
        <tr>
          <th>Ref</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        ${transactions
          .map(
            (transaction) => `
              <tr>
                <td>${transaction.transactionRef}</td>
                <td>${formatPrice(Number(transaction.amount || 0))}</td>
                <td>${transaction.status}</td>
                <td>${
                  transaction.paymentDate
                    ? formatDate(transaction.paymentDate)
                    : ""
                }</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;

  const header =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
  const footer = "</body></html>";

  const blob = new Blob([header + htmlContent + footer], {
    type: "application/msword",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `student_profile_${student.name
    .replace(/\s+/g, "_")
    .toLowerCase()}.doc`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success("Student data exported as document");
}
