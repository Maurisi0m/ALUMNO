import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/use-i18n";
import { useAuth } from "@/hooks/use-auth";
import SettingsPanel from "@/components/ui/settings-panel";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Download,
  Building2,
  Calendar,
  ClipboardList,
  Award,
  Settings,
  FileText,
  LogOut,
  GraduationCap,
  User,
  BookMarked,
} from "lucide-react";

interface AcademicSummary {
  totalMaterias: number;
  promedioGeneral: number;
  materiasAprobadas: number;
  totalCreditos: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user, loading, logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [academicSummary, setAcademicSummary] = useState<AcademicSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAcademicSummary();
    }
  }, [user]);

  const fetchAcademicSummary = async () => {
    try {
      setSummaryLoading(true);
      const token = localStorage.getItem('sigea-token');

      const response = await fetch('/api/auth/academic-summary', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAcademicSummary(data.data);
        console.log('📈 Resumen académico cargado:', data.data);
      } else {
        console.error('Error cargando resumen académico');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lasalle-blue to-lasalle-gold">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Secciones originales de SIGEA para estudiantes
  const quickActions = [
    {
      title: t.sections.subjects,
      description: t.sections.subjectsDesc,
      icon: BookOpen,
      color: "bg-blue-500",
      link: "/materias",
    },
    {
      title: t.sections.downloads,
      description: t.sections.downloadsDesc,
      icon: Download,
      color: "bg-green-500",
      link: "/descargas",
    },
    {
      title: t.sections.detInscription,
      description: t.sections.detInscriptionDesc,
      icon: Building2,
      color: "bg-orange-500",
      link: "/inscripcion-det-af",
    },
    {
      title: t.sections.schoolCalendar,
      description: t.sections.schoolCalendarDesc,
      icon: Calendar,
      color: "bg-purple-600",
      link: "https://www.lasallep.edu.mx/ulsap/AlumnoDocente/Calendario.html",
      external: true,
    },
    {
      title: t.sections.intersemestralReg,
      description: t.sections.intersemestralRegDesc,
      icon: ClipboardList,
      color: "bg-indigo-500",
      link: "/regularizacion-intersemestral",
    },
    {
      title: t.sections.semestralReg,
      description: t.sections.semestralRegDesc,
      icon: ClipboardList,
      color: "bg-purple-500",
      link: "/regularizacion-semestral",
    },
    {
      title: t.sections.extraordinary,
      description: t.sections.extraordinaryDesc,
      icon: FileText,
      color: "bg-yellow-500",
      link: "/extraordinario",
    },
    {
      title: t.sections.chooseStudyArea,
      description: t.sections.chooseStudyAreaDesc,
      icon: BookMarked,
      color: "bg-teal-500",
      link: "/elegir-area-estudios",
    },
    {
      title: t.sections.inscription,
      description: t.sections.inscriptionDesc,
      icon: Award,
      color: "bg-pink-500",
      link: "/inscripcion",
    },
    {
      title: t.sections.reinscription,
      description: t.sections.reinscriptionDesc,
      icon: Award,
      color: "bg-cyan-500",
      link: "/reinscripcion",
    },
    {
      title: t.sections.admission,
      description: t.sections.admissionDesc,
      icon: User,
      color: "bg-gray-500",
      link: "/admision",
    },
    {
      title: t.sections.systemManual,
      description: t.sections.systemManualDesc,
      icon: BookOpen,
      color: "bg-indigo-600",
      link: "/manual",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
          url('https://cdn.builder.io/api/v1/image/assets%2Fb36e4af7e41f44e28ca835fddd3c49bf%2Fc1e9f4b7f5a94e7db1f8c4d6e7c2b9a1?format=webp&width=1920')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-lasalle-blue/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fb36e4af7e41f44e28ca835fddd3c49bf%2F3593875d6b494a9cb99b9a85064b1311?format=webp&width=800"
                  alt="Universidad La Salle Pachuca"
                  className="h-8 w-auto"
                />
                <div>
                  <h1 className="text-xl font-bold text-lasalle-blue dark:text-white">
                    SIGEA
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Universidad La Salle Pachuca
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSettingsOpen(true)}
                  className="text-lasalle-blue hover:text-lasalle-gold hover:bg-lasalle-gold/10 dark:text-white dark:hover:text-lasalle-gold"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t.common.settings}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-lasalle-blue hover:text-red-600 hover:bg-red-50 dark:text-white dark:hover:text-red-400"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t.common.logout}
                </Button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-lasalle-blue/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-lasalle-blue dark:text-white flex items-center">
                  <GraduationCap className="h-6 w-6 mr-2 text-lasalle-gold" />
                  {t.dashboard.welcome}, {user.nombre}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300">
                  Matrícula: {user.matricula} | {user.area_estudios} | {user.semestre}° Semestre
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-lasalle-blue/10 dark:bg-lasalle-blue/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-lasalle-blue dark:text-white">
                      {t.dashboard.studentInfo}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t.dashboard.studentId}: {user.matricula}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t.dashboard.career}: {user.area_estudios}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t.dashboard.semester}: {user.semestre}° Semestre
                    </p>
                  </div>
                  <div className="bg-blue-500/10 dark:bg-blue-500/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-lasalle-blue dark:text-white">
                      {t.dashboard.totalSubjects}
                    </h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {summaryLoading ? '-' : academicSummary?.totalMaterias || 0}
                    </p>
                  </div>
                  <div className="bg-lasalle-gold/10 dark:bg-lasalle-gold/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-lasalle-blue dark:text-white">
                      {t.dashboard.currentGPA}
                    </h3>
                    <p className="text-2xl font-bold text-lasalle-gold dark:text-lasalle-gold">
                      {summaryLoading ? '-' : academicSummary?.promedioGeneral?.toFixed(1) || '0.0'}
                    </p>
                  </div>
                  <div className="bg-green-500/10 dark:bg-green-500/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-lasalle-blue dark:text-white">
                      Materias Aprobadas
                    </h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {summaryLoading ? '-' : academicSummary?.materiasAprobadas || 0}
                    </p>
                  </div>
                  <div className="bg-purple-500/10 dark:bg-purple-500/20 p-4 rounded-lg">
                    <h3 className="font-semibold text-lasalle-blue dark:text-white">
                      Total Créditos
                    </h3>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {summaryLoading ? '-' : academicSummary?.totalCreditos || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {t.dashboard.quickActions}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-lasalle-blue dark:text-white group-hover:text-lasalle-gold transition-colors duration-300">
                            {action.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {action.description}
                      </p>
                      <Button
                        onClick={() => {
                          if (action.external) {
                            window.open(
                              action.link,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          } else {
                            navigate(action.link);
                          }
                        }}
                        className="w-full bg-lasalle-blue hover:bg-lasalle-gold text-white font-semibold transition-all duration-300"
                      >
                        {action.external ? "Abrir Calendario" : "Acceder"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
