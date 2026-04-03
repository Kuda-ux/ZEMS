"use client";

import { useState } from "react";
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

interface Asset {
  id: string;
  name: string;
  category: string;
  assetNumber: string;
  quantity: number;
  condition: string;
  location: string;
  purchaseDate: string;
  value: number;
}

const demoAssets: Asset[] = [
  { id: "a1", name: "Student Desks (Double)", category: "Furniture", assetNumber: "FUR-001", quantity: 120, condition: "good", location: "Classrooms", purchaseDate: "2023-01-15", value: 4800 },
  { id: "a2", name: "Student Chairs", category: "Furniture", assetNumber: "FUR-002", quantity: 240, condition: "good", location: "Classrooms", purchaseDate: "2023-01-15", value: 3600 },
  { id: "a3", name: "Teacher Desks", category: "Furniture", assetNumber: "FUR-003", quantity: 15, condition: "good", location: "Classrooms", purchaseDate: "2022-06-10", value: 1500 },
  { id: "a4", name: "Desktop Computers", category: "ICT Equipment", assetNumber: "ICT-001", quantity: 20, condition: "fair", location: "Computer Lab", purchaseDate: "2021-09-01", value: 12000 },
  { id: "a5", name: "Projector (Epson)", category: "ICT Equipment", assetNumber: "ICT-002", quantity: 3, condition: "good", location: "Science Lab / Hall", purchaseDate: "2024-01-20", value: 2400 },
  { id: "a6", name: "Science Lab Equipment Set", category: "Laboratory", assetNumber: "LAB-001", quantity: 5, condition: "fair", location: "Science Lab", purchaseDate: "2020-03-15", value: 3500 },
  { id: "a7", name: "Mathematics Textbooks (Form 1-4)", category: "Textbooks", assetNumber: "TXT-001", quantity: 200, condition: "good", location: "Book Room", purchaseDate: "2025-01-10", value: 2000 },
  { id: "a8", name: "English Textbooks (Form 1-4)", category: "Textbooks", assetNumber: "TXT-002", quantity: 200, condition: "good", location: "Book Room", purchaseDate: "2025-01-10", value: 2000 },
  { id: "a9", name: "School Bus (Toyota Coaster)", category: "Vehicle", assetNumber: "VEH-001", quantity: 1, condition: "fair", location: "Parking Lot", purchaseDate: "2019-08-20", value: 25000 },
  { id: "a10", name: "Photocopier (Canon)", category: "Office Equipment", assetNumber: "OFF-001", quantity: 2, condition: "good", location: "Admin Office", purchaseDate: "2024-06-01", value: 3000 },
  { id: "a11", name: "First Aid Kit", category: "Medical", assetNumber: "MED-001", quantity: 4, condition: "good", location: "Sick Bay / Staff Room", purchaseDate: "2025-09-01", value: 200 },
  { id: "a12", name: "Sports Equipment Set", category: "Sports", assetNumber: "SPO-001", quantity: 1, condition: "good", location: "Sports Room", purchaseDate: "2024-03-10", value: 800 },
];

const conditionColors: Record<string, string> = {
  new: "bg-emerald-100 text-emerald-800",
  good: "bg-blue-100 text-blue-800",
  fair: "bg-amber-100 text-amber-800",
  poor: "bg-orange-100 text-orange-800",
  damaged: "bg-red-100 text-red-800",
};

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [assets, setAssets] = useState(demoAssets);
  const [showDialog, setShowDialog] = useState(false);

  const filtered = assets.filter(a =>
    search === "" || a.name.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = assets.reduce((s, a) => s + a.value, 0);
  const categories = [...new Set(assets.map(a => a.category))];

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newAsset: Asset = {
      id: `a${Date.now()}`,
      name: form.get("name") as string,
      category: form.get("category") as string,
      assetNumber: `AST-${String(assets.length + 1).padStart(3, "0")}`,
      quantity: parseInt(form.get("quantity") as string),
      condition: form.get("condition") as string,
      location: form.get("location") as string,
      purchaseDate: form.get("date") as string,
      value: parseFloat(form.get("value") as string),
    };
    setAssets([newAsset, ...assets]);
    setShowDialog(false);
    toast.success("Asset registered successfully");
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
                <Input id="name" name="name" required />
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
                  <Input id="value" name="value" type="number" step="0.01" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" />
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
                    <TableCell className="font-mono text-xs">{asset.assetNumber}</TableCell>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{asset.category}</Badge></TableCell>
                    <TableCell className="text-center">{asset.quantity}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${conditionColors[asset.condition] || ""}`}>{asset.condition}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{asset.location}</TableCell>
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
