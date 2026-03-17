"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { formatPrice, cn } from "@/lib/utils";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  Calendar,
  Loader2,
  ChevronDown
} from "lucide-react";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/sales-dashboard/yearly-sales");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-none mb-1 uppercase tracking-tighter">Finance & Growth</h1>
          <p className="text-[10px] md:text-sm text-slate-500 font-bold uppercase italic tracking-tighter">Institutional Growth Reports {data?.year}</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="w-full md:w-auto bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition">
            <Calendar className="w-4 h-4 text-slate-400" />
            Year {data?.year}
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="bg-white p-4 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-indigo-50/30 rounded-full translate-x-32 md:translate-x-48 -translate-y-32 md:-translate-y-48 hidden md:block" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white shrink-0">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-[9px] md:text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Yearly Revenue</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none truncate max-w-[200px] md:max-w-none">{formatPrice(data?.totalRevenue || 0)}</h2>
            </div>
          </div>

          <div className="h-[250px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} 
                  dy={10} 
                  tickFormatter={(val: string) => val.substring(0, 3)}
                  minTickGap={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} 
                  tickFormatter={(val) => `₦${val/1000}k`}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: any) => [formatPrice(val), 'Monthly Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 text-center col-span-2 md:col-span-1">
          <p className="text-[9px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Transactions</p>
          <p className="text-xl md:text-2xl font-black text-slate-900">{data?.totalTransactions}</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 text-center">
          <p className="text-[9px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Highest Month</p>
          <p className="text-lg md:text-2xl font-black text-slate-900 truncate">
            {data?.monthlyData?.sort((a: any, b: any) => b.revenue - a.revenue)[0]?.month.substring(0, 3) || "N/A"}
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 text-center">
          <p className="text-[9px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Avg</p>
          <p className="text-lg md:text-2xl font-black text-slate-900 truncate">{formatPrice(data?.totalRevenue / 12)}</p>
        </div>
      </div>
    </div>
  );
}
