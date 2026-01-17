import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { read, utils, writeFile } from "xlsx";
import { toast } from "sonner";
import { 
  Search, Plus, Upload, FileSpreadsheet, Download, Loader2, Phone, Mail, Edit, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const teacherSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone"),
  aadhar: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.string().optional(),
  maritalStatus: z.string().optional(),
  subjects: z.string().min(2, "Enter subjects separated by comma"),
  status: z.string().optional(),
  contact1Name: z.string().optional(),
  contact1Rel: z.string().optional(),
  contact1Phone: z.string().optional(),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

const Teachers = () => {
  const [teachers, setTeachers] = useState<any[]>([
     { 
       id: 1, 
       name: "Dr. Sarah Johnson", 
       email: "sarah@school.edu", 
       phone: "1234567890", 
       subjects: ["Math", "Physics"], 
       qualification: "PhD",
       experience: "8",
       status: "Active", 
       avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah" 
     }
  ]); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null); // Track editing ID
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: { status: "Active", subjects: "" },
  });

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Handle Edit (Open Dialog Pre-filled) ---
  const handleEdit = (teacher: any) => {
    setEditingId(teacher.id);
    form.reset({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        subjects: teacher.subjects.join(", "),
        qualification: teacher.qualification,
        experience: teacher.experience,
        status: teacher.status,
        aadhar: teacher.aadhar || "",
        maritalStatus: teacher.maritalStatus || "Single",
        contact1Name: teacher.contact1Name || "",
        contact1Rel: teacher.contact1Rel || "",
        contact1Phone: teacher.contact1Phone || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleAddNew = () => {
      setEditingId(null);
      form.reset({ status: "Active", subjects: "" });
      setIsAddDialogOpen(true);
  };

  async function onSubmit(data: TeacherFormValues) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const processedData = {
        ...data,
        subjects: data.subjects.split(',').map(s => s.trim()),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.name}`,
    };

    if (editingId) {
        // Update existing
        setTeachers(teachers.map(t => t.id === editingId ? { ...t, ...processedData } : t));
        toast.success("Teacher profile updated.");
    } else {
        // Add new
        setTeachers([...teachers, { id: Math.random(), ...processedData }]);
        toast.success("Teacher added successfully.");
    }

    setIsSubmitting(false);
    setIsAddDialogOpen(false);
    form.reset();
  }

  // --- Export Data ---
  const handleExport = () => {
      const exportData = teachers.map(t => ({
          Name: t.name,
          Email: t.email,
          Phone: t.phone,
          Subjects: t.subjects.join(", "),
          Qualification: t.qualification,
          Experience: t.experience,
          Status: t.status
      }));
      const ws = utils.json_to_sheet(exportData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Teachers");
      writeFile(wb, "teachers_export.xlsx");
      toast.success("Teachers list exported.");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);

      const updatedTeachers = [...teachers];
      let newCount = 0;
      let updateCount = 0;

      jsonData.forEach((row: any) => {
        const email = row.Email || row.email;
        if (!email) return;

        const teacherData = {
          name: row.Name || row.name || "Unknown",
          email: email,
          phone: String(row.Phone || row.phone || ""),
          subjects: (row.Subjects || row.subjects || "General").split(',').map((s: string) => s.trim()),
          status: row.Status || "Active",
          qualification: row.Qualification || row.qualification || "",
          experience: String(row.Experience || row.experience || ""),
          aadhar: String(row.Aadhar || row.aadhar || ""),
          maritalStatus: row.MaritalStatus || row.maritalStatus || "Single",
        };

        const existingIndex = updatedTeachers.findIndex(t => t.email === email);
        if (existingIndex >= 0) {
            updatedTeachers[existingIndex] = { ...updatedTeachers[existingIndex], ...teacherData };
            updateCount++;
        } else {
            updatedTeachers.push({ id: Math.random(), ...teacherData, avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${row.Name}` });
            newCount++;
        }
      });

      setTeachers(updatedTeachers);
      toast.success(`Import complete: ${newCount} added, ${updateCount} updated.`);
      setIsImportDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to parse file.");
    } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const headers = ["Name", "Email", "Phone", "Subjects", "Qualification", "Experience", "Status"];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + 
                       "John Doe,john@school.edu,1234567890,\"Math, Physics\",PhD,10,Active";
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Teachers</h1>
          <p className="text-muted-foreground">Manage faculty and staff</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
            <Button variant="outline" className="gap-2" onClick={handleExport}>
                <Download className="w-4 h-4" /> Export
            </Button>
            
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogTrigger asChild>
                <Button variant="outline" className="gap-2"><Upload className="w-4 h-4" /> Import</Button>
                </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Teachers</DialogTitle>
                    <DialogDescription>Use Import to Add new or Update existing teachers (by Email).</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div 
                        className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="p-3 bg-primary/10 rounded-full mb-3"><FileSpreadsheet className="w-6 h-6 text-primary" /></div>
                        <p className="text-sm font-medium">Click to upload file</p>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".csv, .xlsx, .xls" onChange={handleFileUpload} />
                    </div>
                    <Button variant="link" size="sm" onClick={downloadTemplate}>Download Template</Button>
                </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2" onClick={handleAddNew}><Plus className="w-4 h-4"/> Add Teacher</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
                <DialogHeader><DialogTitle>{editingId ? "Edit Teacher" : "Add New Teacher"}</DialogTitle></DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="aadhar" render={({ field }) => (
                        <FormItem><FormLabel>Aadhar Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="qualification" render={({ field }) => (
                        <FormItem><FormLabel>Qualification</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="experience" render={({ field }) => (
                        <FormItem><FormLabel>Experience</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="subjects" render={({ field }) => (
                        <FormItem><FormLabel>Subjects</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : (editingId ? "Update Teacher" : "Save Teacher")}
                    </Button>
                    </form>
                </Form>
                </ScrollArea>
            </DialogContent>
            </Dialog>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((t) => (
             <div key={t.id} className="bg-card p-4 rounded-xl shadow-sm border hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-12 h-12"><AvatarImage src={t.avatar} /><AvatarFallback>{t.name[0]}</AvatarFallback></Avatar>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                             <h3 className="font-bold">{t.name}</h3>
                             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(t)}>
                                <Edit className="w-3 h-3 text-muted-foreground" />
                             </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.qualification} • {t.experience} Yrs</p>
                    </div>
                </div>
                <div className="flex gap-2 mb-3 flex-wrap">
                    {t.subjects && t.subjects.map((s: string) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Mail className="w-3 h-3"/> {t.email}</div>
                    <div className="flex items-center gap-2"><Phone className="w-3 h-3"/> {t.phone || "N/A"}</div>
                </div>
             </div>
        ))}
      </div>
    </div>
  );
};
export default Teachers;