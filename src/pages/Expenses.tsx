
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { 
  DollarSign, 
  Plus, 
  Edit2, 
  Trash2,
  Calendar as CalendarIcon,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowDown,
  ArrowUp
} from "lucide-react";
import { getExpenses, addExpense, updateExpense, deleteExpense } from "@/lib/storage";
import { Expense } from "@/lib/types";
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { toast } from "@/components/ui/sonner";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [open, setOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [chartView, setChartView] = useState<"category" | "daily">("category");
  
  // Form states
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Get all expenses
  const loadExpenses = () => {
    setExpenses(getExpenses());
  };
  
  // Load expenses on component mount
  useEffect(() => {
    loadExpenses();
  }, []);
  
  // Reset form
  const resetForm = () => {
    setAmount("");
    setDescription("");
    setCategory("food");
    setDate(new Date());
    setEditExpense(null);
  };
  
  // Handle expense creation/update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    
    const expenseData = {
      amount: Number(amount),
      description,
      category,
      date: date.toISOString()
    };
    
    if (editExpense) {
      updateExpense({
        ...expenseData,
        id: editExpense.id
      });
      toast.success("Expense updated successfully");
    } else {
      addExpense(expenseData);
      toast.success("Expense added successfully");
    }
    
    resetForm();
    setOpen(false);
    loadExpenses();
  };
  
  // Set up form for editing
  const handleEditExpense = (expense: Expense) => {
    setEditExpense(expense);
    setAmount(expense.amount.toString());
    setDescription(expense.description);
    setCategory(expense.category);
    setDate(new Date(expense.date));
    setOpen(true);
  };
  
  // Handle expense deletion
  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    toast.success("Expense deleted successfully");
    loadExpenses();
  };
  
  // Filter expenses for the selected month
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= monthStart && expenseDate <= monthEnd;
  });
  
  // Calculate total for the selected month
  const totalForMonth = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Group expenses by category for pie chart
  const expensesByCategory = filteredExpenses.reduce((acc: Record<string, number>, expense) => {
    if (acc[expense.category]) {
      acc[expense.category] += expense.amount;
    } else {
      acc[expense.category] = expense.amount;
    }
    return acc;
  }, {});
  
  const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));
  
  // Group expenses by day for bar chart
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const expensesByDay = days.map(day => {
    const dayExpenses = filteredExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getDate() === day.getDate() &&
        expenseDate.getMonth() === day.getMonth() &&
        expenseDate.getFullYear() === day.getFullYear()
      );
    });
    
    const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      name: format(day, "dd"),
      value: total,
    };
  });
  
  // Define chart colors
  const EXPENSE_COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE', '#F5F3FF', '#6D28D9', '#5B21B6'];
  
  // Expense categories
  const categories = ["food", "transportation", "entertainment", "utilities", "shopping", "health", "education", "other"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Expenses</h1>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="flex-shrink-0"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {editExpense ? "Edit Expense" : "Add New Expense"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        className="pl-8"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
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
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="What was this expense for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                          setDate(date || new Date());
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
                  {editExpense ? "Update" : "Add"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <Card className="card-hover animate-slide-in-bottom" style={{ animationDelay: '0ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalForMonth.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              For {format(selectedDate, "MMMM yyyy")}
            </p>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-in-bottom card-hover" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Month</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "MMMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-in-bottom card-hover" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chart View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={chartView === "category" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setChartView("category")}
              >
                <PieChartIcon className="h-4 w-4 mr-2" /> Category
              </Button>
              <Button
                variant={chartView === "daily" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setChartView("daily")}
              >
                <BarChart3 className="h-4 w-4 mr-2" /> Daily
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-slide-in-bottom" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle>
              {chartView === "category" ? "Expenses by Category" : "Daily Expenses"}
            </CardTitle>
            <CardDescription>
              {format(selectedDate, "MMMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {chartView === "category" ? (
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                    </PieChart>
                  ) : (
                    <BarChart data={expensesByDay}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-72 items-center justify-center">
                <p className="text-muted-foreground">No expense data for this month</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="animate-slide-in-bottom" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle>Expense Transactions</CardTitle>
            <CardDescription>
              {format(selectedDate, "MMMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length > 0 ? (
              <div className="space-y-4 overflow-y-auto max-h-72">
                {filteredExpenses
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((expense, index) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 border rounded-md animate-fade-in hover:bg-muted/40 transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{expense.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(expense.date), "MMM d, yyyy")}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-secondary rounded-full">
                              {expense.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">${expense.amount.toFixed(2)}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-muted-foreground"
                            onClick={() => handleEditExpense(expense)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() => handleDeleteExpense(expense.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center h-72">
                <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xl font-medium mb-2">No expenses found</p>
                <p className="text-muted-foreground mb-4">
                  No expenses recorded for {format(selectedDate, "MMMM yyyy")}
                </p>
                <Button onClick={() => setOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add an expense
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpensesPage;
