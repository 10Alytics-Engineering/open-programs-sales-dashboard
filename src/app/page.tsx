"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { formatPrice, formatDate, cn } from "@/lib/utils";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from "recharts";
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
  ChevronRight,
  Calendar
} from "lucide-react";
import { DashboardData } from "@/types";
import Link from "next/link";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState("7d");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/sales-dashboard/dashboard?duration=${duration}`);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [duration]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!data) return <div>Failed to load dashboard. Please check your connection.</div>;

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316'];

  const getTimelineDateRange = () => {
    if (duration === "all") return "Lifetime Accumulation";
    const pastDate = new Date();
    const days = duration === "30d" ? 30 : duration === "90d" ? 90 : 7;
    pastDate.setDate(pastDate.getDate() - days);
    return `${formatDate(pastDate.toISOString())} - Today`;
  };

  const dateRange = getTimelineDateRange();

  const getTimelineTitle = () => {
    switch (duration) {
      case "30d": return "Monthly Sales Activity";
      case "90d": return "Quarterly Sales Activity";
      case "all": return "Lifetime Sales Activity";
      default: return "Weekly Sales Activity";
    }
  };

  const getTimelineSubtitle = () => {
    switch (duration) {
      case "30d": return "Last 30 Days Performance";
      case "90d": return "Last 90 Days Performance";
      case "all": return "Total Accumulated Performance";
      default: return "Last 7 Days Performance";
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
      {/* Activity Timeline */}
      <section className="space-y-4 md:space-y-6 relative">
        <div className="absolute -inset-4 bg-indigo-50/30 rounded-[40px] -z-10 blur-2xl hidden md:block" />
        
        <div className="flex flex-col xl:flex-row xl:items-end justify-between px-1 md:px-2 gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-2 md:w-3 h-10 md:h-12 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200" />
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1 md:mb-2">{getTimelineTitle()}</h2>
              <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <Calendar className="w-3 h-3 text-indigo-500" />
                {dateRange}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                {[
                    { val: "7d", label: "7D" },
                    { val: "30d", label: "30D" },
                    { val: "90d", label: "90D" },
                    { val: "all", label: "ALL" }
                ].map((p) => (
                    <button
                        key={p.val}
                        onClick={() => setDuration(p.val)}
                        className={cn(
                            "flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black transition-all",
                            duration === p.val 
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        {p.label}
                    </button>
                ))}
            </div>
            <Link href="/payments" className="group flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all uppercase tracking-widest shadow-sm">
                Full Report
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <QuickActionCard 
            label="Total Sales" 
            value={data.summary.activityStats.total} 
            icon={Activity} 
            color="bg-slate-900" 
            href={`/payments?duration=${duration}`}
          />
          <QuickActionCard 
            label="Successful" 
            value={data.summary.activityStats.success} 
            icon={CheckCircle2} 
            color="bg-emerald-500" 
            href={`/payments?status=success&duration=${duration}`}
            activeColor="text-emerald-500"
          />
          <QuickActionCard 
            label="Pending" 
            value={data.summary.activityStats.pending} 
            icon={Clock} 
            color="bg-amber-500" 
            href={`/payments?status=pending&duration=${duration}`}
            activeColor="text-amber-500"
          />
          <QuickActionCard 
            label="Failed" 
            value={data.summary.activityStats.failed} 
            icon={AlertCircle} 
            color="bg-rose-500" 
            href={`/payments?status=failed&duration=${duration}`}
            activeColor="text-rose-500"
          />
        </div>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatPrice(data.summary.currentRevenue)} 
          change={data.summary.growthPercentage}
          icon={DollarSign}
          subtitle="Compared to last period"
        />
        <StatCard 
          title="Total Transactions" 
          value={data.summary.transactions.toLocaleString()} 
          change={0} 
          icon={CreditCard}
          subtitle="Successful payments"
        />
        <StatCard 
          title="Avg Transaction" 
          value={formatPrice(data.summary.averageTransaction)} 
          change={0} 
          icon={ArrowUpRight}
          subtitle="Average spend per user"
        />
        <StatCard 
          title="Active Students" 
          value={data.topCourses.reduce((sum, c) => sum + Number(c.enrollments), 0).toLocaleString()} 
          change={0} 
          icon={Users}
          subtitle="Enrolled this year"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue by Course Chart */}
        <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm transition-hover hover:shadow-md overflow-hidden">
          <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 flex items-center gap-2">
            Top Performing Courses
          </h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topCourses}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="title" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10}} 
                    dy={10} 
                    tickFormatter={(val) => val.length > 10 ? val.substring(0, 10) + '...' : val}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} tickFormatter={(val) => `₦${val/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: any) => [formatPrice(val), 'Revenue']}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={30}>
                  {data.topCourses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Plan Distribution */}
        <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6">Payment Plan Distribution</h3>
          <div className="h-[250px] md:h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.paymentPlanDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="paymentPlan"
                >
                  {data.paymentPlanDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-xl md:text-3xl font-bold block">{data.summary.transactions}</span>
              <span className="text-[10px] md:text-sm text-slate-400 font-medium uppercase tracking-tighter">Total Sales</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 md:mt-6">
            {data.paymentPlanDistribution.map((plan, index) => (
              <div key={plan.paymentPlan} className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[10px] md:text-xs font-semibold text-slate-600 truncate">{plan.paymentPlan.replace(/_/g, ' ')}</span>
                <span className="text-[10px] md:text-xs font-bold text-slate-900 ml-auto shrink-0">{Math.round((plan.count / data.summary.transactions) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, subtitle }: any) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div className="p-2 md:p-3 bg-indigo-50 text-indigo-600 rounded-xl md:rounded-2xl">
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        {change !== 0 && (
          <div className={cn(
            "flex items-center gap-0.5 md:gap-1 text-[10px] md:text-sm font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg",
            isPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" /> : <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] md:text-sm font-bold text-slate-400 mb-0.5 md:mb-1 uppercase tracking-tight">{title}</p>
        <h4 className="text-xl md:text-3xl font-black text-slate-900 mb-0.5 md:mb-1 leading-none">{value}</h4>
        <p className="text-[9px] md:text-xs font-bold text-slate-400 italic">{subtitle}</p>
      </div>
    </div>
  );
}

function QuickActionCard({ label, value, icon: Icon, color, href, activeColor }: any) {
  return (
    <Link 
      href={href}
      className="bg-white p-3 md:p-5 rounded-2xl md:rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-2 md:gap-4 transition-all hover:border-indigo-200 hover:shadow-md active:scale-95 group min-w-0"
    >
      <div className={cn(
        "w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg transition-transform group-hover:scale-110 duration-300",
        color
      )}>
        <Icon className="w-4 h-4 md:w-6 md:h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5 md:mb-1">{label}</p>
        <p className={cn("text-sm md:text-2xl font-black leading-none truncate", activeColor || "text-slate-900")}>
          {value}
        </p>
      </div>
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors shrink-0">
        <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
      </div>
    </Link>
  );
}

