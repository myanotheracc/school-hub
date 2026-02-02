import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Upload, Plus, Search, Mail, Phone, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dummy data for teachers
const initialTeachers = [
  { id: 1, name: "Mr. Robert Fox", subject: "Mathematics", email: "robert@school.edu", phone: "+1 234 567 890", status: "Active" },
  { id: 2, name: "Ms. Esther Howard", subject: "English", email: "esther@school.edu", phone: "+1 234 567 891", status: "On Leave" },
  { id: 3, name: "Mr. Cameron Williamson", subject: "Physics", email: "cameron@school.edu", phone: "+1 234 567 892", status: "Active" },
];

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* --- HEADER SECTION (Fixed Layout) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">Manage faculty members and assignments.</p>
        </div>

        {/* Buttons Group - Always Visible on Laptop */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Upload className="mr-2 h-4 w-4" /> Import
          </Button>
          
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>

          <Button size="sm" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Add Teacher
          </Button>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="flex items-center gap-2 bg-background/95 p-1 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search teachers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Mobile-only Icons (so you can still export on phone if needed) */}
        <div className="flex sm:hidden gap-1">
             <Button variant="ghost" size="icon"><Upload className="h-4 w-4"/></Button>
             <Button variant="ghost" size="icon"><Download className="h-4 w-4"/></Button>
        </div>
      </div>

      {/* --- TEACHERS LIST --- */}
      <div className="grid gap-4">
        {initialTeachers.map((teacher) => (
          <Card key={teacher.id}>
            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              {/* Teacher Info */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">
                    {teacher.name.charAt(0)}
                </div>
                <div>
                    <div className="font-semibold">{teacher.name}</div>
                    <div className="text-sm text-muted-foreground">{teacher.subject}</div>
                </div>
              </div>

              {/* Contact Info (Hidden on small phones, visible on laptop) */}
              <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> {teacher.email}
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> {teacher.phone}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between w-full md:w-auto gap-4">
                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                     teacher.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                 }`}>
                    {teacher.status}
                 </span>

                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Teachers;