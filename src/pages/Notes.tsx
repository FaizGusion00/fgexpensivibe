
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
import { 
  StickyNote, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  CalendarDays 
} from "lucide-react";
import { getNotes, addNote, updateNote, deleteNote } from "@/lib/storage";
import { Note } from "@/lib/types";
import { format } from "date-fns";
import { toast } from "@/components/ui/sonner";

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  
  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("personal");
  
  // Get all notes
  const loadNotes = () => {
    setNotes(getNotes());
  };
  
  // Load notes on component mount
  useEffect(() => {
    loadNotes();
  }, []);
  
  // Reset form
  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("personal");
    setEditNote(null);
  };
  
  // Handle note creation/update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }
    
    const noteData = {
      title,
      content,
      category
    };
    
    if (editNote) {
      updateNote({
        ...noteData,
        id: editNote.id,
        createdAt: editNote.createdAt,
        updatedAt: new Date().toISOString()
      });
      toast.success("Note updated successfully");
    } else {
      addNote(noteData);
      toast.success("Note created successfully");
    }
    
    resetForm();
    setOpen(false);
    loadNotes();
  };
  
  // Set up form for editing
  const handleEditNote = (note: Note) => {
    setEditNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setOpen(true);
  };
  
  // Handle note deletion
  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    toast.success("Note deleted successfully");
    loadNotes();
  };
  
  // Filter notes by search term and category
  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || note.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Extract unique categories from notes
  const categories = ["personal", "work", "ideas", "study", "travel"];
  
  // Get unique note categories from existing notes
  const uniqueCategories = Array.from(
    new Set(notes.map(note => note.category))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Notes</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search notes..."
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
                <Plus className="mr-2 h-4 w-4" /> New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>
                  {editNote ? "Edit Note" : "Create New Note"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Note title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your note here..."
                      className="min-h-[200px]"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
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
                    {editNote ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={categoryFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategoryFilter("all")}
          className="animate-fade-in"
        >
          All
        </Button>
        {uniqueCategories.map((cat, index) => (
          <Button
            key={cat}
            variant={categoryFilter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter(cat)}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>
      
      {filteredNotes.length === 0 ? (
        <Card className="animate-fade-in">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <StickyNote className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-xl font-medium mb-2">No notes found</p>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== "all"
                ? "Try changing your search or filter"
                : "Get started by creating your first note"}
            </p>
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create a new note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note, index) => (
            <Card 
              key={note.id} 
              className="card-hover animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {note.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground min-h-[80px] whitespace-pre-wrap">
                  {note.content.length > 200
                    ? note.content.substring(0, 200) + "..."
                    : note.content}
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    {format(new Date(note.updatedAt), "MMM d, yyyy")}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditNote(note)}
                      className="h-8 px-2"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive h-8 px-2"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
