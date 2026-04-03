"use client";

import { useState, useEffect, useCallback } from "react";
import { getAnnouncements } from "@/lib/supabase/queries";
import { supabase } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Bell, Send, Plus, Megaphone, Phone } from "lucide-react";
import { toast } from "sonner";
import type { Announcement } from "@/lib/types";

const priorityColors: Record<string, string> = {
  normal: "bg-gray-100 text-gray-800",
  high: "bg-amber-100 text-amber-800",
  urgent: "bg-red-100 text-red-800",
};

const audienceColors: Record<string, string> = {
  all: "bg-blue-100 text-blue-800",
  parents: "bg-purple-100 text-purple-800",
  teachers: "bg-emerald-100 text-emerald-800",
  students: "bg-amber-100 text-amber-800",
  staff: "bg-cyan-100 text-cyan-800",
};

const smsLog = [
  { id: "sms1", to: "+263 77 456 7890", message: "Fee reminder: $150 outstanding for Term 1. Please pay by 28 Feb.", status: "delivered", date: "2026-02-20" },
  { id: "sms2", to: "+263 71 234 5678", message: "Your child was absent from school today (20 Feb). Please contact the school.", status: "delivered", date: "2026-02-20" },
  { id: "sms3", to: "+263 73 345 6789", message: "Reminder: Parent-Teacher meeting on Saturday 22 Feb at 9:00 AM.", status: "pending", date: "2026-02-21" },
];

export default function CommunicationsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const fetchData = useCallback(async () => {
    try { const data = await getAnnouncements(); setAnnouncements(data); } catch (e) { console.error(e); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);
  const [showDialog, setShowDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const newAnn: Announcement = {
      id: `ann${Date.now()}`,
      school_id: "sch1",
      title: form.get("title") as string,
      content: form.get("content") as string,
      target_audience: form.get("audience") as Announcement["target_audience"],
      priority: form.get("priority") as Announcement["priority"],
      published_by: "u1",
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("announcements").insert(newAnn);
    if (error) { toast.error("Failed to publish", { description: error.message }); setSubmitting(false); return; }
    setAnnouncements([newAnn, ...announcements]);
    setShowDialog(false);
    setSubmitting(false);
    toast.success("Announcement published", { description: newAnn.title });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Communications" description="Announcements, messages, and notifications">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="w-4 h-4 mr-2" /> New Announcement
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>Publish a new announcement to the school community</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" placeholder="e.g. School Assembly Notice" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea id="content" name="content" rows={4} placeholder="Enter announcement details..." required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Audience *</Label>
                  <Select name="audience" required>
                    <SelectTrigger><SelectValue placeholder="Select audience" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Everyone</SelectItem>
                      <SelectItem value="parents">Parents</SelectItem>
                      <SelectItem value="teachers">Teachers</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority *</Label>
                  <Select name="priority" required>
                    <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)} disabled={submitting}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  <Send className="w-4 h-4 mr-2" /> {submitting ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Megaphone className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-xl font-bold text-blue-800">{announcements.length}</p>
              <p className="text-xs text-blue-600">Announcements</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Phone className="w-6 h-6 text-emerald-600" />
            <div>
              <p className="text-xl font-bold text-emerald-800">{smsLog.length}</p>
              <p className="text-xs text-emerald-600">SMS Sent</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Bell className="w-6 h-6 text-amber-600" />
            <div>
              <p className="text-xl font-bold text-amber-800">12</p>
              <p className="text-xs text-amber-600">Notifications</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="announcements">
        <TabsList>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="sms">SMS Log</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="mt-4 space-y-4">
          {announcements.map((ann) => (
            <Card key={ann.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{ann.title}</h3>
                      <Badge className={priorityColors[ann.priority]}>{ann.priority}</Badge>
                      <Badge className={audienceColors[ann.target_audience]}>{ann.target_audience}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{ann.content}</p>
                    <p className="text-xs text-muted-foreground">
                      Published {ann.published_at ? new Date(ann.published_at).toLocaleDateString() : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sms" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="w-4 h-4" /> SMS / WhatsApp Log (Simulated)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {smsLog.map((sms) => (
                <div key={sms.id} className="p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-mono">{sms.to}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{sms.date}</span>
                      <Badge className={sms.status === "delivered" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                        {sms.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{sms.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
