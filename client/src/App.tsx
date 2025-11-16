import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import DashboardHome from "@/pages/DashboardHome";
import OverviewPage from "@/pages/OverviewPage";
import MedicationsPage from "@/pages/MedicationsPage";
import ProceduresPage from "@/pages/ProceduresPage";
import InvestigationsPage from "@/pages/InvestigationsPage";
import PatientsPage from "@/pages/PatientsPage";
import NursingNotesPage from "@/pages/NursingNotesPage";
import VitalSignsPage from "@/pages/VitalSignsPage";
import StaffPage from "@/pages/StaffPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import MasterData from "@/pages/MasterData";
import TreatmentHistoryPage from "@/pages/TreatmentHistoryPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/admin/dashboard" component={DashboardHome} />
      <Route path="/admin/overview" component={OverviewPage} />
      <Route path="/admin/medications" component={MedicationsPage} />
      <Route path="/admin/procedures" component={ProceduresPage} />
      <Route path="/admin/investigations" component={InvestigationsPage} />
      <Route path="/admin/patients" component={PatientsPage} />
      <Route path="/admin/nursing-notes" component={NursingNotesPage} />
      <Route path="/admin/vital-signs" component={VitalSignsPage} />
      <Route path="/admin/staff" component={StaffPage} />
      <Route path="/admin/departments" component={DepartmentsPage} />
      <Route path="/admin/master-data" component={MasterData} />
      <Route path="/admin/treatment-history" component={TreatmentHistoryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
