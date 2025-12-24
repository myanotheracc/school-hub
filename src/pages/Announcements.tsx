import { useState } from "react";
import { Plus, Calendar, Users, Edit, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const announcements = [
  {
    id: 1,
    title: "Annual Sports Day Registration",
    description: "Registration for the annual sports day is now open. All students are encouraged to participate in various events including athletics, team sports, and individual competitions.",
    date: "Dec 20, 2024",
    target: "All Students",
    priority: "high",
    status: "Published",
  },
  {
    id: 2,
    title: "Parent-Teacher Meeting",
    description: "PTM for all classes will be held on January 5th, 2025. Parents are requested to collect the progress reports and discuss their child's performance with the teachers.",
    date: "Dec 18, 2024",
    target: "Parents",
    priority: "medium",
    status: "Published",
  },
  {
    id: 3,
    title: "Winter Break Notice",
    description: "School will remain closed from December 25th to January 1st for winter holidays. Wishing everyone happy holidays!",
    date: "Dec 15, 2024",
    target: "All",
    priority: "low",
    status: "Published",
  },
  {
    id: 4,
    title: "Science Fair Announcement",
    description: "Annual science fair will be held on January 15th. Students interested in participating should submit their project proposals by January 5th.",
    date: "Dec 22, 2024",
    target: "Students",
    priority: "medium",
    status: "Scheduled",
  },
];

const priorityColors = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

const Announcements = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Announcements</h1>
          <p className="text-muted-foreground">Create and manage school announcements</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="w-4 h-4" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>
                Create a new announcement to share with students, teachers, or parents.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Announcement title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Write your announcement here..."
                  className="min-h-[120px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="students">Students Only</SelectItem>
                      <SelectItem value="teachers">Teachers Only</SelectItem>
                      <SelectItem value="parents">Parents Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduleDate">Schedule Date (Optional)</Label>
                <Input id="scheduleDate" type="date" />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Schedule
              </Button>
              <Button variant="gradient" className="gap-2" onClick={() => setIsCreateDialogOpen(false)}>
                <Send className="w-4 h-4" />
                Publish Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Announcements Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={priorityColors[announcement.priority as keyof typeof priorityColors]}
                >
                  {announcement.priority}
                </Badge>
                <Badge variant={announcement.status === "Published" ? "default" : "secondary"}>
                  {announcement.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <h3 className="font-display font-semibold text-lg mb-2">{announcement.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {announcement.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {announcement.date}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {announcement.target}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
