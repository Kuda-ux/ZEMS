"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, AlertTriangle, CreditCard, Receipt, PieChart as PieIcon } from "lucide-react";
import { mockData } from "@/lib/mock-data";
import { useAuth } from "@/providers/auth-provider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#166534", "#CA8A04", "#DC2626", "#2563eb"];

const paymentMethods = [
  { name: "EcoCash", value: 8500 },
  { name: "Cash", value: 5200 },
  { name: "Bank Transfer", value: 3800 },
  { name: "BEAM", value: 2100 },
];

export function BursarDashboard() {
  const { user } = useAuth();
  const stats = mockData.dashboardStats;
  const recentPayments = mockData.payments.slice(0, 6);
  const overdueInvoices = mockData.invoices.filter((i) => i.status === "pending" || i.status === "partial").slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Finance Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.first_name}. Here&apos;s today&apos;s financial summary.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Collected" value={`$${stats.feesCollected.toLocaleString()}`} change="+$3,200 this week" changeType="positive" icon={Wallet} iconColor="text-emerald-700" iconBg="bg-emerald-100" />
        <StatCard title="Outstanding" value={`$${stats.feesOutstanding.toLocaleString()}`} change="24 students" changeType="negative" icon={AlertTriangle} iconColor="text-red-600" iconBg="bg-red-100" />
        <StatCard title="Collection Rate" value="73%" change="+5% from last month" changeType="positive" icon={TrendingUp} iconColor="text-blue-700" iconBg="bg-blue-100" />
        <StatCard title="Payments Today" value={4} change="$1,250 received" changeType="positive" icon={CreditCard} iconColor="text-purple-700" iconBg="bg-purple-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Fee Collection Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.feeCollection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="collected" fill="#166534" radius={[4, 4, 0, 0]} name="Collected ($)" />
                  <Bar dataKey="outstanding" fill="#CA8A04" radius={[4, 4, 0, 0]} name="Outstanding ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-primary" /> Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" nameKey="name" label={({ name, value }: { name?: string; value?: number }) => `${name}: $${value}`}>
                    {paymentMethods.map((_, idx) => (<Cell key={idx} fill={COLORS[idx % COLORS.length]} />))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary" /> Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{p.student_name}</p>
                    <p className="text-xs text-muted-foreground">{p.receipt_number} · {p.payment_method}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">${p.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Overdue Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <div>
                    <p className="text-sm font-medium">{inv.student_name}</p>
                    <p className="text-xs text-muted-foreground">{inv.grade_name} · {inv.invoice_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-500">${inv.balance}</p>
                    <Badge variant={inv.status === "pending" ? "destructive" : "default"} className="text-[10px]">{inv.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
