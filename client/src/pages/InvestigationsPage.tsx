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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import type { Investigation } from "@shared/schema";

export default function InvestigationsPage() {
  const { admin, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Investigation | null>(null);

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

  const investigationMutation = useMutation({
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
      setShowModal(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteInvestigationMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/investigations/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/investigations'] });
      toast({ title: "Success", description: "Investigation deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    investigationMutation.mutate({
      investigation_name: formData.get('investigation_name'),
      description: formData.get('description'),
      normal_range: formData.get('normal_range') || null,
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
                  <CardTitle>Investigations Management</CardTitle>
                  <CardDescription>Manage hospital investigation catalog</CardDescription>
                </div>
                <Button onClick={() => { setEditingItem(null); setShowModal(true); }} data-testid="button-add-investigation">
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
                    {investigations.map((investigation) => (
                      <TableRow key={investigation.investigation_id}>
                        <TableCell className="font-medium">{investigation.investigation_name}</TableCell>
                        <TableCell>{investigation.description}</TableCell>
                        <TableCell>{investigation.normal_range || 'N/A'}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setEditingItem(investigation); setShowModal(true); }}
                            data-testid={`button-edit-investigation-${investigation.investigation_id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteInvestigationMutation.mutate(investigation.investigation_id)}
                            data-testid={`button-delete-investigation-${investigation.investigation_id}`}
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
      
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent data-testid="modal-investigation">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Add'} Investigation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="investigation_name">Name</Label>
                <Input
                  id="investigation_name"
                  name="investigation_name"
                  defaultValue={editingItem?.investigation_name}
                  required
                  data-testid="input-investigation-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description}
                  required
                  data-testid="input-investigation-description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="normal_range">Normal Range</Label>
                <Input
                  id="normal_range"
                  name="normal_range"
                  defaultValue={editingItem?.normal_range || ''}
                  placeholder="e.g., 70-100 mg/dL"
                  data-testid="input-normal-range"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" data-testid="button-submit-investigation">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
