import { useState } from "react";
import { Search, Plus, Eye, Edit, Trash2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const teachersData = [
  { id: 1, name: "Dr. Sarah Johnson", email: "sarah.j@school.edu", phone: "+1 234-567-8910", subject: "Mathematics", classes: ["10-A", "11-A"], status: "Active", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
  { id: 2, name: "Prof. Robert Williams", email: "robert.w@school.edu", phone: "+1 234-567-8911", subject: "Physics", classes: ["11-A", "12-A"], status: "Active", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: 3, name: "Ms. Emily Brown", email: "emily.b@school.edu", phone: "+1 234-567-8912", subject: "English", classes: ["9-A", "9-B", "10-A"], status: "Active", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
  { id: 4, name: "Mr. David Lee", email: "david.l@school.edu", phone: "+1 234-567-8913", subject: "Chemistry", classes: ["10-B", "11-A"], status: "On Leave", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face" },
  { id: 5, name: "Mrs. Jennifer Davis", email: "jennifer.d@school.edu", phone: "+1 234-567-8914", subject: "Biology", classes: ["9-A", "10-A"], status: "Active", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
];

const Teachers = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeachers = teachersData.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Teachers</h1>
          <p className="text-muted-foreground">Manage teacher profiles and assignments</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Teacher
        </Button>
      </div>

      {/* Search */}
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

      {/* Teachers Grid */}
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
