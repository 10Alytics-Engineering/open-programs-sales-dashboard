"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { 
  Search, 
  User, 
  ChevronRight,
  Loader2,
  Mail,
  GraduationCap,
  Phone
} from "lucide-react";
import { User as UserType } from "@/types";
import { toast } from "sonner";

export default function StudentsPage() {
  const [students, setStudents] = useState<UserType[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/sales-dashboard/users");
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        console.error("Failed to fetch students", error);
        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const result = students.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredStudents(result);
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-none">Student Directory</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and track student enrollment lifecycle</p>
        </div>
      </div>

      <div className="bg-white p-3 md:p-4 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full translate-x-16 -translate-y-16 hidden md:block" />
        <div className="relative z-10">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium bg-white rounded-3xl italic">
            No students found matching your search.
          </div>
        ) : filteredStudents.map((student) => (
          <div key={student.id} className="bg-white p-5 md:p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 group">
            <div className="flex items-start justify-between mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-400 group-hover:from-indigo-500 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300">
                <User className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="text-right">
                <span className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none block mb-1">Enrolled</span>
                <span className="text-[10px] md:text-xs font-bold text-slate-500">{formatDate(student.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-1 mb-5 md:mb-6">
              <h3 className="text-base md:text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{student.name}</h3>
              <div className="flex items-center gap-1.5 text-slate-400 min-w-0">
                <Mail className="w-3 h-3 shrink-0" />
                <span className="text-[10px] md:text-xs font-bold truncate">{student.email}</span>
              </div>
              {student.phone_number && (
                <div className="flex items-center gap-1.5 text-slate-400 min-w-0 mt-1">
                  <Phone className="w-3 h-3 shrink-0" />
                  <span className="text-[10px] md:text-xs font-bold truncate">{student.phone_number}</span>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-5 md:pt-6 border-t border-slate-50">
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Registered Programs</p>
              {student.paymentStatus && student.paymentStatus.length > 0 ? (
                <div className="space-y-2">
                  {student.paymentStatus.slice(0, 2).map((ps) => (
                    <div key={ps.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100/50">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="text-[10px] md:text-xs font-bold text-slate-700 truncate">{ps.course?.title}</span>
                      <span className={cn(
                        "ml-auto text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter shrink-0",
                        ps.status === "COMPLETE" ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"
                      )}>
                        {ps.status === "COMPLETE" ? "PAID" : "BAL"}
                      </span>
                    </div>
                  ))}
                  {student.paymentStatus.length > 2 && (
                    <p className="text-[9px] font-bold text-slate-400 text-center tracking-tighter uppercase italic">+{student.paymentStatus.length - 2} more programs</p>
                  )}
                </div>
              ) : (
                <p className="text-[10px] md:text-xs font-bold text-slate-300 italic">No course enrollment yet</p>
              )}
            </div>

            <Link 
              href={`/students/${student.id}`}
              className="w-full mt-5 md:mt-6 py-3 rounded-2xl bg-indigo-50 text-indigo-600 text-[11px] md:text-sm font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
