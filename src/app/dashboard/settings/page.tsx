"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, School, User, Bell, Shield, Save } from "lucide-react";
import { toast } from "sonner";
import type { UserRole } from "@/lib/types";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  ministry_admin: "Ministry Admin",
  provincial_admin: "Provincial Admin",
  district_admin: "District Admin",
  school_admin: "School Admin",
  bursar: "Bursar",
  teacher: "Teacher",
  parent: "Parent",
};

export default function SettingsPage() {
  const { user, switchRole } = useAuth();
  const [notifications, setNotifications] = useState({ email: true, sms: false, attendance: true, fees: true });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage school and system configuration" />

      <Tabs defaultValue="school">
        <TabsList className="flex-wrap">
          <TabsTrigger value="school">School Profile</TabsTrigger>
          <TabsTrigger value="account">My Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="roles">Role Switcher</TabsTrigger>
        </TabsList>

        <TabsContent value="school" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><School className="w-4 h-4" /> School Information</CardTitle>
              <CardDescription>Update your school&apos;s profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input defaultValue="Harare High School" />
                </div>
                <div className="space-y-2">
                  <Label>Ministry Code</Label>
                  <Input defaultValue="HAR-SEC-001" />
                </div>
                <div className="space-y-2">
                  <Label>School Type</Label>
                  <Select defaultValue="government">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="mission">Mission</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>School Level</Label>
                  <Select defaultValue="secondary">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="combined">Combined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Province</Label>
                  <Select defaultValue="harare">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="harare">Harare</SelectItem>
                      <SelectItem value="bulawayo">Bulawayo</SelectItem>
                      <SelectItem value="manicaland">Manicaland</SelectItem>
                      <SelectItem value="midlands">Midlands</SelectItem>
                      <SelectItem value="masvingo">Masvingo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>District</Label>
                  <Select defaultValue="harare_central">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="harare_central">Harare Central</SelectItem>
                      <SelectItem value="harare_south">Harare South</SelectItem>
                      <SelectItem value="chitungwiza">Chitungwiza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue="+263 4 700 123" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="info@hararehigh.co.zw" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4" /> My Account</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue={user?.first_name} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue={user?.last_name} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={user?.email} type="email" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue={user?.phone || ""} />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Change Password</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Update Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4" /> Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive email alerts for important events</p>
                </div>
                <Switch checked={notifications.email} onCheckedChange={(c) => setNotifications({ ...notifications, email: c })} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">SMS Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive SMS alerts (charges may apply)</p>
                </div>
                <Switch checked={notifications.sms} onCheckedChange={(c) => setNotifications({ ...notifications, sms: c })} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Attendance Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified when students are marked absent</p>
                </div>
                <Switch checked={notifications.attendance} onCheckedChange={(c) => setNotifications({ ...notifications, attendance: c })} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Fee Payment Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified when payments are received</p>
                </div>
                <Switch checked={notifications.fees} onCheckedChange={(c) => setNotifications({ ...notifications, fees: c })} />
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4" /> Role Switcher (Demo)</CardTitle>
              <CardDescription>Switch between roles to see different dashboard views and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(ROLE_LABELS).map(([role, label]) => (
                  <button
                    key={role}
                    onClick={() => { switchRole(role as UserRole); toast.success(`Switched to ${label}`); }}
                    className={`p-4 rounded-lg border text-left transition-colors hover:bg-muted/50 ${user?.role === role ? "border-primary bg-primary/5" : ""}`}
                  >
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {role === "super_admin" ? "Full system access" :
                       role === "ministry_admin" ? "National oversight" :
                       role === "school_admin" ? "School management" :
                       role === "teacher" ? "Class & marks" :
                       role === "bursar" ? "Finance module" :
                       role === "parent" ? "Child view only" :
                       "Regional oversight"}
                    </p>
                    {user?.role === role && (
                      <Badge className="mt-2 bg-primary text-primary-foreground text-[10px]">Current</Badge>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
