"use client";

import { useState, useEffect, useCallback } from "react";
import { getStudents } from "@/lib/supabase/queries";
import type { Student } from "@/lib/types";
import { SUBJECTS } from "@/lib/constants";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, ClipboardList, BarChart3, Award } from "lucide-react";
import { toast } from "sonner";

interface ExamEntry {
  id: string;
  name: string;
  type: string;
  term: string;
  maxMark: number;
  status: string;
  date: string;
}

const demoExams: ExamEntry[] = [
  { id: "e1", name: "Mid-Term Test 1", type: "midterm", term: "Term 1", maxMark: 100, status: "completed", date: "2026-02-20" },
  { id: "e2", name: "End of Term 1 Exam", type: "endterm", term: "Term 1", maxMark: 100, status: "active", date: "2026-04-01" },
  { id: "e3", name: "Assignment 1 — English", type: "assignment", term: "Term 1", maxMark: 50, status: "draft", date: "2026-03-15" },
  { id: "e4", name: "Mock Exam — Form 4", type: "mock", term: "Term 1", maxMark: 100, status: "draft", date: "2026-03-25" },
];

function buildDemoMarks(students: Student[]) {
  return students.filter(s => s.status === "active").slice(0, 10).map((s) => {
    const english = 55 + Math.floor(Math.random() * 40);
    const maths = 40 + Math.floor(Math.random() * 50);
    const science = 50 + Math.floor(Math.random() * 45);
    const shona = 60 + Math.floor(Math.random() * 35);
    const total = english + maths + science + shona;
    return { student: `${s.first_name} ${s.last_name}`, english, maths, science, shona, total, average: Math.round(total / 4), position: 0 };
  }).sort((a, b) => b.total - a.total).map((m, i) => ({ ...m, position: i + 1 }));
}

const statusColors: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-800",
  active: "bg-blue-100 text-blue-800",
  draft: "bg-gray-100 text-gray-800",
  published: "bg-purple-100 text-purple-800",
};

export default function ExamsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [exams, setExams] = useState(demoExams);
  const [demoMarks, setDemoMarks] = useState<ReturnType<typeof buildDemoMarks>>([]);

  const fetchStudents = useCallback(async () => {
    try { const data = await getStudents(); setDemoMarks(buildDemoMarks(data)); } catch (e) { console.error(e); }
  }, []);
  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleCreateExam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newExam: ExamEntry = {
      id: `e${Date.now()}`,
      name: form.get("name") as string,
      type: form.get("type") as string,
      term: "Term 1",
      maxMark: parseInt(form.get("max_mark") as string),
      status: "draft",
      date: form.get("date") as string,
    };
    setExams([newExam, ...exams]);
    setShowCreateDialog(false);
    toast.success("Exam created successfully");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Exams & Results" description="Manage examinations, enter marks, and process results">
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="w-4 h-4 mr-2" /> Create Exam
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Exam</DialogTitle>
              <DialogDescription>Set up a new examination for mark entry</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateExam} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Exam Name *</Label>
                <Input id="name" name="name" placeholder="e.g. Mid-Term Test 1" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Exam Type *</Label>
                  <Select name="type" required>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Test</SelectItem>
                      <SelectItem value="midterm">Mid-Term</SelectItem>
                      <SelectItem value="endterm">End of Term</SelectItem>
                      <SelectItem value="mock">Mock Exam</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_mark">Maximum Mark *</Label>
                  <Input id="max_mark" name="max_mark" type="number" defaultValue={100} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Exam Date</Label>
                <Input id="date" name="date" type="date" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                <Button type="submit">Create Exam</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-emerald-800">{exams.length}</p>
            <p className="text-xs text-emerald-600">Total Exams</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <ClipboardList className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-800">{exams.filter(e => e.status === "active").length}</p>
            <p className="text-xs text-blue-600">Active</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-purple-800">72%</p>
            <p className="text-xs text-purple-600">Avg. Pass Rate</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 text-center">
            <Award className="w-6 h-6 text-amber-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-amber-800">68%</p>
            <p className="text-xs text-amber-600">School Average</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="exams">
        <TabsList>
          <TabsTrigger value="exams">Examinations</TabsTrigger>
          <TabsTrigger value="marks">Mark Sheet</TabsTrigger>
        </TabsList>

        <TabsContent value="exams" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Exam Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead>Max Mark</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.name}</TableCell>
                        <TableCell className="capitalize">{exam.type}</TableCell>
                        <TableCell>{exam.term}</TableCell>
                        <TableCell>{exam.maxMark}</TableCell>
                        <TableCell>{exam.date}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[exam.status]}>{exam.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => {
                            toast.info(`Opening mark entry for "${exam.name}"`, { description: "Switch to the Mark Sheet tab to enter marks" });
                          }}>Enter Marks</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mid-Term Test 1 — Form 1 A Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[40px]">Pos</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="text-center">ENG</TableHead>
                      <TableHead className="text-center">MATH</TableHead>
                      <TableHead className="text-center">SCI</TableHead>
                      <TableHead className="text-center">SHO</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">Avg</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoMarks.map((m) => (
                      <TableRow key={m.student}>
                        <TableCell className="font-bold text-center">{m.position}</TableCell>
                        <TableCell className="font-medium">{m.student}</TableCell>
                        <TableCell className="text-center">{m.english}</TableCell>
                        <TableCell className="text-center">{m.maths}</TableCell>
                        <TableCell className="text-center">{m.science}</TableCell>
                        <TableCell className="text-center">{m.shona}</TableCell>
                        <TableCell className="text-center font-bold">{m.total}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={m.average >= 60 ? "bg-emerald-100 text-emerald-800" : m.average >= 45 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}>
                            {m.average}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
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
