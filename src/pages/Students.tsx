import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const studentsData = [
  { id: 1, name: "Emma Wilson", email: "emma.w@school.edu", class: "10-A", rollNo: "101", phone: "+1 234-567-8901", status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: 2, name: "James Miller", email: "james.m@school.edu", class: "9-B", rollNo: "102", phone: "+1 234-567-8902", status: "Active", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: 3, name: "Sophia Brown", email: "sophia.b@school.edu", class: "11-A", rollNo: "103", phone: "+1 234-567-8903", status: "Inactive", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { id: 4, name: "Michael Chen", email: "michael.c@school.edu", class: "10-B", rollNo: "104", phone: "+1 234-567-8904", status: "Active", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { id: 5, name: "Emily Davis", email: "emily.d@school.edu", class: "12-A", rollNo: "105", phone: "+1 234-567-8905", status: "Active", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
  { id: 6, name: "William Taylor", email: "william.t@school.edu", class: "10-A", rollNo: "106", phone: "+1 234-567-8906", status: "Active", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
];

const Students = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || student.class === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Students</h1>
          <p className="text-muted-foreground">Manage student records and information</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Enter the student details below to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@school.edu" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9-A">9-A</SelectItem>
                      <SelectItem value="9-B">9-B</SelectItem>
                      <SelectItem value="10-A">10-A</SelectItem>
                      <SelectItem value="10-B">10-B</SelectItem>
                      <SelectItem value="11-A">11-A</SelectItem>
                      <SelectItem value="12-A">12-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+1 234-567-8900" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={() => setIsAddDialogOpen(false)}>
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
          <div className="flex gap-2">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="9-A">9-A</SelectItem>
                <SelectItem value="9-B">9-B</SelectItem>
                <SelectItem value="10-A">10-A</SelectItem>
                <SelectItem value="10-B">10-B</SelectItem>
                <SelectItem value="11-A">11-A</SelectItem>
                <SelectItem value="12-A">12-A</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Students Table - Desktop */}
      <div className="hidden md:block bg-card rounded-2xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Student</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Roll No</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Class</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Phone</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm">{student.rollNo}</td>
                <td className="py-4 px-6">
                  <Badge variant="secondary">{student.class}</Badge>
                </td>
                <td className="py-4 px-6 text-sm">{student.phone}</td>
                <td className="py-4 px-6">
                  <Badge variant={student.status === "Active" ? "default" : "outline"}>
                    {student.status}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing 1-{filteredStudents.length} of {filteredStudents.length} students
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Students Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-card rounded-2xl p-4 shadow-card">
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={student.avatar} />
                <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium truncate">{student.name}</p>
                  <Badge variant={student.status === "Active" ? "default" : "outline"} className="text-xs">
                    {student.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">{student.class}</Badge>
                  <span className="text-xs text-muted-foreground">Roll: {student.rollNo}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">{student.phone}</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Students;
