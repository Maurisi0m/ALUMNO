import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/use-i18n";
import { useState } from "react";
import {
  GraduationCap,
  ArrowLeft,
  Search,
  Edit,
  Save,
  User,
  BookOpen,
  Award,
  TrendingUp,
} from "lucide-react";

export default function GradeManagement() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("ING-301");

  // Datos de ejemplo
  const classes = [
    { id: "ING-301", name: "Programación Web Avanzada", students: 28 },
    { id: "ING-402", name: "Base de Datos II", students: 24 },
    { id: "ING-203", name: "Algoritmos y Estructuras", students: 32 },
    { id: "ING-501", name: "Ingeniería de Software", students: 20 },
  ];

  const students = [
    {
      id: 1,
      name: "Ana García López",
      matricula: "2021001",
      parcial1: 85,
      parcial2: 88,
      parcial3: 90,
      final: 87,
      status: "Aprobado",
    },
    {
      id: 2,
      name: "Carlos Rodríguez Martín",
      matricula: "2021002",
      parcial1: 78,
      parcial2: 82,
      parcial3: 85,
      final: 81,
      status: "Aprobado",
    },
    {
      id: 3,
      name: "María Fernández Silva",
      matricula: "2021003",
      parcial1: 92,
      parcial2: 95,
      parcial3: 88,
      final: 91,
      status: "Aprobado",
    },
    {
      id: 4,
      name: "Juan Manuel Torres",
      matricula: "2021004",
      parcial1: 65,
      parcial2: 70,
      parcial3: 68,
      final: 67,
      status: "En Riesgo",
    },
    {
      id: 5,
      name: "Laura Beatriz Moreno",
      matricula: "2021005",
      parcial1: 88,
      parcial2: 85,
      parcial3: 92,
      final: 88,
      status: "Aprobado",
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricula.includes(searchTerm),
  );

  const getStatusBadge = (status: string) => {
    const colors = {
      Aprobado:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "En Riesgo":
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Reprobado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[status as keyof typeof colors] || colors["Aprobado"];
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600 dark:text-green-400";
    if (grade >= 80) return "text-blue-600 dark:text-blue-400";
    if (grade >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const selectedClassData = classes.find((cls) => cls.id === selectedClass);
  const classAverage = Math.round(
    students.reduce((sum, student) => sum + student.final, 0) / students.length,
  );
  const approvedCount = students.filter(
    (student) => student.status === "Aprobado",
  ).length;
  const atRiskCount = students.filter(
    (student) => student.status === "En Riesgo",
  ).length;

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
                  <GraduationCap className="h-8 w-8 mr-3 text-professor-gold" />
                  {t.sections.gradeManagement}
                </h1>
                <p className="text-white/80 mt-1">
                  {t.sections.gradeManagementDesc}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Class Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-professor-navy/20">
            <CardHeader>
              <CardTitle className="text-professor-navy dark:text-white flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Seleccionar Clase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {classes.map((cls) => (
                  <Button
                    key={cls.id}
                    variant={selectedClass === cls.id ? "default" : "outline"}
                    className={`p-4 h-auto flex flex-col items-start space-y-2 ${
                      selectedClass === cls.id
                        ? "bg-professor-navy text-white"
                        : "border-professor-navy text-professor-navy hover:bg-professor-navy hover:text-white"
                    }`}
                    onClick={() => setSelectedClass(cls.id)}
                  >
                    <span className="font-semibold">{cls.id}</span>
                    <span className="text-sm">{cls.name}</span>
                    <span className="text-xs opacity-75">
                      {cls.students} estudiantes
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics Cards */}
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
                    Promedio General
                  </p>
                  <p
                    className={`text-2xl font-bold ${getGradeColor(classAverage)}`}
                  >
                    {classAverage}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-professor-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-professor-navy/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-professor-gray dark:text-gray-300">
                    Estudiantes Aprobados
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {approvedCount}
                  </p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-professor-navy/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-professor-gray dark:text-gray-300">
                    En Riesgo
                  </p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {atRiskCount}
                  </p>
                </div>
                <User className="h-8 w-8 text-yellow-600" />
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
                    {selectedClassData?.students || 0}
                  </p>
                </div>
                <User className="h-8 w-8 text-professor-navy" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Grade Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-professor-navy/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-professor-navy dark:text-white">
                  Calificaciones - {selectedClassData?.name}
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar estudiante..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="bg-professor-gold hover:bg-professor-navy text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-professor-navy/20">
                      <th className="text-left py-3 px-4 font-semibold text-professor-navy dark:text-white">
                        Estudiante
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-professor-navy dark:text-white">
                        Matrícula
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-professor-navy dark:text-white">
                        Parcial 1
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-professor-navy dark:text-white">
                        Parcial 2
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-professor-navy dark:text-white">
                        Parcial 3
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-professor-navy dark:text-white">
                        Final
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-professor-navy dark:text-white">
                        Estado
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-professor-navy dark:text-white">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <tr
                        key={student.id}
                        className={`border-b border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-900"
                            : "bg-gray-50 dark:bg-gray-800"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-professor-navy text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {student.name.split(" ")[0][0]}
                              {student.name.split(" ")[1]?.[0] || ""}
                            </div>
                            <span className="font-medium text-professor-navy dark:text-white">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-professor-gray dark:text-gray-300">
                          {student.matricula}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-semibold ${getGradeColor(student.parcial1)}`}
                          >
                            {student.parcial1}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-semibold ${getGradeColor(student.parcial2)}`}
                          >
                            {student.parcial2}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-semibold ${getGradeColor(student.parcial3)}`}
                          >
                            {student.parcial3}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-bold text-lg ${getGradeColor(student.final)}`}
                          >
                            {student.final}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={getStatusBadge(student.status)}>
                            {student.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-professor-navy text-professor-navy hover:bg-professor-navy hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
