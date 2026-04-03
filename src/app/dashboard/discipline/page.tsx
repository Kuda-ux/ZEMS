"use client";

import { useState, useEffect, useCallback } from "react";
import { getDisciplineRecords, getStudents } from "@/lib/supabase/queries";
import { supabase } from "@/lib/supabase/client";
import { INCIDENT_TYPES } from "@/lib/constants";
import type { Student } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShieldAlert, Plus, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import type { DisciplineRecord } from "@/lib/types";

const severityColors: Record<string, string> = {
  minor: "bg-amber-100 text-amber-800",
  moderate: "bg-orange-100 text-orange-800",
  major: "bg-red-100 text-red-800",
  critical: "bg-red-200 text-red-900",
};

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-800",
  resolved: "bg-emerald-100 text-emerald-800",
  escalated: "bg-red-100 text-red-800",
};

export default function DisciplinePage() {
  const [records, setRecords] = useState<DisciplineRecord[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilterVal, setStatusFilterVal] = useState("all");

  const fetchData = useCallback(async () => {
    try {
      const [d, s] = await Promise.all([getDisciplineRecords(), getStudents()]);
      setRecords(d); setAllStudents(s);
    } catch (e) { console.error(e); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const stu = allStudents.find(s => s.id === form.get("student_id"));
    const newRecord: DisciplineRecord = {
      id: `disc${Date.now()}`,
      school_id: "sch1",
      student_id: form.get("student_id") as string,
      date: form.get("date") as string,
      incident_type: form.get("type") as string,
      severity: form.get("severity") as DisciplineRecord["severity"],
      description: form.get("description") as string,
      action_taken: form.get("action") as string,
      reported_by: "u4",
      parent_notified: false,
      status: "open",
      student_name: stu ? `${stu.first_name} ${stu.last_name}` : "Unknown",
    };
    const { error } = await supabase.from("discipline_records").insert(newRecord);
    if (error) { toast.error("Failed to record incident", { description: error.message }); setSubmitting(false); return; }
    setRecords([newRecord, ...records]);
    setShowDialog(false);
    setSubmitting(false);
    toast.success("Incident recorded", { description: `${newRecord.incident_type} — ${newRecord.student_name}` });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Discipline Tracking" description="Record and manage student disciplinary incidents">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="w-4 h-4 mr-2" /> Log Incident
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Log Disciplinary Incident</DialogTitle>
              <DialogDescription>Record a new disciplinary event</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Student *</Label>
                <Select name="student_id" required>
                  <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>
                    {allStudents.filter(s => s.status === "active").slice(0, 20).map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Incident Type *</Label>
                  <Select name="type" required>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {INCIDENT_TYPES.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Severity *</Label>
                  <Select name="severity" required>
                    <SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" name="description" rows={3} placeholder="Describe the incident in detail..." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="action">Action Taken</Label>
                <Textarea id="action" name="action" rows={2} placeholder="e.g. Verbal warning, detention, parent meeting..." />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)} disabled={submitting}>Cancel</Button>
                <Button type="submit" disabled={submitting}>{submitting ? "Recording..." : "Record Incident"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-xl font-bold text-blue-800">{records.filter(r => r.status === "open").length}</p>
              <p className="text-xs text-blue-600">Open</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <div>
              <p className="text-xl font-bold text-emerald-800">{records.filter(r => r.status === "resolved").length}</p>
              <p className="text-xs text-emerald-600">Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-xl font-bold text-red-800">{records.filter(r => r.severity === "major" || r.severity === "critical").length}</p>
              <p className="text-xs text-red-600">Serious</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Input placeholder="Search by student or incident..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            <Select value={severityFilter} onValueChange={(v) => v && setSeverityFilter(v)}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilterVal} onValueChange={(v) => v && setStatusFilterVal(v)}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Incident</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="hidden md:table-cell">Action Taken</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.filter(r => {
                  const matchSearch = search === "" || (r.student_name || "").toLowerCase().includes(search.toLowerCase()) || r.incident_type.toLowerCase().includes(search.toLowerCase());
                  const matchSeverity = severityFilter === "all" || r.severity === severityFilter;
                  const matchStatus = statusFilterVal === "all" || r.status === statusFilterVal;
                  return matchSearch && matchSeverity && matchStatus;
                }).map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm">{r.date}</TableCell>
                    <TableCell className="font-medium">{r.student_name}</TableCell>
                    <TableCell>{r.incident_type}</TableCell>
                    <TableCell><Badge className={severityColors[r.severity]}>{r.severity}</Badge></TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">{r.action_taken || "—"}</TableCell>
                    <TableCell><Badge className={statusColors[r.status]}>{r.status}</Badge></TableCell>
                  </TableRow>
                ))}
                {records.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No disciplinary records</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
