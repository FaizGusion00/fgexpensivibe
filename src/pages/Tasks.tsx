
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  Circle,
  Search
} from "lucide-react";
import { 
  getTasks, 
  addTask, 
  updateTask, 
  deleteTask 
} from "@/lib/storage";
import { Task } from "@/lib/types";
import { format } from "date-fns";
import { toast } from "@/components/ui/sonner";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState("work");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Get all tasks
  const loadTasks = () => {
    setTasks(getTasks());
  };
  
  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);
  
  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategory("work");
    setDueDate(undefined);
    setEditTask(null);
  };
  
  // Handle task creation/update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    const taskData = {
      title,
      description,
      priority,
      category,
      completed: editTask ? editTask.completed : false,
      dueDate: dueDate ? dueDate.toISOString() : undefined
    };
    
    if (editTask) {
      updateTask({
        ...taskData,
        id: editTask.id,
        createdAt: editTask.createdAt
      });
      toast.success("Task updated successfully");
    } else {
      addTask(taskData);
      toast.success("Task created successfully");
    }
    
    resetForm();
    setOpen(false);
    loadTasks();
  };
  
  // Set up form for editing
  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority);
    setCategory(task.category);
    setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
    setOpen(true);
  };
  
  // Handle task deletion
  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast.success("Task deleted successfully");
    loadTasks();
  };
  
  // Toggle task completion
  const toggleTaskCompletion = (task: Task) => {
    const updatedTask = {
      ...task,
      completed: !task.completed
    };
    updateTask(updatedTask);
    loadTasks();
  };
  
  // Filter tasks by search term
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Group tasks by completion status
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);
  
  // Task categories
  const categories = ["work", "personal", "shopping", "health", "education", "finance"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Tasks</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tasks..."
              className="pl-8 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="flex-shrink-0"
              >
                <Plus className="mr-2 h-4 w-4" /> New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>
                  {editTask ? "Edit Task" : "Create New Task"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Task title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Task description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={priority}
                        onValueChange={(value: any) => setPriority(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={category}
                        onValueChange={setCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date (optional)</Label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dueDate}
                          onSelect={(date) => {
                            setDueDate(date);
                            setCalendarOpen(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editTask ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
              <TabsTrigger value="pending">
                Pending ({pendingTasks.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedTasks.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="mt-4">
              {pendingTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-xl font-medium mb-2">No pending tasks</p>
                  <p className="text-muted-foreground mb-4">
                    You don't have any pending tasks at the moment.
                  </p>
                  <Button onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create a new task
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="border rounded-lg p-4 flex items-start animate-scale-in hover:shadow-sm transition-all"
                    >
                      <button
                        onClick={() => toggleTaskCompletion(task)}
                        className="mt-1 mr-3 flex-shrink-0"
                      >
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-medium">{task.title}</h3>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            {task.dueDate && (
                              <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                                {format(new Date(task.dueDate), "MMM d")}
                              </span>
                            )}
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                task.priority === "high"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  : task.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              }`}
                            >
                              {task.priority}
                            </span>
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                              {task.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex mt-3 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditTask(task)}
                          >
                            <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              {completedTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-xl font-medium mb-2">No completed tasks</p>
                  <p className="text-muted-foreground">
                    Complete some tasks to see them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="border rounded-lg p-4 flex items-start animate-scale-in hover:shadow-sm transition-all"
                    >
                      <button
                        onClick={() => toggleTaskCompletion(task)}
                        className="mt-1 mr-3 flex-shrink-0"
                      >
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </button>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-medium line-through text-muted-foreground">
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-through">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                              {task.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex mt-3 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default TasksPage;
