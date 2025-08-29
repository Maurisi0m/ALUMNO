import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoadingProvider, useLoading } from "@/hooks/use-loading";
import { UserProvider } from "@/hooks/use-user";
import { I18nProvider, useI18n } from "@/hooks/use-i18n";
import Loading from "@/components/ui/loading";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  BookOpen,
  Download,
  Building2,
  Calendar,
  ClipboardList,
  Award,
  Settings,
  FileText,
  BookMarked,
  User,
} from "lucide-react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Manual from "./pages/Manual";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import MateriasNew from "./pages/MateriasNew";
import InscripcionDetAf from "./pages/InscripcionDetAf";
import InscripcionDetAfNew from "./pages/InscripcionDetAfNew";
import Extraordinario from "./pages/Extraordinario";
import RegularizacionIntersemestral from "./pages/RegularizacionIntersemestral";
import RegularizacionSemestral from "./pages/RegularizacionSemestral";
import Diagnostico from "./pages/Diagnostico";
import BulkUsers from "./pages/BulkUsers";
import Downloads from "./pages/Downloads";
import StudyAreaSelection from "./pages/StudyAreaSelection";
import Inscription from "./pages/Inscription";
import Reinscription from "./pages/Reinscription";
import Admission from "./pages/Admission";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoading } = useLoading();
  const { t } = useI18n();

  return (
    <>
      <Loading show={isLoading} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Secciones Oficiales de SIGEA para Estudiantes */}
          <Route path="/materias" element={<MateriasNew />} />
          <Route path="/descargas" element={<Downloads />} />
          <Route path="/inscripcion-det-af" element={<InscripcionDetAfNew />} />
          <Route path="/inscripcion-det-af-old" element={<InscripcionDetAf />} />
          <Route path="/regularizacion-intersemestral" element={<RegularizacionIntersemestral />} />
          <Route path="/regularizacion-semestral" element={<RegularizacionSemestral />} />
          <Route path="/extraordinario" element={<Extraordinario />} />
          <Route path="/elegir-area-estudios" element={<StudyAreaSelection />} />
          <Route path="/inscripcion" element={<Inscription />} />
          <Route path="/reinscripcion" element={<Reinscription />} />
          <Route path="/admision" element={<Admission />} />
          <Route path="/manual" element={<Manual />} />
          <Route path="/diagnostico" element={<Diagnostico />} />
          <Route path="/admin/bulk-users" element={<BulkUsers />} />
          <Route
            path="/soporte"
            element={
              <Placeholder
                title={t.sections.systemManual}
                description={t.sections.systemManualDesc}
                icon={<BookOpen className="h-16 w-16 text-indigo-600" />}
              />
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Placeholder
                title={t.auth.recoverPassword}
                description={t.auth.enterCredentials}
                icon={<Settings className="h-16 w-16 text-red-600" />}
              />
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <UserProvider>
        <LoadingProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </LoadingProvider>
      </UserProvider>
    </I18nProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
