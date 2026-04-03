"use client";

import { mockData } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollText, Search, Download, Filter } from "lucide-react";
import { useState } from "react";

const actionColors: Record<string, string> = {
  create: "bg-emerald-100 text-emerald-800",
  update: "bg-blue-100 text-blue-800",
  delete: "bg-red-100 text-red-800",
  login: "bg-purple-100 text-purple-800",
  logout: "bg-gray-100 text-gray-800",
};

const extendedLogs = [
  ...mockData.auditLogs,
  { id: "al6", user_id: "u3", school_id: "sch1", action: "create", entity_type: "payment", entity_id: "pay2", created_at: "2026-02-21T08:15:00Z", user_name: "Farai Chirwa" },
  { id: "al7", user_id: "u4", school_id: "sch1", action: "create", entity_type: "attendance", entity_id: "att-1-stu2", created_at: "2026-02-21T07:30:00Z", user_name: "Blessing Ncube" },
  { id: "al8", user_id: "u1", school_id: "sch1", action: "update", entity_type: "fee_structure", entity_id: "fs1", created_at: "2026-02-19T14:00:00Z", user_name: "Tendai Moyo" },
  { id: "al9", user_id: "u1", school_id: "sch1", action: "create", entity_type: "announcement", entity_id: "ann1", created_at: "2026-01-20T08:00:00Z", user_name: "Tendai Moyo" },
  { id: "al10", user_id: "u4", school_id: "sch1", action: "create", entity_type: "discipline", entity_id: "disc1", created_at: "2026-02-10T11:00:00Z", user_name: "Blessing Ncube" },
  { id: "al11", user_id: "u3", school_id: "sch1", action: "create", entity_type: "payment", entity_id: "pay3", created_at: "2026-02-18T09:45:00Z", user_name: "Farai Chirwa" },
  { id: "al12", user_id: "u1", school_id: "sch1", action: "login", entity_type: "session", created_at: "2026-02-22T06:28:00Z", user_name: "Tendai Moyo" },
].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filtered = extendedLogs.filter((log) => {
    const matchSearch = search === "" ||
      (log.user_name || "").toLowerCase().includes(search.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="Track all system activities and changes">
        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by user or entity..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={actionFilter} onValueChange={(v) => v && setActionFilter(v)}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-3 h-3 mr-1" />
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Entity ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {new Date(log.created_at).toLocaleString("en-ZW", { dateStyle: "medium", timeStyle: "short" })}
                    </TableCell>
                    <TableCell className="font-medium">{log.user_name}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${actionColors[log.action] || "bg-gray-100 text-gray-800"}`}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{log.entity_type.replace("_", " ")}</TableCell>
                    <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">{log.entity_id || "—"}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No audit logs found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Showing {filtered.length} of {extendedLogs.length} records. All actions are logged automatically for accountability.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
