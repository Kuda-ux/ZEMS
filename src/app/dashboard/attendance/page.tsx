"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { getStudents, getStreams, getAttendanceRecords } from "@/lib/supabase/queries";
import { supabase } from "@/lib/supabase/client";
import type { Student, Stream, AttendanceRecord } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Clock, AlertCircle, Save, Users, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import type { AttendanceStatus } from "@/lib/types";

const statusConfig: Record<AttendanceStatus, { icon: React.ComponentType<{className?: string}>; color: string; bg: string }> = {
  present: { icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-100" },
  absent: { icon: XCircle, color: "text-red-700", bg: "bg-red-100" },
  late: { icon: Clock, color: "text-amber-700", bg: "bg-amber-100" },
  excused: { icon: AlertCircle, color: "text-blue-700", bg: "bg-blue-100" },
};

export default function AttendancePage() {
  const [selectedStream, setSelectedStream] = useState("str1");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [markingData, setMarkingData] = useState<Record<string, AttendanceStatus>>({});
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [s, st, att] = await Promise.all([getStudents(), getStreams(), getAttendanceRecords()]);
      setAllStudents(s); setStreams(st); setAllAttendance(att);
    } catch (e) { console.error(e); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const streamStudents = useMemo(() => {
    const stream = streams.find(s => s.id === selectedStream);
    if (!stream) return [];
    return allStudents.filter(s => s.status === "active" && s.stream_name === stream.name).slice(0, 30);
  }, [selectedStream, streams, allStudents]);

  const existingRecords = useMemo(() => {
    const records: Record<string, AttendanceStatus> = {};
    allAttendance
      .filter(a => a.date === selectedDate && a.stream_id === selectedStream)
      .forEach(a => { records[a.student_id] = a.status; });
    return records;
  }, [selectedDate, selectedStream, allAttendance]);

  const getStatus = (studentId: string): AttendanceStatus => {
    return markingData[studentId] || existingRecords[studentId] || "present";
  };

  const toggleStatus = (studentId: string) => {
    const current = getStatus(studentId);
    const order: AttendanceStatus[] = ["present", "absent", "late", "excused"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    setMarkingData(prev => ({ ...prev, [studentId]: next }));
  };

  const markAll = (status: AttendanceStatus) => {
    const data: Record<string, AttendanceStatus> = {};
    streamStudents.forEach(s => { data[s.id] = status; });
    setMarkingData(data);
  };

  const handleSave = async () => {
    const records = streamStudents.map(s => ({
      id: `att-${selectedDate}-${s.id}`,
      school_id: "sch1",
      student_id: s.id,
      stream_id: selectedStream,
      date: selectedDate,
      status: getStatus(s.id),
      marked_by: "u4",
      student_name: `${s.first_name} ${s.last_name}`,
    }));
    const { error } = await supabase.from("attendance_records").upsert(records, { onConflict: "id" });
    if (error) { toast.error("Failed to save", { description: error.message }); return; }
    toast.success("Attendance saved successfully", {
      description: `${streamStudents.length} records saved for ${selectedDate}`,
    });
    fetchData();
  };

  const todayRecords = allAttendance.filter(a => a.date === selectedDate);
  const todayPresent = todayRecords.filter(a => a.status === "present" || a.status === "late").length;
  const todayAbsent = todayRecords.filter(a => a.status === "absent").length;
  const todayLate = todayRecords.filter(a => a.status === "late").length;
  const todayRate = todayRecords.length > 0 ? Math.round((todayPresent / todayRecords.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Mark and manage daily student attendance">
        <Button onClick={handleSave} size="sm">
          <Save className="w-4 h-4 mr-2" /> Save Attendance
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-emerald-800">{todayPresent}</p>
              <p className="text-xs text-emerald-600">Present</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-800">{todayAbsent}</p>
              <p className="text-xs text-red-600">Absent</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-8 h-8 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-amber-800">{todayLate}</p>
              <p className="text-xs text-amber-600">Late</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-800">{todayRate}%</p>
              <p className="text-xs text-blue-600">Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mark">
        <TabsList>
          <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
          <TabsTrigger value="records">View Records</TabsTrigger>
        </TabsList>

        <TabsContent value="mark" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <Select value={selectedStream} onValueChange={(v) => v && setSelectedStream(v)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {streams.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-1 ml-auto">
                  <Button variant="outline" size="sm" onClick={() => markAll("present")} className="text-emerald-700">All Present</Button>
                  <Button variant="outline" size="sm" onClick={() => markAll("absent")} className="text-red-700">All Absent</Button>
                </div>
              </div>

              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[40px]">#</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="hidden sm:table-cell">ZEMS ID</TableHead>
                      <TableHead className="w-[120px] text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {streamStudents.map((student, idx) => {
                      const status = getStatus(student.id);
                      const config = statusConfig[status];
                      const Icon = config.icon;
                      return (
                        <TableRow key={student.id} className="hover:bg-muted/30">
                          <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                          <TableCell className="font-medium">{student.first_name} {student.last_name}</TableCell>
                          <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">{student.zems_id}</TableCell>
                          <TableCell className="text-center">
                            <button
                              onClick={() => toggleStatus(student.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${config.bg} ${config.color}`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              {status}
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {streamStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No students found for this class
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attendance Records — {selectedDate}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allAttendance.slice(0, 20).map((record) => {
                      const config = statusConfig[record.status];
                      return (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.student_name}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">Form 1 A</TableCell>
                          <TableCell className="text-sm">{record.date}</TableCell>
                          <TableCell>
                            <Badge className={`${config.bg} ${config.color}`}>{record.status}</Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{record.reason || "—"}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
