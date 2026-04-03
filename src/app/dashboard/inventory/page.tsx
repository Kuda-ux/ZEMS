"use client";

import { useState, useEffect, useCallback } from "react";
import { getAssets } from "@/lib/supabase/queries";
import { supabase } from "@/lib/supabase/client";
import type { Asset } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus, Search, Monitor, BookOpen, Armchair } from "lucide-react";
import { toast } from "sonner";

const conditionColors: Record<string, string> = {
  new: "bg-emerald-100 text-emerald-800",
  good: "bg-blue-100 text-blue-800",
  fair: "bg-amber-100 text-amber-800",
  poor: "bg-orange-100 text-orange-800",
  damaged: "bg-red-100 text-red-800",
};

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  const fetchData = useCallback(async () => {
    try { const data = await getAssets(); setAssets(data); } catch (e) { console.error(e); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = assets.filter(a =>
    search === "" || a.name.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = assets.reduce((s, a) => s + a.value, 0);
  const categories = [...new Set(assets.map(a => a.category))];

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newAsset: Asset = {
      id: `a${Date.now()}`,
      school_id: "sch1",
      name: form.get("name") as string,
      category: form.get("category") as string,
      asset_number: `AST-${String(assets.length + 1).padStart(3, "0")}`,
      quantity: parseInt(form.get("quantity") as string),
      condition: form.get("condition") as string,
      location: form.get("location") as string,
      purchase_date: form.get("date") as string,
      value: parseFloat(form.get("value") as string),
    };
    const { error } = await supabase.from("assets").insert(newAsset);
    if (error) { toast.error("Failed to register asset", { description: error.message }); return; }
    setAssets([newAsset, ...assets]);
    setShowDialog(false);
    toast.success("Asset registered successfully", { description: `${newAsset.name} — ${newAsset.asset_number}` });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory & Assets" description="Manage school physical assets and supplies">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="w-4 h-4 mr-2" /> Add Asset
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Asset</DialogTitle>
              <DialogDescription>Add a new asset to the school inventory</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name *</Label>
                <Input id="name" name="name" placeholder="e.g. Student Desks (Double)" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select name="category" required>
                    <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      {["Furniture", "ICT Equipment", "Laboratory", "Textbooks", "Vehicle", "Office Equipment", "Medical", "Sports"].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input id="quantity" name="quantity" type="number" min={1} defaultValue={1} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Condition *</Label>
                  <Select name="condition" required>
                    <SelectTrigger><SelectValue placeholder="Condition" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value ($) *</Label>
                  <Input id="value" name="value" type="number" step="0.01" placeholder="e.g. 500" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="e.g. Room 12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Purchase Date</Label>
                  <Input id="date" name="date" type="date" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button type="submit">Register Asset</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-800">{assets.length}</p>
              <p className="text-xs text-blue-600">Total Assets</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Armchair className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-emerald-800">{categories.length}</p>
              <p className="text-xs text-emerald-600">Categories</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Monitor className="w-8 h-8 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-amber-800">${totalValue.toLocaleString()}</p>
              <p className="text-xs text-amber-600">Total Value</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-800">400</p>
              <p className="text-xs text-purple-600">Textbooks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative mb-4 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search assets..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Asset #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-mono text-xs">{asset.asset_number}</TableCell>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{asset.category}</Badge></TableCell>
                    <TableCell className="text-center">{asset.quantity}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${conditionColors[asset.condition] || ""}`}>{asset.condition}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{asset.location || '—'}</TableCell>
                    <TableCell className="text-right">${asset.value.toLocaleString()}</TableCell>
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
