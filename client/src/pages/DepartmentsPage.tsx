import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import AdminHeader from "@/components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import type { Department } from "@shared/schema";

export default function DepartmentsPage() {
  const { admin, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Department | null>(null);

  useEffect(() => {
    if (!isLoading && !admin) {
      const timer = setTimeout(() => {
        if (!admin) {
          setLocation('/login');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [admin, isLoading, setLocation]);

  const { data: departments = [], isLoading: departmentsLoading, isError: departmentsError } = useQuery<Department[]>({
    queryKey: ['/api/departments'],
    queryFn: async () => {
      const res = await fetch('/api/departments', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch departments');
      return res.json();
    }
  });

  const deptMutation = useMutation({
    mutationFn: (data: any) => {
      if (editingItem) {
        return apiRequest(`/api/departments/${editingItem.department_id}`, 'PATCH', data);
      }
      return apiRequest('/api/departments', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/departments'] });
      toast({ title: "Success", description: `Department ${editingItem ? 'updated' : 'created'} successfully` });
      setEditingItem(null);
      setShowDepartmentModal(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteDeptMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/departments/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/departments'] });
      toast({ title: "Success", description: "Department deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    deptMutation.mutate({
      department_name: formData.get('department_name'),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader notificationCount={0} onNotificationClick={() => {}} />
      
      <main className="pt-24 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Department Management</CardTitle>
                  <CardDescription>Manage hospital departments</CardDescription>
                </div>
                <Button onClick={() => { setEditingItem(null); setShowDepartmentModal(true); }} data-testid="button-add-department">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {departmentsLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading departments...</div>
              ) : departmentsError ? (
                <div className="text-center py-12 text-destructive">Error loading departments</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((dept) => (
                      <TableRow key={dept.department_id}>
                        <TableCell className="font-medium">{dept.department_name}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditingItem(dept); setShowDepartmentModal(true); }}
                            data-testid={`button-edit-department-${dept.department_id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteDeptMutation.mutate(dept.department_id)}
                            data-testid={`button-delete-department-${dept.department_id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Dialog open={showDepartmentModal} onOpenChange={setShowDepartmentModal}>
        <DialogContent data-testid="modal-department">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Add'} Department</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="department_name">Name</Label>
                <Input
                  id="department_name"
                  name="department_name"
                  defaultValue={editingItem?.department_name}
                  required
                  data-testid="input-department-name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" data-testid="button-submit-department">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
