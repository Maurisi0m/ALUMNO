import { motion } from "framer-motion";
import { ArrowLeft, Download, FileText, GraduationCap, Calendar, BookOpen, ClipboardList, Award } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface DownloadItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fileType: string;
  url?: string;
  size?: string;
  category: 'academic' | 'administrative' | 'forms';
}

export default function Downloads() {
  const { t } = useI18n();
  const { user } = useAuth();

  const downloadItems: DownloadItem[] = [
    {
      id: 'transcript',
      title: 'Kardex / Historial Académico',
      description: 'Descarga tu historial académico completo con todas las materias y calificaciones',
      icon: <GraduationCap className="h-6 w-6" />,
      fileType: 'PDF',
      category: 'academic',
      size: '~2.5 MB'
    },
    {
      id: 'enrollment-certificate',
      title: 'Constancia de Estudios',
      description: 'Documento oficial que certifica tu inscripción y situación académica actual',
      icon: <FileText className="h-6 w-6" />,
      fileType: 'PDF',
      category: 'administrative',
      size: '~1.2 MB'
    },
    {
      id: 'academic-calendar',
      title: 'Calendario Académico',
      description: 'Fechas importantes del semestre: exámenes, inscripciones, y eventos académicos',
      icon: <Calendar className="h-6 w-6" />,
      fileType: 'PDF',
      category: 'academic',
      size: '~800 KB'
    },
    {
      id: 'study-plan',
      title: `Plan de Estudios - ${user?.area_estudios}`,
      description: 'Plan de estudios completo de tu carrera con materias por semestre',
      icon: <BookOpen className="h-6 w-6" />,
      fileType: 'PDF',
      category: 'academic',
      size: '~3.1 MB'
    },
    {
      id: 'reinscription-form',
      title: 'Formato de Reinscripción',
      description: 'Formulario para proceso de reinscripción al siguiente semestre',
      icon: <ClipboardList className="h-6 w-6" />,
      fileType: 'PDF',
      category: 'forms',
      size: '~500 KB'
    },
    {
      id: 'scholarship-form',
      title: 'Solicitud de Becas',
      description: 'Formulario para solicitar becas académicas y de excelencia',
      icon: <Award className="h-6 w-6" />,
      fileType: 'PDF',
      category: 'forms',
      size: '~750 KB'
    }
  ];

  const generateDocument = async (type: string) => {
    try {
      const token = localStorage.getItem('sigea-token');
      if (!token) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        return;
      }

      // Simular descarga (en implementación real, esto conectaría con el backend)
      const response = await fetch(`/api/documents/generate/${type}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/pdf'
        }
      });

      if (response.ok) {
        // Crear blob para descarga
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_${user?.matricula}_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        alert('Error al generar el documento. Intenta más tarde.');
      }
    } catch (error) {
      console.error('Error descargando documento:', error);
      alert('Error de conexión. Verifica tu conexión a internet.');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-500';
      case 'administrative': return 'bg-green-500';
      case 'forms': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'academic': return 'Académico';
      case 'administrative': return 'Administrativo';
      case 'forms': return 'Formularios';
      default: return 'General';
    }
  };

  const categories = ['academic', 'administrative', 'forms'];

  return (
    <div
      className="min-h-screen p-4 relative"
      style={{
        backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2Fb36e4af7e41f44e28ca835fddd3c49bf%2Fa9ee0952f0354bb6804c466eac9c3940?format=webp&width=800')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-lasalle-blue dark:text-white mb-2">
                Centro de Descargas
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Descarga tus documentos académicos y administrativos
              </p>
            </div>
            <Link to="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t.common.backToDashboard}
              </Button>
            </Link>
          </div>
          
          {/* User Info */}
          <Card className="bg-lasalle-blue/10 dark:bg-lasalle-blue/20 border-lasalle-blue/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lasalle-blue dark:text-white">
                    {user?.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Matrícula: {user?.matricula} | {user?.area_estudios} | {user?.semestre}° Semestre
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Documentos disponibles</p>
                  <p className="text-2xl font-bold text-lasalle-blue">{downloadItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Downloads by Category */}
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-4 h-4 rounded-full ${getCategoryColor(category)}`}></div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {getCategoryName(category)}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {downloadItems
                .filter(item => item.category === category)
                .map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-lg ${getCategoryColor(category)} text-white group-hover:scale-110 transition-transform duration-300`}>
                            {item.icon}
                          </div>
                          <div className="text-right">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {item.fileType}
                            </span>
                            {item.size && (
                              <p className="text-xs text-gray-500 mt-1">{item.size}</p>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-lg group-hover:text-lasalle-blue transition-colors">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          {item.description}
                        </p>
                        <Button
                          onClick={() => generateDocument(item.id)}
                          className="w-full bg-lasalle-blue hover:bg-lasalle-gold text-white transition-all duration-300"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Descargar {item.fileType}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ))}

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gray-50 dark:bg-gray-800 border-dashed">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  ℹ️ Información Importante
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Todos los documentos son generados en tiempo real con la información más actualizada de tu expediente.
                  Los documentos oficiales tienen validez legal y contienen marca de agua de seguridad.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
