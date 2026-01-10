import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Search, Plus, Eye, Edit, Trash2, Mail, Phone, Upload, 
  FileSpreadsheet, Download, Loader2, BookOpen 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Enhanced Schema ---
const teacherSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone"),
  aadhar: z.string().min(12, "Aadhar must be 12 digits"),
  qualification: z.string().min(2, "Qualification required"),
  experience: z.string().min(1, "Experience required"),
  maritalStatus: z.string(),
  subjects: z.string().min(2, "Enter subjects separated by comma"), // Simplified for UI
  status: z.string(),
  // Contacts
  contact1Name: z.string().min(2),
  contact1Rel: z.string().min(2),
  contact1Phone: z.string().min(10),
  contact2Name: z.string().optional(),
  contact2Rel: z.string().optional(),
  contact2Phone: z.string().optional(),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

const Teachers = () => {
  const [teachers, setTeachers] = useState<any[]>([]); // Using any for brevity in this snippet
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      status: "Active",
      subjects: "",
    },
  });

  async function onSubmit(data: TeacherFormValues) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newTeacher = {
      id: Math.random(),
      ...data,
      subjects: data.subjects.split(',').map(s => s.trim()),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.name}`,
    };

    setTeachers([...teachers, newTeacher]);
    toast.success("Teacher added successfully");
    setIsSubmitting(false);
    setIsAddDialogOpen(false);
    form.reset();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display">Teachers</h1>
          <p className="text-muted-foreground">Manage faculty and staff</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4"/> Add Teacher</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>Enter complete profile details.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  
                  {/* Personal Info */}
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
                      <FormItem><FormLabel>Experience (Yrs)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="subjects" render={({ field }) => (
                      <FormItem><FormLabel>Subjects (Comma sep)</FormLabel><FormControl><Input placeholder="Math, Physics" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  {/* Emergency Contact 1 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium mb-3">Primary Emergency Contact</h4>
                    <div className="grid grid-cols-3 gap-2">
                        <FormField control={form.control} name="contact1Name" render={({ field }) => (
                        <FormItem><FormControl><Input placeholder="Name" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="contact1Rel" render={({ field }) => (
                        <FormItem><FormControl><Input placeholder="Relationship" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="contact1Phone" render={({ field }) => (
                        <FormItem><FormControl><Input placeholder="Phone" {...field} /></FormControl></FormItem>
                        )} />
                    </div>
                  </div>

                  {/* Emergency Contact 2 */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium mb-3">Secondary Emergency Contact</h4>
                    <div className="grid grid-cols-3 gap-2">
                        <FormField control={form.control} name="contact2Name" render={({ field }) => (
                        <FormItem><FormControl><Input placeholder="Name" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="contact2Rel" render={({ field }) => (
                        <FormItem><FormControl><Input placeholder="Relationship" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="contact2Phone" render={({ field }) => (
                        <FormItem><FormControl><Input placeholder="Phone" {...field} /></FormControl></FormItem>
                        )} />
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Save Teacher Profile"}
                  </Button>
                </form>
              </Form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Teachers List (Placeholder for brevity, assuming similar card layout as before) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.length === 0 && <div className="col-span-3 text-center p-10 text-muted-foreground">No teachers added yet.</div>}
        {teachers.map((t) => (
             <div key={t.id} className="bg-card p-4 rounded-xl shadow-sm border">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar><AvatarImage src={t.avatar} /><AvatarFallback>{t.name[0]}</AvatarFallback></Avatar>
                    <div><h3 className="font-bold">{t.name}</h3><p className="text-xs text-muted-foreground">{t.qualification}</p></div>
                </div>
                <div className="flex gap-2 mb-2 flex-wrap">
                    {t.subjects.map((s: string) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                </div>
             </div>
        ))}
      </div>
    </div>
  );
};

export default Teachers;