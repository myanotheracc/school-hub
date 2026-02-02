import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Upload, Plus, Search, Eye, Edit } from "lucide-react";

// Dummy data for display
const initialStudents = [
  { id: 1, name: "Emma Wilson", email: "emma@school.edu", class: "10-A", status: "Paid" },
  { id: 2, name: "James Miller", email: "james@school.edu", class: "9-B", status: "Pending" },
  { id: 3, name: "Sarah Davis", email: "sarah@school.edu", class: "10-A", status: "Paid" },
  { id: 4, name: "Michael Brown", email: "michael@school.edu", class: "12-C", status: "Paid" },
];

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* --- HEADER SECTION (Fixed Layout) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage student records and admissions.</p>
        </div>

        {/* Buttons Group - Always Visible */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Import Button */}
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Upload className="mr-2 h-4 w-4" /> Import
          </Button>
          
          {/* Export Button */}
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>

          {/* Add Student (Primary Action) */}
          <Button size="sm" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Student
          </Button>
        </div>
      </div>

      {/* --- SEARCH & FILTER BAR --- */}
      <div className="flex items-center gap-2 bg-background/95 p-1 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Mobile-only Export/Import icons (Optional, if you want them on tiny screens) */}
        <div className="flex sm:hidden gap-1">
             <Button variant="ghost" size="icon"><Upload className="h-4 w-4"/></Button>
             <Button variant="ghost" size="icon"><Download className="h-4 w-4"/></Button>
        </div>
      </div>

      {/* --- STUDENTS LIST --- */}
      <div className="grid gap-4">
        {initialStudents.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="grid gap-1">
                <div className="font-semibold flex items-center gap-2">
                  {student.name}
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-muted-foreground">
                    {student.class}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">{student.email}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm hidden md:block text-right mr-4">
                    <div className="text-xs text-muted-foreground">Status</div>
                    <div className={student.status === "Paid" ? "text-green-600 font-medium" : "text-orange-600"}>
                        {student.status}
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Students;