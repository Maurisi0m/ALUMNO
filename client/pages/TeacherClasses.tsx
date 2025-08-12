import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/use-i18n";
import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  ArrowLeft,
  Calendar,
  Edit,
  Eye,
} from "lucide-react";

export default function TeacherClasses() {
  const navigate = useNavigate();
  const { t } = useI18n();

  // Datos de ejemplo de las clases del profesor
  const classes = [
    {
      id: 1,
      subject: "Programación Web Avanzada",
      code: "ING-301",
      students: 28,
      schedule: "Lun, Mié, Vie 09:00-10:30",
      classroom: "Lab-A201",
      semester: "2024-1",
      status: "Activa",
    },
    {
      id: 2,
      subject: "Base de Datos II",
      code: "ING-402",
      students: 24,
      schedule: "Mar, Jue 11:00-12:30",
      classroom: "Aula-302",
      semester: "2024-1",
      status: "Activa",
    },
    {
      id: 3,
      subject: "Algoritmos y Estructuras",
      code: "ING-203",
      students: 32,
      schedule: "Lun, Mié 14:00-15:30",
      classroom: "Lab-B105",
      semester: "2024-1",
      status: "Activa",
    },
    {
      id: 4,
      subject: "Ingeniería de Software",
      code: "ING-501",
      students: 20,
      schedule: "Vie 16:00-19:00",
      classroom: "Aula-401",
      semester: "2024-1",
      status: "Activa",
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="text-white hover:text-professor-gold hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.common.backToDashboard}
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <BookOpen className="h-8 w-8 mr-3 text-professor-gold" />
                  {t.sections.myClasses}
                </h1>
                <p className="text-white/80 mt-1">{t.sections.myClassesDesc}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-professor-navy/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-professor-gray dark:text-gray-300">
                    Total de Clases
                  </p>
                  <p className="text-2xl font-bold text-professor-navy dark:text-white">
                    {classes.length}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-professor-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-professor-navy/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-professor-gray dark:text-gray-300">
                    Total Estudiantes
                  </p>
                  <p className="text-2xl font-bold text-professor-navy dark:text-white">
                    {classes.reduce((sum, cls) => sum + cls.students, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-professor-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-professor-navy/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-professor-gray dark:text-gray-300">
                    Clases Activas
                  </p>
                  <p className="text-2xl font-bold text-professor-navy dark:text-white">
                    {classes.filter((cls) => cls.status === "Activa").length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-professor-navy/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-professor-gray dark:text-gray-300">
                    Promedio por Clase
                  </p>
                  <p className="text-2xl font-bold text-professor-navy dark:text-white">
                    {Math.round(
                      classes.reduce((sum, cls) => sum + cls.students, 0) /
                        classes.length,
                    )}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Classes List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Mis Clases Asignadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((classItem, index) => (
              <motion.div key={classItem.id} variants={itemVariants}>
                <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-professor-navy dark:text-white">
                          {classItem.subject}
                        </CardTitle>
                        <p className="text-sm text-professor-gray dark:text-gray-300 mt-1">
                          Código: {classItem.code}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        {classItem.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-professor-accent" />
                          <span className="text-professor-gray dark:text-gray-300">
                            {classItem.students} estudiantes
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-professor-gold" />
                          <span className="text-professor-gray dark:text-gray-300">
                            {classItem.schedule}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-professor-navy" />
                          <span className="text-professor-gray dark:text-gray-300">
                            {classItem.classroom}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <span className="text-professor-gray dark:text-gray-300">
                            {classItem.semester}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-4">
                        <Button
                          size="sm"
                          className="flex-1 bg-professor-navy hover:bg-professor-gold text-white"
                          onClick={() => navigate(`/clase/${classItem.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-professor-navy text-professor-navy hover:bg-professor-navy hover:text-white"
                          onClick={() =>
                            navigate(`/editar-clase/${classItem.id}`)
                          }
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Gestionar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
