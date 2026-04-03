"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { getStudents } from "@/lib/supabase/queries";
import { supabase } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Download, Eye, Edit, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Student } from "@/lib/types";
import { GRADES } from "@/lib/constants";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 15;

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-gray-100 text-gray-800",
  transferred: "bg-blue-100 text-blue-800",
  graduated: "bg-purple-100 text-purple-800",
  expelled: "bg-red-100 text-red-800",
};

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchStudents = useCallback(async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (e) { console.error("Failed to load students:", e); }
    finally { setIsLoadingData(false); }
  }, []);
  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        search === "" ||
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        s.zems_id.toLowerCase().includes(search.toLowerCase());
      const matchGrade = gradeFilter === "all" || s.grade_name === gradeFilter;
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchGender = genderFilter === "all" || s.gender === genderFilter;
      return matchSearch && matchGrade && matchStatus && matchGender;
    });
  }, [students, search, gradeFilter, statusFilter, genderFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newStudent: Student = {
      id: `stu${Date.now()}`,
      zems_id: `ZEMS-2026-${String(students.length + 1).padStart(6, "0")}`,
      school_id: "sch1",
      first_name: form.get("first_name") as string,
      last_name: form.get("last_name") as string,
      date_of_birth: form.get("date_of_birth") as string,
      gender: form.get("gender") as "male" | "female",
      nationality: "Zimbabwean",
      has_special_needs: form.get("special_needs") === "on",
      enrollment_date: new Date().toISOString().split("T")[0],
      enrollment_type: "new",
      status: "active",
      is_orphan: form.get("is_orphan") === "on",
      is_beam_beneficiary: form.get("is_beam") === "on",
      grade_name: form.get("grade") as string,
      stream_name: `${form.get("grade")} A`,
      guardian_name: form.get("guardian_name") as string,
      guardian_phone: form.get("guardian_phone") as string,
      address: form.get("address") as string,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("students").insert(newStudent);
    if (error) { toast.error("Failed to enroll student", { description: error.message }); return; }
    setStudents([newStudent, ...students]);
    setShowAddDialog(false);
    toast.success("Student enrolled successfully", { description: `${newStudent.first_name} ${newStudent.last_name} — ${newStudent.zems_id}` });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Student Management" description={`${filtered.length} students found`}>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="w-4 h-4 mr-2" /> Enroll Student
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Enroll New Student</DialogTitle>
              <DialogDescription>Enter student details to create a new enrollment record</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input id="first_name" name="first_name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input id="last_name" name="last_name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth *</Label>
                  <Input id="date_of_birth" name="date_of_birth" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select name="gender" required>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade / Form *</Label>
                  <Select name="grade" required>
                    <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                    <SelectContent>
                      {GRADES.filter(g => g.school_level === "secondary").map((g) => (
                        <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="home_language">Home Language</Label>
                  <Select name="home_language">
                    <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shona">Shona</SelectItem>
                      <SelectItem value="ndebele">Ndebele</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Home Address</Label>
                  <Textarea id="address" name="address" rows={2} />
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h4 className="font-semibold text-sm">Guardian / Parent Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guardian_name">Guardian Name *</Label>
                    <Input id="guardian_name" name="guardian_name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardian_phone">Guardian Phone *</Label>
                    <Input id="guardian_phone" name="guardian_phone" placeholder="+263 7X XXX XXXX" required />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <h4 className="font-semibold text-sm">Additional Information</h4>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox name="is_orphan" /> Orphan / Vulnerable Child
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox name="is_beam" /> BEAM Beneficiary
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox name="special_needs" /> Special Needs
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button type="submit">Enroll Student</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ZEMS ID..."
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={gradeFilter} onValueChange={(v) => { if (v) { setGradeFilter(v); setPage(1); } }}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="w-3 h-3 mr-1" />
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="Form 1">Form 1</SelectItem>
                  <SelectItem value="Form 2">Form 2</SelectItem>
                  <SelectItem value="Form 3">Form 3</SelectItem>
                  <SelectItem value="Form 4">Form 4</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { if (v) { setStatusFilter(v); setPage(1); } }}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
              <Select value={genderFilter} onValueChange={(v) => { if (v) { setGenderFilter(v); setPage(1); } }}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[140px]">ZEMS ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Gender</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className="hidden lg:table-cell">Guardian</TableHead>
                  <TableHead className="hidden lg:table-cell">BEAM</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">{student.zems_id}</TableCell>
                    <TableCell className="font-medium">{student.first_name} {student.last_name}</TableCell>
                    <TableCell className="hidden md:table-cell capitalize">{student.gender}</TableCell>
                    <TableCell>{student.grade_name}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{student.guardian_name}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {student.is_beam_beneficiary && <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-800">BEAM</Badge>}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${statusColors[student.status] || ""}`} variant="secondary">
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link href={`/dashboard/students/${student.id}`}>
                          <Button variant="ghost" size="icon" className="w-7 h-7">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="w-7 h-7">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No students found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="w-8 h-8" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <Button key={p} variant={page === p ? "default" : "outline"} size="icon" className="w-8 h-8" onClick={() => setPage(p)}>
                      {p}
                    </Button>
                  );
                })}
                <Button variant="outline" size="icon" className="w-8 h-8" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
