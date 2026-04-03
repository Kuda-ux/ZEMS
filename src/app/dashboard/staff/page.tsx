"use client";

import { useState, useEffect, useCallback } from "react";
import { getStaff } from "@/lib/supabase/queries";
import { supabase } from "@/lib/supabase/client";
import type { StaffMember } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, UserCheck, Briefcase, GraduationCap, Plus, Search, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  on_leave: "bg-amber-100 text-amber-800",
  resigned: "bg-red-100 text-red-800",
};

const typeColors: Record<string, string> = {
  teaching: "bg-blue-100 text-blue-800",
  non_teaching: "bg-purple-100 text-purple-800",
  administrative: "bg-emerald-100 text-emerald-800",
};

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  const fetchData = useCallback(async () => {
    try { const data = await getStaff(); setStaff(data); } catch (e) { console.error(e); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = staff.filter(s =>
    search === "" || s.name.toLowerCase().includes(search.toLowerCase()) || s.position.toLowerCase().includes(search.toLowerCase())
  );

  const teaching = staff.filter(s => s.staff_type === "teaching").length;
  const nonTeaching = staff.filter(s => s.staff_type === "non_teaching").length;
  const admin = staff.filter(s => s.staff_type === "administrative").length;

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newMember: StaffMember = {
      id: `st${Date.now()}`,
      school_id: "sch1",
      name: form.get("name") as string,
      email: form.get("email") as string,
      phone: form.get("phone") as string,
      position: form.get("position") as string,
      department: form.get("department") as string,
      staff_type: form.get("staff_type") as StaffMember["staff_type"],
      qualification: form.get("qualification") as string,
      date_joined: new Date().toISOString().split("T")[0],
      status: "active",
    };
    const { error } = await supabase.from("staff").insert(newMember);
    if (error) { toast.error("Failed to add staff", { description: error.message }); return; }
    setStaff([newMember, ...staff]);
    setShowDialog(false);
    toast.success("Staff member added", { description: `${newMember.name} — ${newMember.position}` });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Staff Management" description={`${staff.length} staff members`}>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="w-4 h-4 mr-2" /> Add Staff
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Staff Member</DialogTitle>
              <DialogDescription>Register a new staff member</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" placeholder="e.g. Grace Maposa" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input id="position" name="position" placeholder="e.g. Mathematics Teacher" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" placeholder="name@school.co.zw" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" name="phone" placeholder="+263 7X XXX XXXX" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Staff Type *</Label>
                  <Select name="staff_type" required>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teaching">Teaching</SelectItem>
                      <SelectItem value="non_teaching">Non-Teaching</SelectItem>
                      <SelectItem value="administrative">Administrative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select name="department" required>
                    <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                    <SelectContent>
                      {["Administration", "Sciences", "Mathematics", "Languages", "Humanities", "Technology", "Finance", "Sports & Culture", "Maintenance"].map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input id="qualification" name="qualification" placeholder="e.g. B.Ed Mathematics" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button type="submit">Add Staff Member</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-800">{staff.length}</p>
              <p className="text-xs text-blue-600">Total Staff</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-emerald-800">{teaching}</p>
              <p className="text-xs text-emerald-600">Teaching</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-800">{nonTeaching}</p>
              <p className="text-xs text-purple-600">Non-Teaching</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-amber-800">{admin}</p>
              <p className="text-xs text-amber-600">Administration</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative mb-4 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search staff..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden lg:table-cell">Qualification</TableHead>
                  <TableHead className="hidden lg:table-cell">Contact</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>{staff.position}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{staff.department}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${typeColors[staff.staff_type]}`}>{staff.staff_type.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{staff.qualification || '—'}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />{staff.phone || '—'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${statusColors[staff.status]}`}>{staff.status.replace("_", " ")}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
