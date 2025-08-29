import { motion } from "framer-motion";
import { ArrowLeft, User, FileText, Calendar, MapPin, Phone, Mail, Clock, CheckCircle, AlertTriangle, Trophy, GraduationCap } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { useState } from "react";

interface AdmissionStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'pending';
  duration: string;
}

interface AdmissionDate {
  id: string;
  event: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'exam' | 'interview' | 'orientation' | 'deadline';
}

interface Requirement {
  id: string;
  category: string;
  items: string[];
}

export default function Admission() {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);

  const admissionSteps: AdmissionStep[] = [
    {
      id: 'registration',
      title: 'Registro en Línea',
      description: 'Completa tu solicitud de admisión en nuestro portal',
      icon: <User className="h-6 w-6" />,
      status: currentStep > 0 ? 'completed' : currentStep === 0 ? 'current' : 'pending',
      duration: '15 min'
    },
    {
      id: 'documents',
      title: 'Entrega de Documentos',
      description: 'Presenta la documentación requerida en servicios escolares',
      icon: <FileText className="h-6 w-6" />,
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'pending',
      duration: '30 min'
    },
    {
      id: 'exam',
      title: 'Examen de Admisión',
      description: 'Presenta el examen de conocimientos generales y aptitudes',
      icon: <GraduationCap className="h-6 w-6" />,
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'pending',
      duration: '2 horas'
    },
    {
      id: 'interview',
      title: 'Entrevista Personal',
      description: 'Entrevista con el coordinador de la carrera seleccionada',
      icon: <User className="h-6 w-6" />,
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'pending',
      duration: '30 min'
    },
    {
      id: 'results',
      title: 'Resultados y Inscripción',
      description: 'Conoce tus resultados y completa tu inscripción',
      icon: <CheckCircle className="h-6 w-6" />,
      status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'current' : 'pending',
      duration: '1 día'
    }
  ];

  const importantDates: AdmissionDate[] = [
    {
      id: 'app_deadline',
      event: 'Fecha límite de solicitudes',
      date: '2025-02-15',
      time: '23:59',
      location: 'Portal en línea',
      description: 'Último día para enviar tu solicitud de admisión',
      type: 'deadline'
    },
    {
      id: 'exam_date',
      event: 'Examen de Admisión',
      date: '2025-02-22',
      time: '09:00',
      location: 'Campus Universidad La Salle',
      description: 'Examen de conocimientos generales, matemáticas y razonamiento',
      type: 'exam'
    },
    {
      id: 'interviews',
      event: 'Entrevistas Personales',
      date: '2025-02-25 - 2025-02-28',
      time: '09:00-17:00',
      location: 'Coordinaciones académicas',
      description: 'Entrevistas individuales por área de estudios',
      type: 'interview'
    },
    {
      id: 'results',
      event: 'Publicación de Resultados',
      date: '2025-03-05',
      time: '10:00',
      location: 'Portal y campus',
      description: 'Resultados del proceso de admisión y lista de aceptados',
      type: 'orientation'
    }
  ];

  const requirements: Requirement[] = [
    {
      id: 'academic',
      category: 'Documentos Académicos',
      items: [
        'Certificado de bachillerato legalizado',
        'Constancia de no adeudo de bachillerato',
        'Historial académico completo',
        'Carta de recomendación académica (opcional)'
      ]
    },
    {
      id: 'personal',
      category: 'Documentos Personales',
      items: [
        'Acta de nacimiento certificada',
        'CURP actualizada',
        'Identificación oficial (INE/Pasaporte)',
        'Comprobante de domicilio reciente',
        '6 fotografías tamaño infantil'
      ]
    },
    {
      id: 'medical',
      category: 'Documentos Médicos',
      items: [
        'Certificado médico reciente (no mayor a 3 meses)',
        'Cartilla de vacunación actualizada',
        'Análisis clínicos generales',
        'Tipo de sangre certificado'
      ]
    },
    {
      id: 'financial',
      category: 'Documentos Financieros',
      items: [
        'Comprobante de ingresos familiares',
        'Última declaración fiscal (si aplica)',
        'Estados de cuenta bancarios (3 meses)',
        'Carta de solvencia económica'
      ]
    }
  ];

  const handleStartApplication = () => {
    setIsRegistered(true);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < admissionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-blue-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return <GraduationCap className="h-5 w-5" />;
      case 'interview': return <User className="h-5 w-5" />;
      case 'orientation': return <Trophy className="h-5 w-5" />;
      case 'deadline': return <AlertTriangle className="h-5 w-5" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'border-blue-500 bg-blue-50';
      case 'interview': return 'border-purple-500 bg-purple-50';
      case 'orientation': return 'border-green-500 bg-green-50';
      case 'deadline': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

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
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-lasalle-blue dark:text-white mb-2">
                Proceso de Admisión
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Tu futuro académico comienza con un solo paso
              </p>
            </div>
            <Link to="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t.common.backToDashboard}
              </Button>
            </Link>
          </div>
          
          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-lasalle-blue to-lasalle-gold text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">¡Forma parte de la familia lasallista!</h2>
                  <p className="text-blue-100">
                    Inicia tu proceso de admisión y descubre todo lo que la Universidad La Salle Pachuca tiene para ti.
                  </p>
                </div>
                <div>
                  {!isRegistered ? (
                    <Button
                      onClick={handleStartApplication}
                      className="bg-white text-lasalle-blue hover:bg-gray-100"
                    >
                      Iniciar Solicitud
                    </Button>
                  ) : (
                    <Badge className="bg-green-500 text-white">
                      Proceso Iniciado
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Important Dates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            📅 Fechas Importantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {importantDates.map((date, index) => (
              <motion.div
                key={date.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className={`border-l-4 ${getEventTypeColor(date.type)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      {getEventTypeIcon(date.type)}
                      <CardTitle className="text-lg">{date.event}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{date.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{date.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{date.location}</span>
                      </div>
                      <p className="text-gray-600 pt-2">{date.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Admission Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            🎓 Proceso de Admisión
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {admissionSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className={`h-full transition-all duration-300 hover:shadow-lg ${
                  step.status === 'current' ? 'ring-2 ring-blue-500' : ''
                }`}>
                  <CardHeader className="pb-4 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStepStatusColor(step.status)} text-white`}>
                        {step.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <Badge 
                          variant={step.status === 'completed' ? 'default' : step.status === 'current' ? 'secondary' : 'outline'}
                          className={`mt-2 ${step.status === 'completed' ? 'bg-green-500 text-white' : ''}`}
                        >
                          {step.status === 'completed' ? 'Completado' : step.status === 'current' ? 'En proceso' : 'Pendiente'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {step.description}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{step.duration}</span>
                    </div>
                    {step.status === 'current' && isRegistered && (
                      <Button
                        onClick={handleNextStep}
                        className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
                        size="sm"
                      >
                        Continuar
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            📋 Documentos Requeridos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {requirements.map((requirement, index) => (
              <motion.div
                key={requirement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg text-lasalle-blue">
                      {requirement.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {requirement.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm">
                          <div className="w-2 h-2 bg-lasalle-blue rounded-full mt-2 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Admisiones</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>(771) 717-0213 ext. 1010</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>admisiones@lasallep.edu.mx</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Lunes a Viernes: 8:00 - 18:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Av. San Juan Bautista de la Salle 1, Col. San Juan Tilcuautla</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg text-green-700 dark:text-green-300">
                💡 Consejos para tu Proceso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Prepara todos los documentos con anticipación</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Estudia para el examen de admisión con material actualizado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Llega temprano el día de tu examen y entrevista</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Investiga sobre la carrera que deseas estudiar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Mantente en contacto con admisiones para cualquier duda</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Success Message */}
        {currentStep === admissionSteps.length - 1 && isRegistered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8"
          >
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                <strong>¡Felicidades!</strong> Has completado todo el proceso de admisión. 
                Te contactaremos pronto con los resultados y próximos pasos.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </div>
    </div>
  );
}
