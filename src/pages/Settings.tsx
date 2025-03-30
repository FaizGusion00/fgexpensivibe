
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Sun, 
  Moon, 
  Laptop, 
  Trash2, 
  Download, 
  Upload,
  Settings as SettingsIcon
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { clearAllData, exportData, importData } from "@/lib/storage";
import { toast } from "@/components/ui/sonner";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [importValue, setImportValue] = useState<string>("");
  
  const handleExportData = () => {
    const data = exportData();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(data);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "expensivibe_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success("Data exported successfully");
  };
  
  const handleImportData = () => {
    try {
      if (!importValue.trim()) {
        toast.error("No data to import");
        return;
      }
      
      const success = importData(importValue);
      
      if (success) {
        toast.success("Data imported successfully");
        setImportValue("");
      } else {
        toast.error("Failed to import data");
      }
    } catch (error) {
      toast.error("Invalid JSON data");
    }
  };
  
  const handleClearData = () => {
    clearAllData();
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
          <TabsTrigger value="appearance">
            <Sun className="h-4 w-4 mr-2" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="data">
            <SettingsIcon className="h-4 w-4 mr-2" /> Data Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="mt-4">
          <Card className="animate-slide-in-bottom">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how expensivibe looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4 mr-2" /> Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4 mr-2" /> Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setTheme("system")}
                  >
                    <Laptop className="h-4 w-4 mr-2" /> System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="mt-4">
          <Card className="animate-slide-in-bottom">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export, import, or clear your application data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Export & Import</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={handleExportData}
                  >
                    <Download className="h-4 w-4 mr-2" /> Export Data
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="justify-start">
                        <Upload className="h-4 w-4 mr-2" /> Import Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Import Data</AlertDialogTitle>
                        <AlertDialogDescription>
                          Paste the exported JSON data below. This will replace all your current data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="py-4">
                        <textarea
                          className="w-full h-40 p-2 border rounded-md bg-background"
                          placeholder='Paste your JSON data here...'
                          value={importValue}
                          onChange={(e) => setImportValue(e.target.value)}
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleImportData}>
                          Import
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Clear Data</Label>
                <div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="justify-start">
                        <Trash2 className="h-4 w-4 mr-2" /> Clear All Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete all your tasks, notes, and expenses.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearData}>
                          Clear data
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
