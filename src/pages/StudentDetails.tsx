import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

// Mock subjects
const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "History", "Geography", "Economics", "Art"];

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock State for Marks
  // Structure: { testId: [ { subject: "", total: 100, obtained: 0 } ] }
  const [marksData, setMarksData] = useState<Record<string, any[]>>({
    "Test 1": [],
    "Test 2": [],
    "Test 3": [],
    "Test 4": [],
    "Test 5": [],
  });

  const [fees, setFees] = useState([
    { label: "Semester Fee", amount: "50000" },
    { label: "Bus Fee", amount: "15000" },
    { label: "Hostel Fee", amount: "0" },
    { label: "Library Fee", amount: "2000" },
    { label: "Misc Fee", amount: "1000" },
  ]);

  const handleAddSubject = (testName: string) => {
    setMarksData(prev => ({
      ...prev,
      [testName]: [...prev[testName], { subject: "", total: 100, obtained: 0 }]
    }));
  };

  const updateMarkRow = (testName: string, index: number, field: string, value: any) => {
    const updatedTest = [...marksData[testName]];
    updatedTest[index] = { ...updatedTest[index], [field]: value };
    setMarksData(prev => ({ ...prev, [testName]: updatedTest }));
  };

  const removeMarkRow = (testName: string, index: number) => {
    const updatedTest = marksData[testName].filter((_, i) => i !== index);
    setMarksData(prev => ({ ...prev, [testName]: updatedTest }));
  };

  const handleSaveMarks = () => {
    console.log("Saving", marksData);
    toast.success("Marks updated successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
            <h1 className="text-2xl font-bold font-display">Student Profile</h1>
            <p className="text-muted-foreground">ID: {id} • Emma Wilson</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="marks">Marks</TabsTrigger>
        </TabsList>

        {/* --- Profile Tab --- */}
        <TabsContent value="profile" className="mt-6 space-y-4">
            <Card>
                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1"><Label>Full Name</Label><Input defaultValue="Emma Wilson" /></div>
                    <div className="space-y-1"><Label>Year of Study</Label><Input defaultValue="2024" /></div>
                    <div className="space-y-1"><Label>Father's Name</Label><Input defaultValue="Robert Wilson" /></div>
                    <div className="space-y-1"><Label>Mother's Name</Label><Input defaultValue="Sarah Wilson" /></div>
                    <div className="space-y-1"><Label>Date of Birth</Label><Input type="date" /></div>
                    <div className="space-y-1"><Label>Aadhar Number</Label><Input placeholder="1234-5678-9012" /></div>
                    <div className="space-y-1"><Label>Residence</Label>
                        <Select defaultValue="Day Scholar"><SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent><SelectItem value="Hostel">Hostel</SelectItem><SelectItem value="Day Scholar">Day Scholar</SelectItem></SelectContent></Select>
                    </div>
                    <div className="space-y-1"><Label>Address</Label><Input defaultValue="123 Main St, City" /></div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1"><Label>Primary Contact</Label><Input defaultValue="+1 234 567 890" /></div>
                    <div className="space-y-1"><Label>Secondary Contact</Label><Input placeholder="Secondary Number" /></div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- Fees Tab --- */}
        <TabsContent value="fees" className="mt-6">
             <Card>
                <CardHeader><CardTitle>Fee Structure</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {fees.map((fee, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4 items-end">
                            <div className="space-y-1">
                                <Label>Fee Label {index + 1}</Label>
                                <Input 
                                    value={fee.label} 
                                    onChange={(e) => {
                                        const newFees = [...fees];
                                        newFees[index].label = e.target.value;
                                        setFees(newFees);
                                    }} 
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Amount</Label>
                                <Input 
                                    value={fee.amount} 
                                    onChange={(e) => {
                                        const newFees = [...fees];
                                        newFees[index].amount = e.target.value;
                                        setFees(newFees);
                                    }} 
                                />
                            </div>
                        </div>
                    ))}
                    <Button className="w-full mt-4"><Save className="w-4 h-4 mr-2" /> Update Fees</Button>
                </CardContent>
             </Card>
        </TabsContent>

        {/* --- Marks Tab --- */}
        <TabsContent value="marks" className="mt-6 space-y-6">
            {Object.keys(marksData).map((testName) => (
                <Card key={testName}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>{testName}</CardTitle>
                        <Button size="sm" variant="outline" onClick={() => handleAddSubject(testName)}>
                            <Plus className="w-4 h-4 mr-2" /> Add Subject
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {marksData[testName].length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No marks entered for this test yet.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">Subject</TableHead>
                                        <TableHead>Total Marks</TableHead>
                                        <TableHead>Marks Received</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {marksData[testName].map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Select value={row.subject} onValueChange={(val) => updateMarkRow(testName, index, "subject", val)}>
                                                    <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                                                    <SelectContent>
                                                        {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <Input 
                                                    type="number" 
                                                    value={row.total} 
                                                    onChange={(e) => updateMarkRow(testName, index, "total", e.target.value)} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input 
                                                    type="number" 
                                                    value={row.obtained} 
                                                    onChange={(e) => updateMarkRow(testName, index, "obtained", e.target.value)} 
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeMarkRow(testName, index)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            ))}
            <div className="flex justify-end sticky bottom-6">
                <Button size="lg" className="shadow-lg" onClick={handleSaveMarks}>
                    <Save className="w-4 h-4 mr-2" /> Save All Marks
                </Button>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetails;