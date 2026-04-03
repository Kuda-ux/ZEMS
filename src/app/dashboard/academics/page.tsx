"use client";

import { mockData } from "@/lib/mock-data";
import { GRADES, SUBJECTS } from "@/lib/constants";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Users, GraduationCap, Plus, Calendar } from "lucide-react";

export default function AcademicsPage() {
  const streams = mockData.streams;
  const secondaryGrades = GRADES.filter(g => g.school_level === "secondary");
  const secondarySubjects = SUBJECTS.filter(s => s.school_level === "secondary" || s.school_level === "both");

  return (
    <div className="space-y-6">
      <PageHeader title="Academic Structure" description="Manage classes, streams, subjects, and curriculum">
        <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Class</Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-emerald-800">{secondaryGrades.length}</p>
              <p className="text-xs text-emerald-600">Grade Levels</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-800">{streams.length}</p>
              <p className="text-xs text-blue-600">Class Streams</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-amber-800">{secondarySubjects.length}</p>
              <p className="text-xs text-amber-600">Subjects</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="classes">
        <TabsList>
          <TabsTrigger value="classes">Classes & Streams</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="academic-year">Academic Year</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {secondaryGrades.map((grade) => {
              const gradeStreams = streams.filter(s => s.grade_name === grade.name);
              return (
                <Card key={grade.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>{grade.name}</span>
                      <Badge variant="secondary">{gradeStreams.length} streams</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {gradeStreams.map((stream) => (
                      <div key={stream.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                        <div>
                          <p className="font-medium text-sm">{stream.name}</p>
                          <p className="text-xs text-muted-foreground">Capacity: {stream.capacity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                            {stream.student_count || 0} students
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {gradeStreams.length === 0 && (
                      <p className="text-sm text-muted-foreground py-2">No streams configured</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Code</TableHead>
                      <TableHead>Subject Name</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Compulsory</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {secondarySubjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell className="font-mono text-xs">{subject.code}</TableCell>
                        <TableCell className="font-medium">{subject.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs capitalize">{subject.school_level}</Badge>
                        </TableCell>
                        <TableCell>
                          {subject.is_compulsory ? (
                            <Badge className="bg-emerald-100 text-emerald-800 text-xs">Required</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Elective</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic-year" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Academic Year 2026
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Term 1", start: "14 January 2026", end: "9 April 2026", status: "current" },
                { name: "Term 2", start: "5 May 2026", end: "7 August 2026", status: "upcoming" },
                { name: "Term 3", start: "8 September 2026", end: "4 December 2026", status: "upcoming" },
              ].map((term) => (
                <div key={term.name} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">{term.name}</p>
                    <p className="text-sm text-muted-foreground">{term.start} — {term.end}</p>
                  </div>
                  <Badge className={term.status === "current" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}>
                    {term.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
