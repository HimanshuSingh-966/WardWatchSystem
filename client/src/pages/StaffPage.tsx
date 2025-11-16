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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import type { Staff, Department } from "@shared/schema";

export default function StaffPage() {
  const { admin, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Staff | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

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

  useEffect(() => {
    if (editingItem) {
      setSelectedRole(editingItem.role);
      setSelectedDepartment(editingItem.department_id || '');
    }
  }, [editingItem]);

  const { data: staff = [], isLoading: staffLoading, isError: staffError } = useQuery<Staff[]>({
    queryKey: ['/api/staff'],
    queryFn: async () => {
      const res = await fetch('/api/staff', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch staff');
      return res.json();
    }
  });

  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ['/api/departments'],
    queryFn: async () => {
      const res = await fetch('/api/departments', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch departments');
      return res.json();
    }
  });

  const staffMutation = useMutation({
    mutationFn: (data: any) => {
      if (editingItem) {
        return apiRequest(`/api/staff/${editingItem.staff_id}`, 'PATCH', data);
      }
      return apiRequest('/api/staff', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staff'] });
      toast({ title: "Success", description: `Staff ${editingItem ? 'updated' : 'created'} successfully` });
      setEditingItem(null);
      setShowStaffModal(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteStaffMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/staff/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staff'] });
      toast({ title: "Success", description: "Staff member deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({ 
        title: "Validation Error", 
        description: "Please select a role", 
        variant: "destructive" 
      });
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    staffMutation.mutate({
      staff_name: formData.get('staff_name'),
      role: selectedRole,
      department_id: selectedDepartment || undefined,
      contact_number: formData.get('contact_number'),
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
                  <CardTitle>Staff Management</CardTitle>
                  <CardDescription>Manage hospital staff members</CardDescription>
                </div>
                <Button onClick={() => { 
                  setEditingItem(null); 
                  setSelectedRole('');
                  setSelectedDepartment('');
                  setShowStaffModal(true); 
                }} data-testid="button-add-staff">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {staffLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading staff...</div>
              ) : staffError ? (
                <div className="text-center py-12 text-destructive">Error loading staff</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((member) => {
                      const dept = departments.find(d => d.department_id === member.department_id);
                      return (
                        <TableRow key={member.staff_id}>
                          <TableCell className="font-medium">{member.staff_name}</TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>{dept?.department_name || 'N/A'}</TableCell>
                          <TableCell>{member.contact_number || 'N/A'}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { 
                                setEditingItem(member); 
                                setSelectedRole(member.role);
                                setSelectedDepartment(member.department_id || '');
                                setShowStaffModal(true); 
                              }}
                              data-testid={`button-edit-staff-${member.staff_id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteStaffMutation.mutate(member.staff_id)}
                              data-testid={`button-delete-staff-${member.staff_id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Dialog open={showStaffModal} onOpenChange={(open) => {
        setShowStaffModal(open);
        if (!open) {
          setSelectedRole('');
          setSelectedDepartment('');
        }
      }}>
        <DialogContent data-testid="modal-staff">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Add'} Staff Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="staff_name">Name</Label>
                <Input
                  id="staff_name"
                  name="staff_name"
                  defaultValue={editingItem?.staff_name}
                  required
                  data-testid="input-staff-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole} required>
                  <SelectTrigger data-testid="select-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Nurse">Nurse</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="role" value={selectedRole} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department_id">Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger data-testid="select-department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.department_id} value={dept.department_id}>
                        {dept.department_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="department_id" value={selectedDepartment} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                  id="contact_number"
                  name="contact_number"
                  defaultValue={editingItem?.contact_number || ''}
                  data-testid="input-contact-number"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" data-testid="button-submit-staff">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
