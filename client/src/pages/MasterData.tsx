import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import AdminHeader from "@/components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Pill, Stethoscope, FlaskConical, Users, Building } from "lucide-react";
import type { Medication, Procedure, Investigation, Staff, Department } from "@shared/schema";

export default function MasterData() {
  const { toast } = useToast();
  const { admin, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("medications");

  // Redirect to login if not authenticated (only after loading completes)
  useEffect(() => {
    if (!isLoading && !admin) {
      setLocation('/login');
    }
  }, [admin, isLoading, setLocation]);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [showProcedureModal, setShowProcedureModal] = useState(false);
  const [showInvestigationModal, setShowInvestigationModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Fetch data with loading and error states
  const { data: medications = [], isLoading: medicationsLoading, isError: medicationsError } = useQuery<Medication[]>({
    queryKey: ['/api/medications'],
    queryFn: async () => {
      const res = await fetch('/api/medications', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch medications');
      return res.json();
    }
  });

  const { data: procedures = [], isLoading: proceduresLoading, isError: proceduresError } = useQuery<Procedure[]>({
    queryKey: ['/api/procedures'],
    queryFn: async () => {
      const res = await fetch('/api/procedures', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch procedures');
      return res.json();
    }
  });

  const { data: investigations = [], isLoading: investigationsLoading, isError: investigationsError } = useQuery<Investigation[]>({
    queryKey: ['/api/investigations'],
    queryFn: async () => {
      const res = await fetch('/api/investigations', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch investigations');
      return res.json();
    }
  });

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

  // Medication mutations
  const medMutation = useMutation({
    mutationFn: (data: any) => {
      if (editingItem) {
        return apiRequest(`/api/medications/${editingItem.medication_id}`, 'PATCH', data);
      }
      return apiRequest('/api/medications', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/medications'] });
      toast({ title: "Success", description: `Medication ${editingItem ? 'updated' : 'created'} successfully` });
      setEditingItem(null);
      setShowMedicationModal(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Procedure mutations
  const procMutation = useMutation({
    mutationFn: (data: any) => {
      if (editingItem) {
        return apiRequest(`/api/procedures/${editingItem.procedure_id}`, 'PATCH', data);
      }
      return apiRequest('/api/procedures', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/procedures'] });
      toast({ title: "Success", description: `Procedure ${editingItem ? 'updated' : 'created'} successfully` });
      setEditingItem(null);
      setShowProcedureModal(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Investigation mutations
  const invMutation = useMutation({
    mutationFn: (data: any) => {
      if (editingItem) {
        return apiRequest(`/api/investigations/${editingItem.investigation_id}`, 'PATCH', data);
      }
      return apiRequest('/api/investigations', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/investigations'] });
      toast({ title: "Success", description: `Investigation ${editingItem ? 'updated' : 'created'} successfully` });
      setEditingItem(null);
      setShowInvestigationModal(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Staff mutations
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

  // Department mutations
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

  // Delete mutations
  const deleteMedMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/medications/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/medications'] });
      toast({ title: "Success", description: "Medication deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteProcMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/procedures/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/procedures'] });
      toast({ title: "Success", description: "Procedure deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteInvMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/investigations/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/investigations'] });
      toast({ title: "Success", description: "Investigation deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteStaffMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/staff/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staff'] });
      toast({ title: "Success", description: "Staff deleted successfully" });
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

  return (
    <div>
      <AdminHeader
        notificationCount={0}
        adminName={admin?.full_name || "Admin"}
        onNotificationClick={() => {}}
      />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Master Data Management</h2>
              <p className="text-muted-foreground">
                Manage medications, procedures, investigations, staff, and departments
              </p>
            </div>
            <Button variant="outline" onClick={() => setLocation('/admin/dashboard')}>
              Back to Dashboard
            </Button>
          </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="medications" data-testid="tab-medications">
            <Pill className="h-4 w-4 mr-2" />
            Medications
          </TabsTrigger>
          <TabsTrigger value="procedures" data-testid="tab-procedures">
            <Stethoscope className="h-4 w-4 mr-2" />
            Procedures
          </TabsTrigger>
          <TabsTrigger value="investigations" data-testid="tab-investigations">
            <FlaskConical className="h-4 w-4 mr-2" />
            Investigations
          </TabsTrigger>
          <TabsTrigger value="staff" data-testid="tab-staff">
            <Users className="h-4 w-4 mr-2" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="departments" data-testid="tab-departments">
            <Building className="h-4 w-4 mr-2" />
            Departments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Medications</CardTitle>
                  <CardDescription>Manage medication catalog</CardDescription>
                </div>
                <Button onClick={() => { setEditingItem(null); setShowMedicationModal(true); }} data-testid="button-add-medication">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {medicationsLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading medications...</div>
              ) : medicationsError ? (
                <div className="text-center py-12 text-destructive">Error loading medications</div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Form</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((med) => (
                    <TableRow key={med.medication_id}>
                      <TableCell className="font-medium">{med.medication_name}</TableCell>
                      <TableCell>{med.dosage || 'N/A'}</TableCell>
                      <TableCell>{med.form || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditingItem(med); setShowMedicationModal(true); }}
                            data-testid={`button-edit-${med.medication_id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMedMutation.mutate(med.medication_id)}
                            data-testid={`button-delete-${med.medication_id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedures">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Procedures</CardTitle>
                  <CardDescription>Manage procedure catalog</CardDescription>
                </div>
                <Button onClick={() => { setEditingItem(null); setShowProcedureModal(true); }} data-testid="button-add-procedure">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Procedure
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {proceduresLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading procedures...</div>
              ) : proceduresError ? (
                <div className="text-center py-12 text-destructive">Error loading procedures</div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {procedures.map((proc) => (
                    <TableRow key={proc.procedure_id}>
                      <TableCell className="font-medium">{proc.procedure_name}</TableCell>
                      <TableCell>{proc.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditingItem(proc); setShowProcedureModal(true); }}
                            data-testid={`button-edit-${proc.procedure_id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteProcMutation.mutate(proc.procedure_id)}
                            data-testid={`button-delete-${proc.procedure_id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investigations">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Investigations</CardTitle>
                  <CardDescription>Manage investigation catalog</CardDescription>
                </div>
                <Button onClick={() => { setEditingItem(null); setShowInvestigationModal(true); }} data-testid="button-add-investigation">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Investigation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {investigationsLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading investigations...</div>
              ) : investigationsError ? (
                <div className="text-center py-12 text-destructive">Error loading investigations</div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Normal Range</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investigations.map((inv) => (
                    <TableRow key={inv.investigation_id}>
                      <TableCell className="font-medium">{inv.investigation_name}</TableCell>
                      <TableCell>{inv.description}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{inv.normal_range || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditingItem(inv); setShowInvestigationModal(true); }}
                            data-testid={`button-edit-${inv.investigation_id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteInvMutation.mutate(inv.investigation_id)}
                            data-testid={`button-delete-${inv.investigation_id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Staff Members</CardTitle>
                  <CardDescription>Manage hospital staff</CardDescription>
                </div>
                <Button onClick={() => { setEditingItem(null); setShowStaffModal(true); }} data-testid="button-add-staff">
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
                  {staff.map((s) => {
                    const dept = departments.find(d => d.department_id === s.department_id);
                    return (
                      <TableRow key={s.staff_id}>
                        <TableCell className="font-medium">{s.staff_name}</TableCell>
                        <TableCell>{s.role}</TableCell>
                        <TableCell>{dept?.department_name || 'N/A'}</TableCell>
                        <TableCell className="text-sm">{s.contact_number || s.email || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { setEditingItem(s); setShowStaffModal(true); }}
                              data-testid={`button-edit-${s.staff_id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteStaffMutation.mutate(s.staff_id)}
                              data-testid={`button-delete-${s.staff_id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Departments</CardTitle>
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
                    <TableHead>Department Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.department_id}>
                      <TableCell className="font-medium">{dept.department_name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditingItem(dept); setShowDepartmentModal(true); }}
                            data-testid={`button-edit-${dept.department_id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteDeptMutation.mutate(dept.department_id)}
                            data-testid={`button-delete-${dept.department_id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <MedicationModal
        open={showMedicationModal}
        onClose={() => { setShowMedicationModal(false); setEditingItem(null); }}
        onSubmit={medMutation.mutate}
        editingItem={editingItem}
      />
      <ProcedureModal
        open={showProcedureModal}
        onClose={() => { setShowProcedureModal(false); setEditingItem(null); }}
        onSubmit={procMutation.mutate}
        editingItem={editingItem}
      />
      <InvestigationModal
        open={showInvestigationModal}
        onClose={() => { setShowInvestigationModal(false); setEditingItem(null); }}
        onSubmit={invMutation.mutate}
        editingItem={editingItem}
      />
      <StaffModal
        open={showStaffModal}
        onClose={() => { setShowStaffModal(false); setEditingItem(null); }}
        onSubmit={staffMutation.mutate}
        editingItem={editingItem}
        departments={departments}
      />
      <DepartmentModal
        open={showDepartmentModal}
        onClose={() => { setShowDepartmentModal(false); setEditingItem(null); }}
        onSubmit={deptMutation.mutate}
        editingItem={editingItem}
      />
      </div>
    </div>
  </div>
  );
}

// Medication Modal
function MedicationModal({ open, onClose, onSubmit, editingItem }: any) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      medication_name: formData.get('medication_name') as string,
      dosage: formData.get('dosage') as string || undefined,
      form: formData.get('form') as string || undefined,
    };
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit' : 'Add'} Medication</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="medication_name">Medication Name</Label>
              <Input id="medication_name" name="medication_name" defaultValue={editingItem?.medication_name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input id="dosage" name="dosage" defaultValue={editingItem?.dosage} placeholder="e.g., 500mg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form">Form</Label>
              <Input id="form" name="form" defaultValue={editingItem?.form} placeholder="e.g., Tablet, Capsule" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Procedure Modal
function ProcedureModal({ open, onClose, onSubmit, editingItem }: any) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      procedure_name: formData.get('procedure_name') as string,
      description: formData.get('description') as string,
    };
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit' : 'Add'} Procedure</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="procedure_name">Procedure Name</Label>
              <Input id="procedure_name" name="procedure_name" defaultValue={editingItem?.procedure_name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={editingItem?.description} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Investigation Modal
function InvestigationModal({ open, onClose, onSubmit, editingItem }: any) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      investigation_name: formData.get('investigation_name') as string,
      description: formData.get('description') as string,
      normal_range: formData.get('normal_range') as string || undefined,
    };
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit' : 'Add'} Investigation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="investigation_name">Investigation Name</Label>
              <Input id="investigation_name" name="investigation_name" defaultValue={editingItem?.investigation_name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={editingItem?.description} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="normal_range">Normal Range</Label>
              <Input id="normal_range" name="normal_range" defaultValue={editingItem?.normal_range} placeholder="e.g., 70-100 mg/dL" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Staff Modal
function StaffModal({ open, onClose, onSubmit, editingItem, departments }: any) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      staff_name: formData.get('staff_name') as string,
      role: formData.get('role') as string,
      department_id: formData.get('department_id') as string || undefined,
      contact_number: formData.get('contact_number') as string || undefined,
      email: formData.get('email') as string || undefined,
    };
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit' : 'Add'} Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="staff_name">Name</Label>
              <Input id="staff_name" name="staff_name" defaultValue={editingItem?.staff_name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" defaultValue={editingItem?.role || 'Nurse'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department_id">Department</Label>
              <Select name="department_id" defaultValue={editingItem?.department_id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept: Department) => (
                    <SelectItem key={dept.department_id} value={dept.department_id}>
                      {dept.department_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_number">Contact Number</Label>
              <Input id="contact_number" name="contact_number" defaultValue={editingItem?.contact_number} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" defaultValue={editingItem?.email} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Department Modal
function DepartmentModal({ open, onClose, onSubmit, editingItem }: any) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      department_name: formData.get('department_name') as string,
    };
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit' : 'Add'} Department</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="department_name">Department Name</Label>
              <Input id="department_name" name="department_name" defaultValue={editingItem?.department_name} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
