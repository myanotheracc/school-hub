import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Download, FileBarChart, Trophy, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ExamResults = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* --- HEADER FIX --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exam Results</h1>
          <p className="text-muted-foreground">View and manage student grades.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button size="sm" className="w-full sm:w-auto">
            <FileBarChart className="mr-2 h-4 w-4" /> Publish Results
          </Button>
        </div>
      </div>

      {/* Stats Cards (Grid Layout - Safe on all screens) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+2.5% from last term</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Emma Wilson</div>
            <p className="text-xs text-muted-foreground">Class 10-A (98%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Papers remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Table */}
      <div className="space-y-4">
        <div className="relative md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by student or subject..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Emma Wilson</TableCell>
                <TableCell>Mathematics</TableCell>
                <TableCell>98/100</TableCell>
                <TableCell><span className="text-green-600 font-bold">A+</span></TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">James Miller</TableCell>
                <TableCell>Science</TableCell>
                <TableCell>72/100</TableCell>
                <TableCell><span className="text-blue-600 font-bold">B</span></TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;