import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { read, utils, writeFile } from "xlsx";
import { toast } from "sonner";
import { 
  Search, Plus, Eye, Upload, FileSpreadsheet, Download, TrendingUp, AlertCircle, Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const studentSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  class: z.string().min(1, "Class required"),
  phone: z.string().optional(),
  status: z.string().optional(),
  // Fees & Marks placeholders for form (simplified)
  feeTotal: z.string().optional(),
  feePaid: z.string().optional(),
  grade: z.string().optional(),
});
type StudentFormValues = z.infer<typeof studentSchema>;

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([
      { 
          id: 1, name: "Emma Wilson", class: "10-A", status: "Active", email: "emma@school.edu", phone: "123",
          fees: { total: 50000, paid: 50000, status: "Paid" },
          marks: { grade: "A", cgpa: "9.2" }
      },
      { 
          id: 2, name: "James Miller", class: "9-B", status: "Active", email: "james@school.edu", phone: "456",
          fees: { total: 45000, paid: 20000, status: "Pending" },
          marks: { grade: "B", cgpa: "7.5" }
      }
  ]);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<StudentFormValues>({
      resolver: zodResolver(studentSchema),
      defaultValues: { status: "Active" }
  });

  // --- Handle Edit ---
  const handleEdit = (student: any) => {
    setEditingId(student.id);
    form.reset({
        name: student.name,
        email: student.email,
        class: student.class,
        phone: student.phone,
        status: student.status,
        feeTotal: String(student.fees?.total || ""),
        feePaid: String(student.fees?.paid || ""),
        grade: student.marks?.grade || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleAddNew = () => {
      setEditingId(null);
      form.reset({ status: "Active" });
      setIsAddDialogOpen(true);
  };

  const onSubmit = (data: StudentFormValues) => {
      const processedData = {
          name: data.name,
          email: data.email,
          class: data.class,
          phone: data.phone,
          status: data.status,
          fees: { 
              total: Number(data.feeTotal || 0), 
              paid: Number(data.feePaid || 0), 
              status: Number(data.feePaid) >= Number(data.feeTotal) ? "Paid" : "Pending" 
          },
          marks: { grade: data.grade, cgpa: "N/A" }
      };

      if (editingId) {
          setStudents(students.map(s => s.id === editingId ? { ...s, ...processedData } : s));
          toast.success("Student updated.");
      } else {
          setStudents([...students, { id: Math.random(), ...processedData }]);
          toast.success("Student added.");
      }
      setIsAddDialogOpen(false);
  };

  // --- Export ---
  const handleExport = () => {
      const exportData = students.map(s => ({
          Name: s.name, Email: s.email, Class: s.class, Phone: s.phone,
          FeeTotal: s.fees?.total, FeePaid: s.fees?.paid, Grade: s.marks?.grade
      }));
      const ws = utils.json_to_sheet(exportData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Students");
      writeFile(wb, "students_export.xlsx");
      toast.success("Students exported.");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);

      const updatedStudents = [...students];
      let updateCount = 0;
      let newCount = 0;

      jsonData.forEach((row: any) => {
        const email = row.Email || row.email;
        if (!email) return;

        // Fee Calc
        const totalFee = Number(row.FeeTotal || row.feeTotal || 0);
        const paidFee = Number(row.FeePaid || row.feePaid || 0);

        const studentData = {
          name: row.Name || row.name || "Unknown",
          class: row.Class || row.class || "N/A",
          status: row.Status || "Active",
          email: email,
          phone: row.Phone || "",
          fees: { total: totalFee, paid: paidFee, status: paidFee >= totalFee ? "Paid" : "Pending" },
          marks: { grade: row.Grade || row.grade || "N/A", cgpa: row.CGPA || "N/A" }
        };
        
        const existingIndex = updatedStudents.findIndex(s => s.email === email);
        if (existingIndex >= 0) {
            updatedStudents[existingIndex] = { ...updatedStudents[existingIndex], ...studentData };
            updateCount++;
        } else {
            updatedStudents.push({ id: Math.random(), ...studentData });
            newCount++;
        }
      });

      setStudents(updatedStudents);
      toast.success(`Import: ${newCount} added, ${updateCount} updated.`);
      setIsImportDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to parse file.");
    } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-display">Students</h1>
            <p className="text-muted-foreground">Manage student records</p>
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
                    <DialogTitle>Import Students</DialogTitle>
                    <DialogDescription>Update existing students by matching Email.</DialogDescription>
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
                </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="gap-2" onClick={handleAddNew}><Plus className="w-4 h-4"/> Add Student</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader><DialogTitle>{editingId ? "Edit Student" : "Add Student"}</DialogTitle></DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                                    )} />
                                    <FormField control={form.control} name="class" render={({ field }) => (
                                        <FormItem><FormLabel>Class</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                                    )} />
                                </div>
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                                )} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="feeTotal" render={({ field }) => (
                                        <FormItem><FormLabel>Total Fee</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
                                    )} />
                                    <FormField control={form.control} name="feePaid" render={({ field }) => (
                                        <FormItem><FormLabel>Paid Fee</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage/></FormItem>
                                    )} />
                                </div>
                                <Button type="submit" className="w-full">{editingId ? "Update" : "Save"}</Button>
                            </form>
                        </Form>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {students.map((student) => (
            <div key={student.id} className="bg-card p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center border hover:shadow-md transition-shadow gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{student.name}</h3>
                        <Badge variant="secondary">{student.class}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{student.email}</p>
                </div>

                <div className="flex gap-6 text-sm">
                    <div>
                        <p className="text-muted-foreground text-xs">Fees</p>
                        <div className="flex items-center gap-1 font-medium">
                            {student.fees?.status === "Paid" ? (
                                <span className="text-green-600 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Paid</span>
                            ) : (
                                <span className="text-amber-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {student.fees?.paid}/{student.fees?.total}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(student)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/students/${student.id}`)}>
                        <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
export default Students;