import { useState, useRef } from "react";
import { read, utils } from "xlsx";
import { toast } from "sonner";
import { 
  Search, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Filter, 
  Trophy, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialResults = [
  { id: 1, student: "Emma Wilson", email: "emma.w@school.edu", exam: "Mid-Term 2024", subject: "Mathematics", marks: 95, grade: "A+", status: "Pass", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: 2, student: "James Miller", email: "james.m@school.edu", exam: "Mid-Term 2024", subject: "Mathematics", marks: 42, grade: "D", status: "Fail", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: 3, student: "Sophia Brown", email: "sophia.b@school.edu", exam: "Finals 2023", subject: "Physics", marks: 88, grade: "A", status: "Pass", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
];

const ExamResults = () => {
  const [results, setResults] = useState(initialResults);
  const [searchQuery, setSearchQuery] = useState("");
  const [examFilter, setExamFilter] = useState("all");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredResults = results.filter((result) => {
    const matchesSearch = 
      result.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExam = examFilter === "all" || result.exam === examFilter;
    return matchesSearch && matchesExam;
  });

  const uniqueExams = Array.from(new Set(results.map(r => r.exam)));

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

      const newResults = [...results];
      let addedCount = 0;

      jsonData.forEach((row: any) => {
        if (!row.Email && !row.email) return;

        const resultData = {
          id: Math.max(...newResults.map(r => r.id), 0) + 1,
          student: row.Name || row.Student || "Unknown Student",
          email: row.Email || row.email,
          exam: row.Exam || "General Assessment",
          subject: row.Subject || "General",
          marks: Number(row.Marks || 0),
          grade: row.Grade || "N/A",
          status: row.Status || (Number(row.Marks) >= 40 ? "Pass" : "Fail"),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${row.Name || "User"}`
        };

        newResults.push(resultData);
        addedCount++;
      });

      setResults(newResults);
      toast.success(`Successfully uploaded marks for ${addedCount} students.`);
      setIsImportDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to process the Excel file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const headers = ["Name", "Email", "Exam", "Subject", "Marks", "Grade", "Status"];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + 
                       "John Doe,john@school.edu,Finals 2024,Mathematics,85,A,Pass";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exam_results_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Exam Results</h1>
          <p className="text-muted-foreground">Manage and track student performance</p>
        </div>
        
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Marks
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload Exam Results</DialogTitle>
              <DialogDescription>
                Upload an Excel sheet containing student marks. 
                Ensure columns match the template.
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
                  <p className="text-sm font-medium">Click to upload marks sheet</p>
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
      </div>

      <div className="bg-card rounded-2xl p-4 shadow-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search student name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={examFilter} onValueChange={setExamFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                {uniqueExams.map(exam => (
                  <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Student</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Exam</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Subject</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Marks</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Grade</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <tr key={result.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={result.avatar} />
                        <AvatarFallback>{result.student[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{result.student}</p>
                        <p className="text-xs text-muted-foreground">{result.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium">{result.exam}</td>
                  <td className="py-4 px-6 text-sm">{result.subject}</td>
                  <td className="py-4 px-6 text-sm font-medium">{result.marks}</td>
                  <td className="py-4 px-6">
                    <Badge variant="outline" className={
                      result.grade.startsWith('A') ? "text-green-600 border-green-200 bg-green-50" :
                      result.grade.startsWith('B') ? "text-blue-600 border-blue-200 bg-blue-50" :
                      result.grade.startsWith('F') || result.grade === 'D' ? "text-red-600 border-red-200 bg-red-50" : ""
                    }>
                      {result.grade}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center gap-1.5 text-sm font-medium ${
                      result.status === "Pass" ? "text-green-600" : "text-red-600"
                    }`}>
                      {result.status === "Pass" ? <Trophy className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {result.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;