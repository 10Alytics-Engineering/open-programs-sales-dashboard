"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  GraduationCap,
  ChevronLeft,
  Loader2,
  BadgeCheck,
  History,
  Clock,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FileText
} from "lucide-react";
import { User as UserType, PaymentStatus, Transaction } from "@/types";
import { toast } from "sonner";

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [student, setStudent] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Fetch user basic info and payment statuses
        const userResponse = await api.get(`/users/${id}`);
        setStudent(userResponse.data.data);

        // Fetch user transaction history from the sales-dashboard transactions endpoint
        // Filtered locally for now as there's no direct user-specific transactions endpoint in sales-dashboard controller
        const transactionsResponse = await api.get("/sales-dashboard/transactions");
        const userTransactions = transactionsResponse.data.filter((t: Transaction) => t.userId === id);
        setTransactions(userTransactions);
      } catch (error) {
        console.error("Failed to fetch student data", error);
        toast.error("Failed to load student details");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 font-bold mb-4">Student not found</p>
        <Link href="/students" className="text-indigo-600 font-bold hover:underline flex items-center justify-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Back Action */}
      <div className="flex items-center justify-between">
        <Link
          href="/students"
          className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm tracking-tight">Return to Directory</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
            student.role === "ADMIN" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
          )}>
            {student.role} ACCOUNT
          </span>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 md:w-80 h-48 md:h-80 bg-gradient-to-br from-indigo-50/50 to-transparent rounded-full translate-x-16 md:translate-x-32 -translate-y-16 md:-translate-y-32" />

        <div className="p-6 md:p-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
            <div className="relative shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-[32px] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                <User className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg border border-slate-50">
                <BadgeCheck className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 absolute text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-3 md:space-y-4">
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3 md:mb-2">{student.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4">
                  <div className="flex items-center gap-1.5 md:gap-2 text-slate-500 font-bold bg-slate-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-slate-100/50">
                    <Mail className="w-3 h-3 md:w-3.5 md:h-3.5 text-indigo-500 shrink-0" />
                    <span className="text-[10px] md:text-xs truncate max-w-[150px] sm:max-w-none">{student.email}</span>
                  </div>
                  {student.phone_number && (
                    <div className="flex items-center gap-1.5 md:gap-2 text-slate-500 font-bold bg-slate-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-slate-100/50">
                      <Phone className="w-3 h-3 md:w-3.5 md:h-3.5 text-indigo-500 shrink-0" />
                      <span className="text-[10px] md:text-xs">{student.phone_number}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 md:gap-2 text-slate-500 font-bold bg-slate-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border border-slate-100/50">
                    <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-indigo-500 shrink-0" />
                    <span className="text-[10px] md:text-xs">Joined {formatDate(student.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Course Enrollment Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
              <GraduationCap className="text-indigo-600" />
              Program Enrollments
            </h2>
            <span className="text-xs font-bold text-slate-400">Total: {student.paymentStatus?.length || 0}</span>
          </div>

          <div className="space-y-4">
            {student.paymentStatus && student.paymentStatus.length > 0 ? (
              student.paymentStatus.map((ps) => (
                <div key={ps.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-all group">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider",
                          ps.status === "COMPLETE" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        )}>
                          {ps.status}
                        </span>
                        <span className="text-[9px] md:text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-lg">
                          {ps.paymentPlan?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h3 className="text-base md:text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase">{ps.course?.title}</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs text-slate-400 font-bold">
                          <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
                          <span>Last Update: {formatDate(ps.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end justify-center pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                      <p className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-2 sm:mb-1">Payment installments</p>
                      <div className="flex flex-wrap gap-1 md:gap-1.5">
                        {ps.paymentInstallments && ps.paymentInstallments.map((inst, idx) => (
                          <div
                            key={inst.id}
                            className={cn(
                              "w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg flex items-center justify-center text-[9px] md:text-[10px] font-bold border transition-all shrink-0",
                              inst.paid
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-white text-slate-300 border-slate-100"
                            )}
                            title={inst.paid ? `Paid: ${formatPrice(inst.amount)}` : `Due: ${formatPrice(inst.amount)}`}
                          >
                            {idx + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 md:p-12 rounded-3xl border border-dashed border-slate-200 text-center">
                <GraduationCap className="w-10 h-10 md:w-12 md:h-12 text-slate-200 mx-auto mb-3 md:mb-4" />
                <p className="text-xs md:text-sm text-slate-400 font-bold">No active enrollments found for this student.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions/Summary */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-slate-900 rounded-3xl md:rounded-[32px] p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
            <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-indigo-500/10 rounded-full translate-x-12 md:translate-x-16 -translate-y-12 md:-translate-y-16" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black tracking-tight uppercase">Revenue Impact</h3>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lifetime Value</p>
                <p className="text-3xl font-black text-white">{formatPrice(transactions.reduce((acc, t) => acc + Number(t.amount), 0))}</p>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => {
                    const htmlContent = `
                      <h1 style="font-family: Arial, sans-serif; text-align: center; color: #4f46e5;">Student Profile: ${student.name}</h1>
                      <div style="font-family: Arial, sans-serif; margin-bottom: 20px;">
                        <p><strong>Email:</strong> ${student.email}</p>
                        <p><strong>Phone:</strong> ${student.phone_number || "N/A"}</p>
                        <p><strong>Joined:</strong> ${formatDate(student.createdAt)}</p>
                        <p><strong>Total Lifetime Value:</strong> ${formatPrice(transactions.reduce((acc, t) => acc + Number(t.amount), 0))}</p>
                      </div>
                      
                      <h2 style="font-family: Arial, sans-serif; color: #4f46e5; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Program Enrollments</h2>
                      <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; margin-bottom: 20px;">
                        <thead style="background-color: #f8fafc;">
                          <tr>
                            <th>Program</th>
                            <th>Status</th>
                            <th>Plan</th>
                            <th>Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${student.paymentStatus?.map(ps => `
                            <tr>
                              <td>${ps.course?.title}</td>
                              <td>${ps.status}</td>
                              <td>${ps.paymentPlan || "N/A"}</td>
                              <td>${formatDate(ps.createdAt)}</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>

                      <h2 style="font-family: Arial, sans-serif; color: #4f46e5; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Transaction History</h2>
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
                          ${transactions.map(t => `
                            <tr>
                              <td>${t.transactionRef}</td>
                              <td>${formatPrice(Number(t.amount))}</td>
                              <td>${t.status}</td>
                              <td>${formatDate(t.paymentDate)}</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    `;

                    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
                    const footer = "</body></html>";
                    const sourceHTML = header + htmlContent + footer;

                    const blob = new Blob([sourceHTML], { type: 'application/msword' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `student_profile_${student.name.replace(/\s+/g, '_').toLowerCase()}.doc`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    toast.success("Student data exported as Document");
                  }}
                  className="w-full bg-white text-slate-900 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition flex items-center justify-center gap-2"
                >
                  <FileText size={14} />
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl md:rounded-[32px] p-5 md:p-8 border border-slate-100 shadow-sm">
            <h4 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-indigo-500" />
              Recent Activities
            </h4>
            <div className="space-y-4 md:space-y-6">
              {transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="flex gap-3 md:gap-4 group">
                  <div className="relative">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-indigo-500 mt-1 md:mt-1.5" />
                    <div className="absolute top-3 md:top-4 left-[3.5px] md:left-[4.5px] bottom-0 w-[1px] bg-slate-100 group-last:hidden" />
                  </div>
                  <div>
                    <p className="text-[11px] md:text-xs font-black text-slate-900 leading-tight">Payment of {formatPrice(Number(t.amount))}</p>
                    <p className="text-[9px] md:text-[10px] text-slate-400 font-bold">{formatDate(t.paymentDate)}</p>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-[10px] md:text-xs font-bold text-slate-300 italic text-center">No recent transactions</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Transaction History Table (Optional but nice) */}
      {transactions.length > 0 && (
        <div className="space-y-4 md:space-y-6 pb-20">
          <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Transaction History
          </h2>
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left min-w-[600px] md:min-w-0">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Program</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-[10px] md:text-xs text-slate-600 uppercase tracking-tighter">{t.transactionRef}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className="text-[10px] md:text-xs font-black text-slate-900 uppercase tracking-tighter truncate max-w-[150px] md:max-w-[200px] inline-block">
                          {t.paymentStatus?.course?.title || "Program Update"}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-black text-slate-900">{formatPrice(Number(t.amount))}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className={cn(
                          "px-2 md:px-2.5 py-0.5 md:py-1 rounded-md md:rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-wider",
                          t.status === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-bold text-slate-400 whitespace-nowrap">{formatDate(t.paymentDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
