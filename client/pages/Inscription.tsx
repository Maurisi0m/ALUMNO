import { motion } from "framer-motion";
import { ArrowLeft, User, FileText, CreditCard, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";

interface InscriptionStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'pending';
  estimatedTime: string;
}

interface InscriptionPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'open' | 'coming' | 'closed';
  description: string;
}

export default function Inscription() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [inscriptionStatus, setInscriptionStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');

  const inscriptionSteps: InscriptionStep[] = [
    {
      id: 'documents',
      title: 'Documentación Personal',
      description: 'Recopilar y digitalizar documentos requeridos',
      icon: <FileText className="h-6 w-6" />,
      status: currentStep > 0 ? 'completed' : currentStep === 0 ? 'current' : 'pending',
      estimatedTime: '30 min'
    },
    {
      id: 'personal_info',
      title: 'Información Personal',
      description: 'Completar formulario de datos personales y académicos',
      icon: <User className="h-6 w-6" />,
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'pending',
      estimatedTime: '20 min'
    },
    {
      id: 'payment',
      title: 'Proceso de Pago',
      description: 'Realizar pago de inscripción y primera colegiatura',
      icon: <CreditCard className="h-6 w-6" />,
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'pending',
      estimatedTime: '15 min'
    },
    {
      id: 'confirmation',
      title: 'Confirmación y Matrícula',
      description: 'Verificación final y asignación de matrícula oficial',
      icon: <CheckCircle className="h-6 w-6" />,
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'pending',
      estimatedTime: '5 min'
    }
  ];

  const inscriptionPeriods: InscriptionPeriod[] = [
    {
      id: 'spring_2025',
      name: 'Periodo Primavera 2025',
      startDate: '2025-01-15',
      endDate: '2025-02-28',
      status: 'open',
      description: 'Inscripciones abiertas para el periodo Enero-Mayo 2025'
    },
    {
      id: 'summer_2025',
      name: 'Periodo Verano 2025',
      startDate: '2025-05-15',
      endDate: '2025-06-30',
      status: 'coming',
      description: 'Cursos intensivos de verano y materias de regularización'
    },
    {
      id: 'fall_2025',
      name: 'Periodo Otoño 2025',
      startDate: '2025-07-15',
      endDate: '2025-08-31',
      status: 'coming',
      description: 'Inscripciones para el periodo Agosto-Diciembre 2025'
    }
  ];

  const requiredDocuments = [
    'Acta de nacimiento certificada',
    'CURP actualizada',
    'Certificado de bachillerato legalizado',
    'Fotografías tamaño infantil (6 piezas)',
    'Certificado médico reciente',
    'Comprobante de domicilio',
    'INE de los padres (copia)',
    'RFC (si aplica)'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-blue-500';
      case 'open': return 'bg-green-500';
      case 'coming': return 'bg-yellow-500';
      case 'closed': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'current': return 'En proceso';
      case 'pending': return 'Pendiente';
      case 'open': return 'Abierto';
      case 'coming': return 'Próximamente';
      case 'closed': return 'Cerrado';
      default: return 'Desconocido';
    }
  };

  const startInscription = () => {
    setInscriptionStatus('in_progress');
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < inscriptionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setInscriptionStatus('completed');
    }
  };

  const progressPercentage = ((currentStep + 1) / inscriptionSteps.length) * 100;

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
                Proceso de Inscripción
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Tu camino hacia la educación lasallista comienza aquí
              </p>
            </div>
            <Link to="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t.common.backToDashboard}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Inscription Periods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            📅 Periodos de Inscripción
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inscriptionPeriods.map((period, index) => (
              <Card key={period.id} className={`border-l-4 ${period.status === 'open' ? 'border-l-green-500' : period.status === 'coming' ? 'border-l-yellow-500' : 'border-l-gray-300'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{period.name}</CardTitle>
                    <Badge className={`${getStatusColor(period.status)} text-white`}>
                      {getStatusText(period.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {period.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{period.startDate} - {period.endDate}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Current Status */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-lasalle-blue/10 dark:bg-lasalle-blue/20 border-lasalle-blue/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lasalle-blue dark:text-white">
                      {user.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Estado actual: {user.area_estudios} | {user.semestre}° Semestre
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500 text-white">Inscrito</Badge>
                    <p className="text-xs text-gray-500 mt-1">Matrícula: {user.matricula}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Inscription Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              🎓 Proceso de Inscripción
            </h2>
            {inscriptionStatus === 'not_started' && (
              <Button
                onClick={startInscription}
                className="bg-lasalle-blue hover:bg-lasalle-gold"
              >
                Iniciar Inscripción
              </Button>
            )}
          </div>

          {inscriptionStatus !== 'not_started' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progreso de inscripción</span>
                <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {inscriptionSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className={`h-full transition-all duration-300 hover:shadow-lg ${
                  step.status === 'current' ? 'ring-2 ring-blue-500' : ''
                }`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-3 rounded-lg ${getStatusColor(step.status)} text-white`}>
                        {step.icon}
                      </div>
                      <Badge 
                        variant={step.status === 'completed' ? 'default' : step.status === 'current' ? 'secondary' : 'outline'}
                        className={step.status === 'completed' ? 'bg-green-500 text-white' : ''}
                      >
                        {getStatusText(step.status)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Tiempo estimado: {step.estimatedTime}</span>
                    </div>
                    {step.status === 'current' && inscriptionStatus === 'in_progress' && (
                      <Button
                        onClick={nextStep}
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

        {/* Required Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Documentos Requeridos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {requiredDocuments.map((doc, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {doc}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Información Importante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">💰 Costos de Inscripción</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Inscripción: $2,500 MXN</li>
                  <li>• Primera colegiatura: Variable por carrera</li>
                  <li>• Seguro estudiantil: $350 MXN</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">📞 Soporte</h4>
                <p className="text-sm text-gray-600">
                  Para dudas sobre el proceso de inscripción, contacta a:
                </p>
                <p className="text-sm"><strong>Tel:</strong> (771) 717-0213</p>
                <p className="text-sm"><strong>Email:</strong> inscripciones@lasallep.edu.mx</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Success Message */}
        {inscriptionStatus === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8"
          >
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">
                  ¡Inscripción Completada!
                </h3>
                <p className="text-green-600 dark:text-green-400 mb-4">
                  Tu proceso de inscripción ha sido exitoso. Recibirás un correo con tu matrícula oficial y próximos pasos.
                </p>
                <Button className="bg-green-500 hover:bg-green-600">
                  Descargar Comprobante
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
