"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME, APP_FULL_NAME } from "@/lib/constants";
import {
  Loader2, LogIn, GraduationCap, Users, BarChart3, Shield,
  BookOpen, ClipboardCheck,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@zems.gov.zw");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const demoAccounts = [
    { email: "admin@zems.gov.zw", role: "Headmaster", icon: Shield, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    { email: "ministry@zems.gov.zw", role: "Ministry", icon: BarChart3, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { email: "teacher@school.co.zw", role: "Teacher", icon: BookOpen, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    { email: "bursar@school.co.zw", role: "Bursar", icon: ClipboardCheck, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    { email: "parent@gmail.com", role: "Parent", icon: Users, color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  ];

  const features = [
    { icon: GraduationCap, title: "Student Management", desc: "Track enrollment, profiles & academic records" },
    { icon: ClipboardCheck, title: "Attendance Tracking", desc: "Real-time daily attendance monitoring" },
    { icon: BarChart3, title: "Analytics & Reports", desc: "Data-driven insights for decision making" },
    { icon: Users, title: "Multi-Role Access", desc: "Tailored dashboards for every stakeholder" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-emerald-950 font-extrabold text-lg">Z</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">{APP_NAME}</h1>
              <p className="text-emerald-300/60 text-xs">{APP_FULL_NAME}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Empowering Zimbabwe&apos;s<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Education System</span>
          </h2>
          <p className="text-emerald-200/60 text-base leading-relaxed mb-10">
            A unified national platform connecting schools, teachers, students, and parents across all provinces.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className="group p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.07] transition-all">
                <f.icon className="w-5 h-5 text-amber-400 mb-3" />
                <p className="text-sm font-semibold text-white mb-1">{f.title}</p>
                <p className="text-xs text-emerald-200/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-emerald-300/30 text-xs">
            Ministry of Primary and Secondary Education — Republic of Zimbabwe
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
              <span className="text-emerald-950 font-extrabold text-lg">Z</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">{APP_NAME}</h1>
              <p className="text-muted-foreground text-xs">{APP_FULL_NAME}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h2>
            <p className="text-muted-foreground text-sm">Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@zems.gov.zw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 px-4 bg-muted/40 border-border/60 focus:bg-background transition-colors"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 px-4 bg-muted/40 border-border/60 focus:bg-background transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2.5 rounded-lg border border-destructive/20">
                <Shield className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 text-sm font-semibold shadow-lg shadow-primary/25" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
              ) : (
                <><LogIn className="w-4 h-4 mr-2" /> Sign In</>
              )}
            </Button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest">Demo Accounts</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => setEmail(acc.email)}
                  className={`flex items-center gap-3 w-full px-3.5 py-2.5 text-left text-sm rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99] ${
                    email === acc.email ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20" : "border-border/50 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${acc.color}`}>
                    <acc.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{acc.email}</p>
                    <p className="text-[11px] text-muted-foreground">{acc.role}</p>
                  </div>
                  {email === acc.email && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-muted-foreground/50 text-[11px] mt-8 lg:hidden">
            Ministry of Primary and Secondary Education — Republic of Zimbabwe
          </p>
        </div>
      </div>
    </div>
  );
}
