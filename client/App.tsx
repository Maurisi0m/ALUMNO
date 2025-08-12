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
          <Route
            path="/materias"
            element={
              <Placeholder
                title={t.sections.subjects}
                description={t.sections.subjectsDesc}
                icon={<BookOpen className="h-16 w-16 text-blue-500" />}
              />
            }
          />
          <Route
            path="/descargas"
            element={
              <Placeholder
                title={t.sections.downloads}
                description={t.sections.downloadsDesc}
                icon={<Download className="h-16 w-16 text-green-500" />}
              />
            }
          />
          <Route
            path="/inscripcion-det-af"
            element={
              <Placeholder
                title={t.sections.detInscription}
                description={t.sections.detInscriptionDesc}
                icon={<Building2 className="h-16 w-16 text-orange-500" />}
              />
            }
          />
          <Route
            path="/regularizacion-intersemestral"
            element={
              <Placeholder
                title={t.sections.intersemestralReg}
                description={t.sections.intersemestralRegDesc}
                icon={<ClipboardList className="h-16 w-16 text-indigo-500" />}
              />
            }
          />
          <Route
            path="/regularizacion-semestral"
            element={
              <Placeholder
                title={t.sections.semestralReg}
                description={t.sections.semestralRegDesc}
                icon={<ClipboardList className="h-16 w-16 text-purple-500" />}
              />
            }
          />
          <Route
            path="/extraordinario"
            element={
              <Placeholder
                title={t.sections.extraordinary}
                description={t.sections.extraordinaryDesc}
                icon={<FileText className="h-16 w-16 text-yellow-500" />}
              />
            }
          />
          <Route
            path="/elegir-area-estudios"
            element={
              <Placeholder
                title={t.sections.chooseStudyArea}
                description={t.sections.chooseStudyAreaDesc}
                icon={<BookMarked className="h-16 w-16 text-teal-500" />}
              />
            }
          />
          <Route
            path="/inscripcion"
            element={
              <Placeholder
                title={t.sections.inscription}
                description={t.sections.inscriptionDesc}
                icon={<Award className="h-16 w-16 text-pink-500" />}
              />
            }
          />
          <Route
            path="/reinscripcion"
            element={
              <Placeholder
                title={t.sections.reinscription}
                description={t.sections.reinscriptionDesc}
                icon={<Award className="h-16 w-16 text-cyan-500" />}
              />
            }
          />
          <Route
            path="/admision"
            element={
              <Placeholder
                title={t.sections.admission}
                description={t.sections.admissionDesc}
                icon={<User className="h-16 w-16 text-gray-500" />}
              />
            }
          />
          <Route path="/manual" element={<Manual />} />
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
