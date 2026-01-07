import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { read, utils } from "xlsx";
import { toast } from "sonner";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  Upload,
  FileSpreadsheet,
  Download,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

// 1. Define the Teacher Interface explicitly to prevent Type Errors
interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  classes: string[];
  status: string;
  avatar: string;
}

const teacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(2, "Subject is required"),
  classes: z.string().min(1, "Please enter at least one class (e.g., 10-A)"),
  status: z.string().optional(),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

const initialTeachersData: Teacher[] = [
  { id: 1, name: "Dr. Sarah Johnson", email: "sarah.j@school.edu", phone: "+1 234-567-8910", subject: "Mathematics", classes: ["10-A", "11-A"], status: "Active", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
  { id: 2, name: "Prof. Robert Williams", email: "robert.w@school.edu", phone: "+1 234-567-8911", subject: "Physics", classes: ["11-A", "12-A"], status: "Active", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: 3, name: "Ms. Emily Brown", email: "emily.b@school.edu", phone: "+1 234-567-8912", subject: "English", classes: ["9-A", "9-B", "10-A"], status: "Active", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
  { id: 4, name: "Mr. David Lee", email: "david.l@school.edu", phone: "+1 234-567-8913", subject: "Chemistry", classes: ["10-B", "11-A"], status: "On Leave", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face" },
  { id: 5, name: "Mrs. Jennifer Davis", email: "jennifer.d@school.edu", phone: "+1 234-567-8914", subject: "Biology", classes: ["9-A", "10-A"], status: "Active", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
];

const Teachers = () => {
  // Strictly type the state
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      classes: "",
      status: "Active",
    },
  });

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function onSubmit(data: TeacherFormValues) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newTeacher: Teacher = {
      id: Math.max(...teachers.map(t => t.id), 0) + 1,
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      classes: data.classes.split(',').map(c => c.trim()),
      status: data.status || "Active",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.name}`,
    };

    setTeachers([...teachers, newTeacher]);
    toast.success("Teacher added successfully");
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
        toast.error("File is empty or invalid.");
        return;
      }

      const updatedTeachers = [...teachers];
      let newCount = 0;
      let updateCount = 0;

      jsonData.forEach((row: any) => {
        const email = row.Email || row.email;
        if (!email) return;

        let classesArray: string[] = [];
        const rawClasses = row.Classes || row.classes || "";
        if (typeof rawClasses === 'string') {
            classesArray = rawClasses.split(',').map((c: string) => c.trim());
        } else {
            classesArray = [String(rawClasses)];
        }

        // Strictly typed temporary object (without ID)
        const teacherData = {
          name: String(row.Name || row.name || "Unknown"),
          email: String(email),
          phone: String(row.Phone || row.phone || "N/A"),
          subject: String(row.Subject || row.subject || "General"),
          classes: classesArray.length > 0 && classesArray[0] !== "" ? classesArray : ["N/A"],
          status: String(row.Status || row.status || "Active"),
          avatar: "",
        };

        const existingIndex = updatedTeachers.findIndex(t => t.email.toLowerCase() === email.toLowerCase());

        if (existingIndex >= 0) {
          updatedTeachers[existingIndex] = {
            ...updatedTeachers[existingIndex],
            ...teacherData, // Now strictly typed, so it won't error
            id: updatedTeachers[existingIndex].id,
            avatar: updatedTeachers[existingIndex].avatar // Keep existing avatar
          };
          updateCount++;
        } else {
          const newTeacher: Teacher = {
            id: Math.max(...updatedTeachers.map(t => t.id), 0) + 1,
            ...teacherData,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${teacherData.name}`
          };
          updatedTeachers.push(newTeacher);
          newCount++;
        }
      });

      setTeachers(updatedTeachers);
      toast.success(`Imported: ${newCount} new, ${updateCount} updated.`);
      setIsImportDialogOpen(false);

    } catch (error) {
      console.error(error);
      toast.error("Failed to parse file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const headers = ["Name", "Email", "Phone", "Subject", "Classes", "Status"];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + 
                       "John Doe,john@school.edu,1234567890,Math,\"10-A, 10-B\",Active";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "teacher_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Teachers</h1>
          <p className="text-muted-foreground">Manage teacher profiles and assignments</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Import Excel
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Import Teachers</DialogTitle>
                <DialogDescription>
                  Upload a CSV/Excel file. Use "Classes" column for assignments (comma separated).
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
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept=".csv, .xlsx, .xls"
                        onChange={handleFileUpload}
                    />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Sample Template</span>
                    </div>
                    <Button variant="link" size="sm" onClick={downloadTemplate}>Download</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>Enter teacher details below.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="Dr. John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input placeholder="john@school.edu" {...field} /></FormControl>
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
                          <FormControl><Input placeholder="+1 234..." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl><Input placeholder="Mathematics" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="On Leave">On Leave</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="classes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Classes Assigned (Comma separated)</FormLabel>
                        <FormControl><Input placeholder="10-A, 11-B, 12-A" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Teacher
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-4 shadow-card">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <Avatar className="w-14 h-14">
                <AvatarImage src={teacher.avatar} />
                <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <Badge variant={teacher.status === "Active" ? "default" : "secondary"}>
                {teacher.status}
              </Badge>
            </div>
            <h3 className="font-display font-semibold text-lg mb-1">{teacher.name}</h3>
            <p className="text-sm text-primary font-medium mb-3">{teacher.subject}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{teacher.phone}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Assigned Classes</p>
              <div className="flex flex-wrap gap-1">
                {teacher.classes.map((cls) => (
                  <Badge key={cls} variant="secondary" className="text-xs">
                    {cls}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Eye className="w-4 h-4" />
                View
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teachers;