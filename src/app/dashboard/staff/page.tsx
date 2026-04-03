"use client";

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
import { useState } from "react";
import { toast } from "sonner";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  staffType: "teaching" | "non_teaching" | "administrative";
  qualification: string;
  dateJoined: string;
  status: "active" | "on_leave" | "resigned";
}

const demoStaff: StaffMember[] = [
  { id: "st1", name: "Tendai Moyo", email: "admin@zems.gov.zw", phone: "+263 77 123 4567", position: "Head Teacher", department: "Administration", staffType: "administrative", qualification: "M.Ed Administration", dateJoined: "2018-01-10", status: "active" },
  { id: "st2", name: "Blessing Ncube", email: "b.ncube@school.co.zw", phone: "+263 73 345 6789", position: "Senior Teacher", department: "Sciences", staffType: "teaching", qualification: "B.Ed Science", dateJoined: "2019-05-15", status: "active" },
  { id: "st3", name: "Farai Chirwa", email: "f.chirwa@school.co.zw", phone: "+263 71 234 5678", position: "Bursar", department: "Finance", staffType: "administrative", qualification: "B.Com Accounting", dateJoined: "2020-01-06", status: "active" },
  { id: "st4", name: "Grace Maposa", email: "g.maposa@school.co.zw", phone: "+263 77 456 1234", position: "English Teacher", department: "Languages", staffType: "teaching", qualification: "B.A English", dateJoined: "2021-01-11", status: "active" },
  { id: "st5", name: "Simbarashe Dube", email: "s.dube@school.co.zw", phone: "+263 71 567 8901", position: "Mathematics Teacher", department: "Mathematics", staffType: "teaching", qualification: "B.Sc Mathematics", dateJoined: "2020-05-04", status: "active" },
  { id: "st6", name: "Rumbidzai Gumbo", email: "r.gumbo@school.co.zw", phone: "+263 73 678 2345", position: "History Teacher", department: "Humanities", staffType: "teaching", qualification: "B.Ed History", dateJoined: "2019-09-02", status: "active" },
  { id: "st7", name: "Tafadzwa Phiri", email: "t.phiri@school.co.zw", phone: "+263 77 789 3456", position: "Sports Director", department: "Sports & Culture", staffType: "teaching", qualification: "Dip. Physical Education", dateJoined: "2022-01-10", status: "active" },
  { id: "st8", name: "Nyasha Banda", email: "n.banda@school.co.zw", phone: "+263 71 890 4567", position: "ICT Teacher", department: "Technology", staffType: "teaching", qualification: "B.Sc Computer Science", dateJoined: "2023-01-09", status: "active" },
  { id: "st9", name: "Chiedza Zvobgo", email: "c.zvobgo@school.co.zw", phone: "+263 73 901 5678", position: "Shona Teacher", department: "Languages", staffType: "teaching", qualification: "B.A Shona", dateJoined: "2021-05-03", status: "on_leave" },
  { id: "st10", name: "Prosper Mhaka", email: "p.mhaka@school.co.zw", phone: "+263 77 012 6789", position: "Lab Technician", department: "Sciences", staffType: "non_teaching", qualification: "Dip. Laboratory Science", dateJoined: "2022-09-05", status: "active" },
  { id: "st11", name: "Fortune Marufu", email: "f.marufu@school.co.zw", phone: "+263 71 123 7890", position: "Secretary", department: "Administration", staffType: "non_teaching", qualification: "Dip. Secretarial Studies", dateJoined: "2020-03-02", status: "active" },
  { id: "st12", name: "Innocent Gonese", email: "i.gonese@school.co.zw", phone: "+263 73 234 8901", position: "Groundskeeper", department: "Maintenance", staffType: "non_teaching", qualification: "—", dateJoined: "2017-06-12", status: "active" },
];

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
  const [staff, setStaff] = useState(demoStaff);
  const [showDialog, setShowDialog] = useState(false);

  const filtered = staff.filter(s =>
    search === "" || s.name.toLowerCase().includes(search.toLowerCase()) || s.position.toLowerCase().includes(search.toLowerCase())
  );

  const teaching = staff.filter(s => s.staffType === "teaching").length;
  const nonTeaching = staff.filter(s => s.staffType === "non_teaching").length;
  const admin = staff.filter(s => s.staffType === "administrative").length;

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newMember: StaffMember = {
      id: `st${Date.now()}`,
      name: form.get("name") as string,
      email: form.get("email") as string,
      phone: form.get("phone") as string,
      position: form.get("position") as string,
      department: form.get("department") as string,
      staffType: form.get("staff_type") as StaffMember["staffType"],
      qualification: form.get("qualification") as string,
      dateJoined: new Date().toISOString().split("T")[0],
      status: "active",
    };
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
                      <Badge className={`text-[10px] ${typeColors[staff.staffType]}`}>{staff.staffType.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{staff.qualification}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />{staff.phone}
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
