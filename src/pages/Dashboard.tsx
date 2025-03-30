
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, StickyNote, DollarSign, ArrowRight } from "lucide-react";
import { getTasks, getNotes, getExpenses } from "@/lib/storage";
import { Link } from "react-router-dom";
import { Task, Note, Expense } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  
  useEffect(() => {
    setTasks(getTasks());
    setNotes(getNotes());
    setExpenses(getExpenses());
  }, []);
  
  // Task statistics
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  
  const taskData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks },
  ];
  
  const TASK_COLORS = ['#8B5CF6', '#E2E8F0'];
  
  // Expense statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  expenses.forEach(expense => {
    if (expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] += expense.amount;
    } else {
      expensesByCategory[expense.category] = expense.amount;
    }
  });
  
  const expenseData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));
  
  const EXPENSE_COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-hover animate-slide-in-bottom" style={{ animationDelay: '0ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completed, {pendingTasks} pending
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover animate-slide-in-bottom" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes</CardTitle>
            <StickyNote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notes.length}</div>
            <p className="text-xs text-muted-foreground">
              {notes.length > 0 ? 'Notes created' : 'No notes yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover animate-slide-in-bottom" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.length} expense records
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-slide-in-bottom" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle>Task Progress</CardTitle>
            <CardDescription>Your task completion status</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {taskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={TASK_COLORS[index % TASK_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-60 items-center justify-center">
                <p className="text-muted-foreground">No task data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="animate-slide-in-bottom" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Your spending distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expenseData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-60 items-center justify-center">
                <p className="text-muted-foreground">No expense data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-slide-in-bottom" style={{ animationDelay: '500ms' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Your latest tasks</CardDescription>
            </div>
            <Link
              to="/tasks"
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tasks.length > 0 ? (
                tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between border rounded-md p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          task.completed ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                      <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                        {task.title}
                      </span>
                    </div>
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
                  </div>
                ))
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">No tasks available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-slide-in-bottom" style={{ animationDelay: '600ms' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Notes</CardTitle>
              <CardDescription>Your latest notes</CardDescription>
            </div>
            <Link
              to="/notes"
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              View all <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notes.length > 0 ? (
                notes.slice(0, 5).map((note) => (
                  <div
                    key={note.id}
                    className="border rounded-md p-3"
                  >
                    <div className="font-medium">{note.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {note.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-40 items-center justify-center">
                  <p className="text-muted-foreground">No notes available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
