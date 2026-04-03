"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Plus, Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TimetableSlot {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
}

const timetableData: TimetableSlot[] = [
  { time: "07:30 - 08:10", monday: "English", tuesday: "Mathematics", wednesday: "Shona", thursday: "English", friday: "Mathematics" },
  { time: "08:10 - 08:50", monday: "Mathematics", tuesday: "English", wednesday: "Science", thursday: "History", friday: "English" },
  { time: "08:50 - 09:30", monday: "Science", tuesday: "Geography", wednesday: "Mathematics", thursday: "Science", friday: "Agriculture" },
  { time: "09:30 - 09:50", monday: "BREAK", tuesday: "BREAK", wednesday: "BREAK", thursday: "BREAK", friday: "BREAK" },
  { time: "09:50 - 10:30", monday: "History", tuesday: "Shona", wednesday: "English", thursday: "Commerce", friday: "Geography" },
  { time: "10:30 - 11:10", monday: "Geography", tuesday: "Science", wednesday: "History", thursday: "Mathematics", friday: "Shona" },
  { time: "11:10 - 11:50", monday: "Shona", tuesday: "Commerce", wednesday: "Geography", thursday: "Agriculture", friday: "Science" },
  { time: "11:50 - 12:30", monday: "LUNCH", tuesday: "LUNCH", wednesday: "LUNCH", thursday: "LUNCH", friday: "LUNCH" },
  { time: "12:30 - 13:10", monday: "Agriculture", tuesday: "Computer Sc.", wednesday: "Commerce", thursday: "Shona", friday: "Computer Sc." },
  { time: "13:10 - 13:50", monday: "PE / Sports", tuesday: "Agriculture", wednesday: "PE / Sports", thursday: "Computer Sc.", friday: "PE / Sports" },
];

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

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState("Form 1 A");

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
                        const subject = slot[day as keyof TimetableSlot];
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
