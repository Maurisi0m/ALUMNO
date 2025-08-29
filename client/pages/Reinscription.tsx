import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Calendar, CreditCard, BookOpen, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";

interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  prerequisites: string[];
  schedule: string;
  professor: string;
  available_spots: number;
  total_spots: number;
  selected: boolean;
}

interface ReinscriptionPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'open' | 'coming' | 'closed';
  priority: 'high' | 'normal' | 'low';
}

export default function Reinscription() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [reinscriptionStep, setReinscriptionStep] = useState<'selection' | 'payment' | 'confirmation'>('selection');
  const [totalCredits, setTotalCredits] = useState(0);
  const [isEligible, setIsEligible] = useState(true);

  const reinscriptionPeriods: ReinscriptionPeriod[] = [
    {
      id: 'priority',
      name: 'Reinscripción Prioritaria',
      startDate: '2025-01-08',
      endDate: '2025-01-12',
      status: 'open',
      priority: 'high'
    },
    {
      id: 'general',
      name: 'Reinscripción General',
      startDate: '2025-01-15',
      endDate: '2025-01-25',
      status: 'coming',
      priority: 'normal'
    },
    {
      id: 'late',
      name: 'Reinscripción Extemporánea',
      startDate: '2025-01-28',
      endDate: '2025-02-05',
      status: 'coming',
      priority: 'low'
    }
  ];

  const availableSubjects: Subject[] = [
    {
      id: 'calc3',
      code: 'MAT301',
      name: 'Cálculo Diferencial e Integral III',
      credits: 8,
      prerequisites: ['MAT201', 'MAT202'],
      schedule: 'Lun-Mie-Vie 10:00-12:00',
      professor: 'Dr. Roberto García',
      available_spots: 25,
      total_spots: 30,
      selected: false
    },
    {
      id: 'physics2',
      code: 'FIS201',
      name: 'Física II (Electromagnetismo)',
      credits: 6,
      prerequisites: ['FIS101'],
      schedule: 'Mar-Jue 14:00-16:00',
      professor: 'Ing. María López',
      available_spots: 18,
      total_spots: 25,
      selected: false
    },
    {
      id: 'prog3',
      code: 'INF301',
      name: 'Programación Orientada a Objetos',
      credits: 6,
      prerequisites: ['INF201'],
      schedule: 'Lun-Mie 16:00-18:00',
      professor: 'Lic. Carlos Ruiz',
      available_spots: 5,
      total_spots: 20,
      selected: false
    },
    {
      id: 'ethics',
      code: 'HUM101',
      name: 'Ética Profesional',
      credits: 4,
      prerequisites: [],
      schedule: 'Vie 08:00-12:00',
      professor: 'Mtro. Ana Martínez',
      available_spots: 40,
      total_spots: 40,
      selected: false
    },
    {
      id: 'database',
      code: 'INF302',
      name: 'Base de Datos',
      credits: 6,
      prerequisites: ['INF201'],
      schedule: 'Mar-Jue 10:00-12:00',
      professor: 'Dr. Luis Hernández',
      available_spots: 15,
      total_spots: 20,
      selected: false
    },
    {
      id: 'english3',
      code: 'ING301',
      name: 'Inglés III',
      credits: 4,
      prerequisites: ['ING201'],
      schedule: 'Lun-Vie 12:00-13:00',
      professor: 'Prof. Sarah Johnson',
      available_spots: 30,
      total_spots: 35,
      selected: false
    }
  ];

  const maxCreditsPerSemester = 48;
  const minCreditsPerSemester = 12;

  const handleSubjectToggle = (subjectId: string) => {
    const subject = availableSubjects.find(s => s.id === subjectId);
    if (!subject) return;

    if (selectedSubjects.includes(subjectId)) {
      // Deseleccionar materia
      setSelectedSubjects(prev => prev.filter(id => id !== subjectId));
      setTotalCredits(prev => prev - subject.credits);
    } else {
      // Verificar si se puede agregar la materia
      if (totalCredits + subject.credits <= maxCreditsPerSemester) {
        setSelectedSubjects(prev => [...prev, subjectId]);
        setTotalCredits(prev => prev + subject.credits);
      } else {
        alert(`No puedes exceder ${maxCreditsPerSemester} créditos por semestre.`);
      }
    }
  };

  const handleContinueToPayment = () => {
    if (totalCredits < minCreditsPerSemester) {
      alert(`Debes seleccionar al menos ${minCreditsPerSemester} créditos.`);
      return;
    }
    setReinscriptionStep('payment');
  };

  const handleCompleteReinscription = () => {
    setReinscriptionStep('confirmation');
  };

  const calculateTotalCost = () => {
    const costPerCredit = 850; // Ejemplo: $850 por crédito
    return totalCredits * costPerCredit;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'coming': return 'bg-yellow-500';
      case 'closed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'normal': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
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
                Reinscripción Semestral
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Selecciona tus materias para el próximo semestre
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

        {/* Student Status */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className={`${isEligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {user.nombre}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Matrícula: {user.matricula} | {user.area_estudios} | Semestre Actual: {user.semestre}°
                    </p>
                    <p className="text-sm text-gray-600">
                      Próximo semestre: {(user.semestre || 0) + 1}°
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={isEligible ? 'bg-green-500' : 'bg-red-500'}>
                      {isEligible ? 'Elegible para reinscripción' : 'No elegible'}
                    </Badge>
                    {!isEligible && (
                      <p className="text-xs text-red-600 mt-1">
                        Consulta servicios escolares
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Reinscription Periods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            📅 Periodos de Reinscripción
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reinscriptionPeriods.map((period) => (
              <Card key={period.id} className={`border-l-4 ${getStatusColor(period.status)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{period.name}</CardTitle>
                    <Badge className={`${getStatusColor(period.status)} text-white`}>
                      {period.status === 'open' ? 'Abierto' : period.status === 'coming' ? 'Próximo' : 'Cerrado'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{period.startDate} - {period.endDate}</span>
                  </div>
                  <Badge className={getPriorityColor(period.priority)} variant="outline">
                    Prioridad {period.priority === 'high' ? 'Alta' : period.priority === 'normal' ? 'Normal' : 'Baja'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Progress Bar */}
        {reinscriptionStep !== 'selection' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso de reinscripción</span>
              <span className="text-sm text-gray-500">
                {reinscriptionStep === 'payment' ? '66%' : '100%'}
              </span>
            </div>
            <Progress value={reinscriptionStep === 'payment' ? 66 : 100} className="h-2" />
          </motion.div>
        )}

        {/* Selection Step */}
        {reinscriptionStep === 'selection' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Credits Summary */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Resumen de Créditos</h3>
                    <p className="text-sm text-gray-600">
                      Mínimo: {minCreditsPerSemester} | Máximo: {maxCreditsPerSemester}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-lasalle-blue">{totalCredits}</p>
                    <p className="text-sm text-gray-500">créditos seleccionados</p>
                  </div>
                </div>
                <Progress 
                  value={(totalCredits / maxCreditsPerSemester) * 100} 
                  className="mt-4"
                />
              </CardContent>
            </Card>

            {/* Subject Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {availableSubjects.map((subject) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedSubjects.includes(subject.id) ? 'ring-2 ring-lasalle-blue bg-blue-50' : ''
                  }`}
                  onClick={() => handleSubjectToggle(subject.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">{subject.code}</Badge>
                          <CardTitle className="text-lg">{subject.name}</CardTitle>
                          <p className="text-sm text-gray-600">{subject.professor}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-lasalle-blue">{subject.credits} créditos</Badge>
                          {selectedSubjects.includes(subject.id) && (
                            <CheckCircle className="h-5 w-5 text-green-500 mt-2" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Horario:</span>
                          <span className="font-medium">{subject.schedule}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Disponibles:</span>
                          <span className={`font-medium ${subject.available_spots < 10 ? 'text-red-600' : 'text-green-600'}`}>
                            {subject.available_spots}/{subject.total_spots}
                          </span>
                        </div>
                        {subject.prerequisites.length > 0 && (
                          <div>
                            <span className="text-gray-500">Requisitos:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {subject.prerequisites.map((prereq) => (
                                <Badge key={prereq} variant="secondary" className="text-xs">
                                  {prereq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Continue Button */}
            <div className="mt-8 text-center">
              <Button
                onClick={handleContinueToPayment}
                disabled={totalCredits < minCreditsPerSemester || !isEligible}
                className="bg-lasalle-blue hover:bg-lasalle-gold text-white px-8 py-3"
              >
                Continuar al Pago
              </Button>
            </div>
          </motion.div>
        )}

        {/* Payment Step */}
        {reinscriptionStep === 'payment' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6" />
                  Información de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Resumen de Materias Seleccionadas</h3>
                  {selectedSubjects.map((subjectId) => {
                    const subject = availableSubjects.find(s => s.id === subjectId);
                    return subject ? (
                      <div key={subjectId} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          <p className="text-sm text-gray-500">{subject.code}</p>
                        </div>
                        <div className="text-right">
                          <p>{subject.credits} créditos</p>
                          <p className="text-sm text-gray-500">${(subject.credits * 850).toLocaleString()}</p>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total a pagar:</span>
                    <span className="text-lasalle-blue">${calculateTotalCost().toLocaleString()} MXN</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {totalCredits} créditos × $850 por crédito
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    El pago se puede realizar en línea, en ventanilla o mediante transferencia bancaria. 
                    Una vez procesado el pago, tu reinscripción será confirmada automáticamente.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setReinscriptionStep('selection')}
                    className="flex-1"
                  >
                    Volver a Selección
                  </Button>
                  <Button
                    onClick={handleCompleteReinscription}
                    className="flex-1 bg-lasalle-blue hover:bg-lasalle-gold"
                  >
                    Procesar Pago
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Confirmation Step */}
        {reinscriptionStep === 'confirmation' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-8 pb-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-700 mb-4">
                  ¡Reinscripción Exitosa!
                </h2>
                <p className="text-green-600 mb-6">
                  Tu reinscripción para el próximo semestre ha sido procesada correctamente.
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-2">Detalles de tu reinscripción:</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Materias inscritas:</strong> {selectedSubjects.length}</p>
                    <p><strong>Total de créditos:</strong> {totalCredits}</p>
                    <p><strong>Semestre:</strong> {((user?.semestre || 0) + 1)}°</p>
                    <p><strong>Periodo:</strong> Enero-Mayo 2025</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button variant="outline">
                    Descargar Comprobante
                  </Button>
                  <Button className="bg-lasalle-blue hover:bg-lasalle-gold">
                    Ver Horario
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
