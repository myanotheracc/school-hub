import { useState } from "react";
import { Search, Download, CheckCircle, Clock, AlertCircle, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const feeData = [
  { id: 1, student: "Emma Wilson", class: "10-A", totalFee: 5000, paid: 5000, status: "Paid", dueDate: "Dec 15, 2024" },
  { id: 2, student: "James Miller", class: "9-B", totalFee: 4500, paid: 2250, status: "Partial", dueDate: "Dec 20, 2024" },
  { id: 3, student: "Sophia Brown", class: "11-A", totalFee: 5500, paid: 0, status: "Pending", dueDate: "Dec 10, 2024" },
  { id: 4, student: "Michael Chen", class: "10-B", totalFee: 5000, paid: 5000, status: "Paid", dueDate: "Dec 15, 2024" },
  { id: 5, student: "Emily Davis", class: "12-A", totalFee: 6000, paid: 3000, status: "Partial", dueDate: "Dec 18, 2024" },
];

const statusConfig = {
  Paid: { icon: CheckCircle, className: "bg-success/10 text-success border-success/20" },
  Partial: { icon: Clock, className: "bg-warning/10 text-warning border-warning/20" },
  Pending: { icon: AlertCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const Fees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredFees = feeData.filter((fee) => {
    const matchesSearch = fee.student.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || fee.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = feeData.reduce((sum, fee) => sum + fee.paid, 0);
  const totalPending = feeData.reduce((sum, fee) => sum + (fee.totalFee - fee.paid), 0);
  const collectionRate = (totalCollected / (totalCollected + totalPending)) * 100;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Fees Management</h1>
          <p className="text-muted-foreground">Track and manage student fee payments</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <p className="text-sm text-muted-foreground mb-1">Total Collected</p>
          <p className="text-2xl font-display font-bold text-success">${totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <p className="text-sm text-muted-foreground mb-1">Pending Amount</p>
          <p className="text-2xl font-display font-bold text-warning">${totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-card col-span-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Collection Rate</p>
            <p className="text-sm font-medium">{collectionRate.toFixed(1)}%</p>
          </div>
          <Progress value={collectionRate} className="h-2" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-xl">
          <TabsTrigger value="all" className="rounded-lg">All Students</TabsTrigger>
          <TabsTrigger value="structure" className="rounded-lg">Fee Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <div className="bg-card rounded-2xl p-4 shadow-card">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fee Table - Desktop */}
          <div className="hidden md:block bg-card rounded-2xl shadow-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Student</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Class</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Total Fee</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Paid</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Balance</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.map((fee) => {
                  const config = statusConfig[fee.status as keyof typeof statusConfig];
                  const StatusIcon = config.icon;
                  const balance = fee.totalFee - fee.paid;
                  return (
                    <tr key={fee.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 font-medium">{fee.student}</td>
                      <td className="py-4 px-6">
                        <Badge variant="secondary">{fee.class}</Badge>
                      </td>
                      <td className="py-4 px-6">${fee.totalFee.toLocaleString()}</td>
                      <td className="py-4 px-6 text-success">${fee.paid.toLocaleString()}</td>
                      <td className="py-4 px-6 text-warning">${balance.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <Badge variant="outline" className={config.className}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {fee.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Receipt className="w-4 h-4" />
                            Receipt
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Fee Cards - Mobile */}
          <div className="md:hidden space-y-3">
            {filteredFees.map((fee) => {
              const config = statusConfig[fee.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;
              const balance = fee.totalFee - fee.paid;
              const paidPercentage = (fee.paid / fee.totalFee) * 100;
              return (
                <div key={fee.id} className="bg-card rounded-2xl p-4 shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{fee.student}</p>
                      <Badge variant="secondary" className="text-xs mt-1">{fee.class}</Badge>
                    </div>
                    <Badge variant="outline" className={config.className}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {fee.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{paidPercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={paidPercentage} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center py-3 border-y border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-semibold">${fee.totalFee}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Paid</p>
                      <p className="font-semibold text-success">${fee.paid}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Balance</p>
                      <p className="font-semibold text-warning">${balance}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">Due: {fee.dueDate}</span>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Receipt className="w-4 h-4" />
                      Receipt
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="structure">
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <h3 className="text-lg font-display font-semibold mb-4">Fee Structure by Class</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { class: "9th Grade", tuition: 3500, lab: 500, library: 200, sports: 300 },
                { class: "10th Grade", tuition: 4000, lab: 500, library: 200, sports: 300 },
                { class: "11th Grade", tuition: 4500, lab: 600, library: 200, sports: 200 },
                { class: "12th Grade", tuition: 5000, lab: 600, library: 200, sports: 200 },
              ].map((item) => (
                <div key={item.class} className="p-4 rounded-xl bg-muted/50">
                  <h4 className="font-semibold mb-3">{item.class}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tuition Fee</span>
                      <span>${item.tuition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lab Fee</span>
                      <span>${item.lab}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Library</span>
                      <span>${item.library}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sports</span>
                      <span>${item.sports}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border font-semibold">
                      <span>Total</span>
                      <span>${item.tuition + item.lab + item.library + item.sports}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Fees;
