"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
}: StatCardProps) {
  return (
    <Card className="group hover:shadow-lg hover:shadow-black/5 transition-all duration-200 border-border/60 hover:border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-[13px] font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                {changeType === "positive" && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                {changeType === "negative" && <TrendingDown className="w-3 h-3 text-red-500" />}
                <p
                  className={cn(
                    "text-xs font-medium",
                    changeType === "positive" && "text-emerald-600",
                    changeType === "negative" && "text-red-500",
                    changeType === "neutral" && "text-muted-foreground"
                  )}
                >
                  {change}
                </p>
              </div>
            )}
          </div>
          <div className={cn("p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-110", iconBg)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
