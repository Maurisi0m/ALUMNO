import { motion } from "framer-motion";
import { ArrowLeft, Building2, Heart, Calculator, Users, Clock, MapPin, Trophy } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

interface StudyArea {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  duration: string;
  modality: string;
  campus: string;
  features: string[];
  career_opportunities: string[];
  requirements: string[];
  available: boolean;
}

export default function StudyAreaSelection() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const studyAreas: StudyArea[] = [
    {
      id: 'medicina',
      name: 'Medicina',
      description: 'Forma profesionales de la salud comprometidos con el bienestar humano y la atención médica integral.',
      icon: <Heart className="h-8 w-8" />,
      color: 'bg-red-500',
      duration: '6 años',
      modality: 'Presencial',
      campus: 'Campus Principal',
      features: [
        'Laboratorios de última generación',
        'Hospital universitario',
        'Prácticas clínicas desde 3er año',
        'Programa de intercambio internacional'
      ],
      career_opportunities: [
        'Médico General',
        'Especialidades médicas',
        'Investigación médica',
        'Administración hospitalaria',
        'Medicina preventiva'
      ],
      requirements: [
        'Promedio mínimo de 85',
        'Examen de admisión',
        'Examen médico',
        'Entrevista personal',
        'Curso propedéutico'
      ],
      available: true
    },
    {
      id: 'arquitectura',
      name: 'Arquitectura',
      description: 'Desarrolla profesionales capaces de diseñar y construir espacios habitables sustentables e innovadores.',
      icon: <Building2 className="h-8 w-8" />,
      color: 'bg-blue-500',
      duration: '5 años',
      modality: 'Presencial',
      campus: 'Campus Principal',
      features: [
        'Talleres de diseño especializados',
        'Software de modelado 3D',
        'Laboratorio de materiales',
        'Convenios con despachos arquitectónicos'
      ],
      career_opportunities: [
        'Arquitecto proyectista',
        'Diseño de interiores',
        'Urbanismo y planeación',
        'Arquitectura sustentable',
        'Construcción y supervisión'
      ],
      requirements: [
        'Promedio mínimo de 80',
        'Examen de admisión',
        'Portafolio de trabajos',
        'Examen de habilidades espaciales',
        'Entrevista'
      ],
      available: true
    },
    {
      id: 'administracion',
      name: 'Administración',
      description: 'Forma líderes empresariales con visión estratégica y capacidad para dirigir organizaciones exitosas.',
      icon: <Users className="h-8 w-8" />,
      color: 'bg-green-500',
      duration: '4 años',
      modality: 'Presencial / Mixta',
      campus: 'Campus Principal',
      features: [
        'Laboratorio de simulación empresarial',
        'Incubadora de negocios',
        'Programas de intercambio',
        'Convenios con empresas'
      ],
      career_opportunities: [
        'Director General',
        'Gerente de área',
        'Consultor empresarial',
        'Emprendedor',
        'Analista financiero'
      ],
      requirements: [
        'Promedio mínimo de 75',
        'Examen de admisión',
        'Entrevista personal',
        'Examen psicométrico',
        'Ensayo de motivación'
      ],
      available: true
    },
    {
      id: 'contaduria',
      name: 'Contaduría Pública',
      description: 'Especialistas en información financiera y control administrativo para la toma de decisiones empresariales.',
      icon: <Calculator className="h-8 w-8" />,
      color: 'bg-purple-500',
      duration: '4 años',
      modality: 'Presencial / Mixta',
      campus: 'Campus Principal',
      features: [
        'Software contable especializado',
        'Laboratorio fiscal',
        'Certificaciones internacionales',
        'Despacho contable estudiantil'
      ],
      career_opportunities: [
        'Contador Público Certificado',
        'Auditor',
        'Consultor fiscal',
        'Director financiero',
        'Emprendedor'
      ],
      requirements: [
        'Promedio mínimo de 75',
        'Examen de admisión',
        'Aptitudes matemáticas',
        'Entrevista',
        'Curso de nivelación'
      ],
      available: false // Próxima apertura
    }
  ];

  const handleSelectArea = async (areaId: string) => {
    if (!studyAreas.find(area => area.id === areaId)?.available) {
      alert('Esta carrera estará disponible próximamente. Mantente al pendiente de nuestras convocatorias.');
      return;
    }

    setSelectedArea(areaId);
    
    // En una implementación real, aquí se enviaría la selección al backend
    try {
      const token = localStorage.getItem('sigea-token');
      const response = await fetch('/api/student/select-study-area', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studyAreaId: areaId })
      });

      if (response.ok) {
        alert('¡Excelente! Tu área de estudios ha sido registrada. Te contactaremos pronto con más información.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Tu selección ha sido registrada localmente. Contacta a admisiones para confirmar tu registro.');
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
                Elegir Área de Estudios
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Descubre la carrera que transformará tu futuro profesional
              </p>
            </div>
            <Link to="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t.common.backToDashboard}
              </Button>
            </Link>
          </div>
          
          {/* Current User Info */}
          {user && (
            <Card className="bg-lasalle-blue/10 dark:bg-lasalle-blue/20 border-lasalle-blue/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lasalle-blue dark:text-white">
                      {user.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Área actual: {user.area_estudios} | Semestre: {user.semestre}°
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">¿Interesado en cambio?</p>
                    <p className="text-xs text-gray-400">Consulta requisitos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Study Areas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {studyAreas.map((area, index) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`h-full hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${!area.available ? 'opacity-75' : ''} ${selectedArea === area.id ? 'ring-2 ring-lasalle-blue' : ''}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 rounded-xl ${area.color} text-white`}>
                      {area.icon}
                    </div>
                    <div className="flex flex-col gap-2">
                      {!area.available && (
                        <Badge variant="secondary">Próximamente</Badge>
                      )}
                      {area.available && (
                        <Badge variant="default" className="bg-green-500">Disponible</Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-lasalle-blue dark:text-white">
                    {area.name}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {area.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Clock className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                      <p className="text-xs text-gray-500">Duración</p>
                      <p className="text-sm font-semibold">{area.duration}</p>
                    </div>
                    <div>
                      <Users className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                      <p className="text-xs text-gray-500">Modalidad</p>
                      <p className="text-sm font-semibold">{area.modality}</p>
                    </div>
                    <div>
                      <MapPin className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                      <p className="text-xs text-gray-500">Campus</p>
                      <p className="text-sm font-semibold">{area.campus}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-lasalle-gold" />
                      Características destacadas
                    </h4>
                    <ul className="text-xs space-y-1">
                      {area.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-lasalle-blue rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleSelectArea(area.id)}
                    disabled={!area.available}
                    className={`w-full transition-all duration-300 ${
                      area.available 
                        ? 'bg-lasalle-blue hover:bg-lasalle-gold text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {area.available ? 'Más información' : 'Próximamente'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-700 dark:text-blue-300">
                📞 ¿Necesitas más información?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                Nuestros asesores educativos están listos para ayudarte a elegir la mejor opción para tu futuro.
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Teléfono:</strong> (771) 717-0213</p>
                <p><strong>Email:</strong> admisiones@lasallep.edu.mx</p>
                <p><strong>Horario:</strong> Lunes a Viernes 8:00 - 18:00</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg text-green-700 dark:text-green-300">
                🎓 Proceso de Admisión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                Conoce los pasos para formar parte de la familia lasallista.
              </p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Solicitar información</li>
                <li>Presentar examen de admisión</li>
                <li>Entrevista personal</li>
                <li>Entrega de documentos</li>
                <li>Inscripción oficial</li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
