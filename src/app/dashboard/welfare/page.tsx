"use client";

import { useState, useEffect, useCallback } from "react";
import { getStudents } from "@/lib/supabase/queries";
import type { Student } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, Users, ShieldCheck, Utensils, Plus } from "lucide-react";

const welfareRecords = [
  { id: "w1", student: "Tatenda Moyo", category: "BEAM", support: "Full tuition coverage", status: "active", since: "2026-01-15" },
  { id: "w2", student: "Kudzai Dube", category: "OVC", support: "School supplies & uniform", status: "active", since: "2025-09-01" },
  { id: "w3", student: "Fadzai Sibanda", category: "Feeding", support: "School feeding programme", status: "active", since: "2026-01-15" },
  { id: "w4", student: "Simbarashe Mpofu", category: "Counseling", support: "Weekly counseling sessions", status: "active", since: "2026-02-01" },
  { id: "w5", student: "Ruvimbo Nkomo", category: "Disability", support: "Wheelchair access & assisted learning", status: "active", since: "2025-01-10" },
  { id: "w6", student: "Tapiwanashe Chirwa", category: "OVC", support: "Orphan — grandparent guardian", status: "active", since: "2026-01-15" },
  { id: "w7", student: "Nokutenda Mutasa", category: "BEAM", support: "Government subsidy — Term 1", status: "active", since: "2026-01-15" },
  { id: "w8", student: "Panashe Chigumba", category: "Health", support: "Chronic asthma — medication on site", status: "active", since: "2025-05-20" },
];

const categoryColors: Record<string, string> = {
  BEAM: "bg-amber-100 text-amber-800",
  OVC: "bg-purple-100 text-purple-800",
  Feeding: "bg-emerald-100 text-emerald-800",
  Counseling: "bg-blue-100 text-blue-800",
  Disability: "bg-rose-100 text-rose-800",
  Health: "bg-cyan-100 text-cyan-800",
};

export default function WelfarePage() {
  const [students, setStudents] = useState<Student[]>([]);

  const fetchData = useCallback(async () => {
    try { const data = await getStudents(); setStudents(data); } catch (e) { console.error(e); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const beamCount = students.filter(s => s.is_beam_beneficiary && s.status === "active").length;
  const orphanCount = students.filter(s => s.is_orphan && s.status === "active").length;
  const specialNeedsCount = students.filter(s => s.has_special_needs && s.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Welfare & Inclusion" description="Track vulnerable students and support programmes">
        <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Record</Button>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-amber-800">{beamCount}</p>
              <p className="text-xs text-amber-600">BEAM Beneficiaries</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Heart className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-800">{orphanCount}</p>
              <p className="text-xs text-purple-600">Orphans / OVC</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-800">{specialNeedsCount}</p>
              <p className="text-xs text-blue-600">Special Needs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Utensils className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-emerald-800">15</p>
              <p className="text-xs text-emerald-600">Feeding Programme</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Welfare Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Student</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Support Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Since</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {welfareRecords.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.student}</TableCell>
                    <TableCell>
                      <Badge className={categoryColors[r.category] || "bg-gray-100 text-gray-800"}>{r.category}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.support}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{r.since}</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-800">{r.status}</Badge>
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
