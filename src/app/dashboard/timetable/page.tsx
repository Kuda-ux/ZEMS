"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getTimetableSlots } from "@/lib/supabase/queries";
import type { TimetableSlot } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Plus, Printer } from "lucide-react";
import { toast } from "sonner";

const subjectColors: Record<string, string> = {
  English: "bg-blue-100 text-blue-800",
  Mathematics: "bg-emerald-100 text-emerald-800",
  Science: "bg-purple-100 text-purple-800",
  Shona: "bg-amber-100 text-amber-800",
  History: "bg-rose-100 text-rose-800",
  Geography: "bg-cyan-100 text-cyan-800",
  Commerce: "bg-orange-100 text-orange-800",
  Agriculture: "bg-lime-100 text-lime-800",
  "Computer Sc.": "bg-indigo-100 text-indigo-800",
  "PE / Sports": "bg-pink-100 text-pink-800",
  BREAK: "bg-gray-100 text-gray-500",
  LUNCH: "bg-gray-100 text-gray-500",
};

interface TimetableRow {
  time: string; monday: string; tuesday: string; wednesday: string; thursday: string; friday: string;
}

function buildGrid(slots: TimetableSlot[]): TimetableRow[] {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const timeSlots = [...new Set(slots.map(s => s.time_slot))].sort();
  return timeSlots.map(time => {
    const row: TimetableRow = { time, monday: "", tuesday: "", wednesday: "", thursday: "", friday: "" };
    for (const s of slots.filter(sl => sl.time_slot === time)) {
      const day = s.day_of_week.toLowerCase() as keyof TimetableRow;
      if (days.includes(day)) {
        if (day === "monday") row.monday = s.subject;
        else if (day === "tuesday") row.tuesday = s.subject;
        else if (day === "wednesday") row.wednesday = s.subject;
        else if (day === "thursday") row.thursday = s.subject;
        else if (day === "friday") row.friday = s.subject;
      }
    }
    return row;
  });
}

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState("Form 1 A");
  const [slots, setSlots] = useState<TimetableSlot[]>([]);

  const fetchData = useCallback(async () => {
    try { const data = await getTimetableSlots(selectedClass); setSlots(data); } catch (e) { console.error(e); }
  }, [selectedClass]);
  useEffect(() => { fetchData(); }, [fetchData]);

  const timetableData = useMemo(() => buildGrid(slots), [slots]);

  return (
    <div className="space-y-6">
      <PageHeader title="Timetable" description="View and manage class schedules">
        <Button variant="outline" size="sm" onClick={() => {
          toast.success("Printing timetable", { description: selectedClass });
          window.print();
        }}><Printer className="w-4 h-4 mr-2" /> Print</Button>
        <Button size="sm" onClick={() => {
          toast.info("Edit mode", { description: "Timetable editing coming soon" });
        }}><Plus className="w-4 h-4 mr-2" /> Edit Timetable</Button>
      </PageHeader>

      <div className="flex items-center gap-3">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <Select value={selectedClass} onValueChange={(v) => v && setSelectedClass(v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            {["Form 1 A", "Form 1 B", "Form 1 C", "Form 2 A", "Form 2 B", "Form 2 C",
              "Form 3 A", "Form 3 B", "Form 3 C", "Form 4 A", "Form 4 B", "Form 4 C"].map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="text-xs">Term 1, 2026</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{selectedClass} — Weekly Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[130px] font-bold">Time</TableHead>
                  <TableHead className="text-center font-bold">Monday</TableHead>
                  <TableHead className="text-center font-bold">Tuesday</TableHead>
                  <TableHead className="text-center font-bold">Wednesday</TableHead>
                  <TableHead className="text-center font-bold">Thursday</TableHead>
                  <TableHead className="text-center font-bold">Friday</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetableData.map((slot) => {
                  const isBreak = slot.monday === "BREAK" || slot.monday === "LUNCH";
                  return (
                    <TableRow key={slot.time} className={isBreak ? "bg-gray-50" : ""}>
                      <TableCell className="font-mono text-xs font-medium">{slot.time}</TableCell>
                      {["monday", "tuesday", "wednesday", "thursday", "friday"].map((day) => {
                        const subject = slot[day as keyof TimetableRow] || "";
                        const color = subjectColors[subject] || "bg-gray-50 text-gray-700";
                        return (
                          <TableCell key={day} className="text-center p-1.5">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${color}`}>
                              {subject}
                            </span>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
