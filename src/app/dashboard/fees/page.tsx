"use client";

import { useState, useMemo } from "react";
import { mockData } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, DollarSign, AlertTriangle, CheckCircle, Plus, Search, Download, Receipt, Printer } from "lucide-react";
import { PAYMENT_METHODS } from "@/lib/constants";
import { toast } from "sonner";
import type { Payment } from "@/lib/types";

const statusColors: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  partial: "bg-amber-100 text-amber-800",
  pending: "bg-red-100 text-red-800",
  overdue: "bg-red-200 text-red-900",
  waived: "bg-blue-100 text-blue-800",
};

export default function FeesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [payments, setPayments] = useState<Payment[]>(mockData.payments);
  const [selectedInvoice, setSelectedInvoice] = useState<string>("");

  const invoices = mockData.invoices;
  const totalBilled = invoices.reduce((s, i) => s + i.total_amount, 0);
  const totalCollected = invoices.reduce((s, i) => s + i.paid_amount, 0);
  const totalOutstanding = invoices.reduce((s, i) => s + i.balance, 0);
  const paidCount = invoices.filter(i => i.status === "paid").length;

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch = search === "" ||
        inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
        (inv.student_name || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, search, statusFilter]);

  const handleRecordPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const inv = invoices.find(i => i.id === selectedInvoice);
    if (!inv) return;

    const newPayment: Payment = {
      id: `pay${Date.now()}`,
      receipt_number: `RCT-2026-${String(payments.length + 1).padStart(5, "0")}`,
      school_id: "sch1",
      invoice_id: inv.id,
      student_id: inv.student_id,
      amount: parseFloat(form.get("amount") as string),
      payment_method: form.get("method") as Payment["payment_method"],
      reference_number: form.get("reference") as string || undefined,
      payment_date: form.get("date") as string,
      received_by: "u3",
      status: "confirmed",
      student_name: inv.student_name,
    };
    setPayments([newPayment, ...payments]);
    setShowPaymentDialog(false);
    toast.success("Payment recorded successfully", {
      description: `Receipt ${newPayment.receipt_number} — $${newPayment.amount}`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Fees & Finance" description="Manage student billing, payments, and financial records">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="w-4 h-4 mr-2" /> Record Payment
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogDescription>Record a new payment against a student invoice</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="space-y-2">
                <Label>Student Invoice *</Label>
                <Select value={selectedInvoice} onValueChange={(v) => v && setSelectedInvoice(v)} required>
                  <SelectTrigger><SelectValue placeholder="Select invoice" /></SelectTrigger>
                  <SelectContent>
                    {invoices.filter(i => i.status !== "paid").map((inv) => (
                      <SelectItem key={inv.id} value={inv.id}>
                        {inv.invoice_number} — {inv.student_name} (Balance: ${inv.balance})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($) *</Label>
                  <Input id="amount" name="amount" type="number" step="0.01" min="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Payment Date *</Label>
                  <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Payment Method *</Label>
                  <Select name="method" required>
                    <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference Number</Label>
                  <Input id="reference" name="reference" placeholder="e.g. EcoCash ref" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
                <Button type="submit">Record Payment</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Billed" value={`$${totalBilled.toLocaleString()}`} icon={DollarSign} iconColor="text-blue-700" iconBg="bg-blue-100" />
        <StatCard title="Total Collected" value={`$${totalCollected.toLocaleString()}`} change={`${Math.round((totalCollected / totalBilled) * 100)}% collection rate`} changeType="positive" icon={CheckCircle} iconColor="text-emerald-700" iconBg="bg-emerald-100" />
        <StatCard title="Outstanding" value={`$${totalOutstanding.toLocaleString()}`} change={`${invoices.length - paidCount} invoices pending`} changeType="negative" icon={AlertTriangle} iconColor="text-amber-700" iconBg="bg-amber-100" />
        <StatCard title="Fully Paid" value={paidCount} change={`of ${invoices.length} invoices`} changeType="neutral" icon={Wallet} iconColor="text-purple-700" iconBg="bg-purple-100" />
      </div>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search by invoice number or student name..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden md:table-cell">Grade</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.slice(0, 20).map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-xs">{inv.invoice_number}</TableCell>
                        <TableCell className="font-medium">{inv.student_name}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{inv.grade_name}</TableCell>
                        <TableCell className="text-right">${inv.total_amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-emerald-700">${inv.paid_amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">${inv.balance.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[inv.status]}>{inv.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="w-4 h-4" /> Payment Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Receipt #</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="hidden sm:table-cell">Reference</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.slice(0, 20).map((pay) => (
                      <TableRow key={pay.id}>
                        <TableCell className="font-mono text-xs">{pay.receipt_number}</TableCell>
                        <TableCell className="font-medium">{pay.student_name}</TableCell>
                        <TableCell className="text-sm">{pay.payment_date}</TableCell>
                        <TableCell className="text-right font-medium text-emerald-700">${pay.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {pay.payment_method.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{pay.reference_number || "—"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="w-7 h-7">
                            <Printer className="w-3.5 h-3.5" />
                          </Button>
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
