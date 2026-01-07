import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { read, utils } from "xlsx"; 
import { toast } from "sonner";
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
  Upload, 
  FileSpreadsheet,
  Loader2
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

const studentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  studentClass: z.string({
    required_error: "Please select a class",
  }),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

type StudentFormValues = z.infer<typeof studentSchema>;

const initialStudentsData = [
  { id: 1, name: "Emma Wilson", email: "emma.w@school.edu", class: "10-A", rollNo: "101", phone: "+1 234-567-8901", status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: 2, name: "James Miller", email: "james.m@school.edu", class: "9-B", rollNo: "102", phone: "+1 234-567-8902", status: "Active", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: 3, name: "Sophia Brown", email: "sophia.b@school.edu", class: "11-A", rollNo: "103", phone: "+1 234-567-8903", status: "Inactive", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { id: 4, name: "Michael Chen", email: "michael.c@school.edu", class: "10-B", rollNo: "104", phone: "+1 234-567-8904", status: "Active", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { id: 5, name: "Emily Davis", email: "emily.d@school.edu", class: "12-A", rollNo: "105", phone: "+1 234-567-8905", status: "Active", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
  { id: 6, name: "William Taylor", email: "william.t@school.edu", class: "10-A", rollNo: "106", phone: "+1 234-567-8906", status: "Active", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
];

const Students = () => {
  const [students, setStudents] = useState(initialStudentsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || student.class === classFilter;
    return matchesSearch && matchesClass;
  });

  async function onSubmit(data: StudentFormValues) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newStudent = {
      id: Math.max(...students.map(s => s.id), 0) + 1,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      class: data.studentClass,
      rollNo: String(Math.floor(Math.random() * 1000)),
      phone: data.phone,
      status: "Active",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.firstName}`,
    };

    setStudents([...students, newStudent]);
    toast.success("Student added successfully");
    setIsSubmitting(false);
    setIsAddDialogOpen(false);
    form.reset();
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(arrayBuffer);
      const sheetName = workbook.SheetNames[0]; 
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        toast.error("The uploaded file is empty or invalid.");
        return;
      }

      const updatedStudents = [...students];
      let newCount = 0;
      let updateCount = 0;

      jsonData.forEach((row: any) => {
        const email = row.Email || row.email;
        if (!email) return; 

        const studentData = {
          name: row.Name || row.name || "Unknown",
          email: email,
          class: row.Class || row.class || "N/A",
          rollNo: String(row.RollNo || row.roll_no || row.rollNo || "N/A"),
          phone: String(row.Phone || row.phone || "N/A"),
          status: row.Status || row.status || "Active",
          avatar: "", 
          id: 0 
        };

        const existingIndex = updatedStudents.findIndex(s => s.email.toLowerCase() === email.toLowerCase());

        if (existingIndex >= 0) {
          updatedStudents[existingIndex] = { 
            ...updatedStudents[existingIndex], 
            ...studentData, 
            id: updatedStudents[existingIndex].id, 
            avatar: updatedStudents[existingIndex].avatar 
          };
          updateCount++;
        } else {
          studentData.id = Math.max(...updatedStudents.map(s => s.id), 0) + 1;
          studentData.avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${studentData.name}`; 
          updatedStudents.push(studentData);
          newCount++;
        }
      });

      setStudents(updatedStudents);
      toast.success(`Import successful: ${newCount} added, ${updateCount} updated.`);
      setIsImportDialogOpen(false);

    } catch (error) {
      console.error("Import Error:", error);
      toast.error("Failed to parse the Excel file. Please check the format.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const headers = ["Name", "Email", "Class", "RollNo", "Phone", "Status"];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Students</h1>
          <p className="text-muted-foreground">Manage student records and information</p>
        </div>
        
        <div className="flex items-center gap-2">
            {/* Import Dialog */}
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Import Excel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Import Students</DialogTitle>
                <DialogDescription>
                    Upload an Excel or CSV file to add or update students in bulk.
                    Use Email as the unique identifier.
                </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                    <div 
                        className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="p-3 bg-primary/10 rounded-full mb-3">
                            <FileSpreadsheet className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium">Click to upload file</p>
                        <p className="text-xs text-muted-foreground mt-1">.xlsx, .xls, .csv supported</p>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden" 
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            onChange={handleFileUpload}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Download className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Sample Template</span>
                        </div>
                        <Button variant="link" size="sm" onClick={downloadTemplate}>
                            Download
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsImportDialogOpen(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>

            {/* Add Student Dialog */}
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@school.edu" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="studentClass"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="9-A">9-A</SelectItem>
                                <SelectItem value="9-B">9-B</SelectItem>
                                <SelectItem value="10-A">10-A</SelectItem>
                                <SelectItem value="10-B">10-B</SelectItem>
                                <SelectItem value="11-A">11-A</SelectItem>
                                <SelectItem value="12-A">12-A</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 234-567-8900" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <DialogFooter className="pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddDialogOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Student
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
            </DialogContent>
            </Dialog>
        </div>
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
            {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
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
                ))
            ) : (
                <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        No students found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing 1-{filteredStudents.length} of {students.length} students
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              1
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