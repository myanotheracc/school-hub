import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, DollarSign, CreditCard, Download } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const Fees = () => {
    return (
        <div className="p-6 space-y-6">
            {/* --- HEADER FIX --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Fee Management</h1>
                    <p className="text-muted-foreground">Track payments and outstanding dues.</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                        <Download className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                    <Button size="sm" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                        <DollarSign className="mr-2 h-4 w-4" /> Collect Fee
                    </Button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Dues</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,450.00</div>
                        <p className="text-xs text-muted-foreground">Overdue payments</p>
                    </CardContent>
                </Card>
            </div>

            {/* Fee Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Emma Wilson</TableCell>
                            <TableCell>INV-001</TableCell>
                            <TableCell>$500.00</TableCell>
                            <TableCell><span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">Paid</span></TableCell>
                            <TableCell className="text-right">Oct 12, 2025</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">James Miller</TableCell>
                            <TableCell>INV-002</TableCell>
                            <TableCell>$500.00</TableCell>
                            <TableCell><span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold">Unpaid</span></TableCell>
                            <TableCell className="text-right">Due: Oct 15, 2025</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

function AlertCircle(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
    )
}

export default Fees;