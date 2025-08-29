import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useDetAf } from "@/hooks/use-detaf";
import { useState } from "react";
import {
  ArrowLeft,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Camera,
  Palette,
  Brain,
  Cpu,
  Music,
  Mic,
  Zap,
  Dumbbell,
  Flame,
  Trophy,
  Target,
  Shield,
  Activity
} from "lucide-react";

// Iconos para cada categoría
const categoryIcons: Record<string, any> = {
  'FOTOGRAFIA': Camera,
  'DIBUJO': Palette,
  'MINDFULNESS': Brain,
  'ROBOTICA': Cpu,
  'GUITARRA': Music,
  'ENSAMBLE MUSICA': Mic,
  'ATLETISMO': Zap,
  'GIMNASIO': Dumbbell,
  'FISICOCONSTRUCTIVISMO': Flame,
  'BASQUET': Trophy,
  'FUT RAPIDO': Target,
  'FUTBOL': Target,
  'TOCHO': Shield,
  'AMERICANO': Activity
};

// Colores para cada tipo
const typeColors = {
  DET: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  AF: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    button: 'bg-green-600 hover:bg-green-700'
  }
};

interface CategoryCardProps {
  category: any;
  isEnrolled: boolean;
  canEnroll: boolean;
  onEnroll: () => void;
  onUnenroll: () => void;
  loading: boolean;
}

function CategoryCard({ category, isEnrolled, canEnroll, onEnroll, onUnenroll, loading }: CategoryCardProps) {
  const Icon = categoryIcons[category.nombre] || Users;
  const colors = typeColors[category.tipo as 'DET' | 'AF'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`h-full transition-all duration-200 hover:shadow-lg ${colors.bg} ${colors.border} border-2`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${colors.button} text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className={`text-lg ${colors.text}`}>
                  {category.nombre}
                </CardTitle>
                <Badge variant="outline" className={`mt-1 ${colors.text}`}>
                  {category.tipo}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-3">
            {category.descripcion}
          </p>

          {/* Información de cupos */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                {category.inscritos_actuales}/{category.cupo_maximo} inscritos
              </span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs ${
              category.tiene_cupo_disponible 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {category.cupos_disponibles} cupos
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-2">
            {isEnrolled ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Ya estás inscrito</span>
                </div>
                <Button
                  onClick={onUnenroll}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Darse de baja
                </Button>
              </div>
            ) : (
              <Button
                onClick={onEnroll}
                disabled={!canEnroll || loading || !category.tiene_cupo_disponible}
                className={`w-full ${colors.button} text-white`}
                size="sm"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : !category.tiene_cupo_disponible ? (
                  <XCircle className="h-4 w-4 mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {!category.tiene_cupo_disponible ? 'Sin cupo' : 
                 !canEnroll ? `Ya tienes ${category.tipo}` : 'Inscribirse'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function InscripcionDetAfNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    detCategories,
    afCategories,
    status,
    loading,
    enrolling,
    enroll,
    unenroll,
    refreshData,
    canEnrollInDET,
    canEnrollInAF
  } = useDetAf();

  const [activeTab, setActiveTab] = useState<'DET' | 'AF'>('DET');

  const handleEnroll = async (categoryId: number) => {
    await enroll(categoryId);
  };

  const handleUnenroll = async (inscriptionId: number) => {
    await unenroll(inscriptionId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lasalle-blue to-lasalle-gold">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Cargando inscripciones DET/AF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lasalle-blue via-blue-800 to-lasalle-gold">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:text-lasalle-gold hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Regresar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Users className="h-8 w-8 mr-3 text-lasalle-gold" />
                Inscripciones DET/AF
              </h1>
              <p className="text-blue-100">Desarrollo de talentos (DET) y Actividades Físicas (AF)</p>
            </div>
          </div>
          
          <Button
            onClick={refreshData}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </motion.div>

        {/* Estado actual del usuario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-white/95 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-lasalle-blue">Tu Estado Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Estado DET */}
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="p-3 bg-blue-600 rounded-lg text-white">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-700">Desarrollo de talentos (DET)</h3>
                    {status.det_inscrito ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>{status.det_categoria}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>No inscrito</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Estado AF */}
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="p-3 bg-green-600 rounded-lg text-white">
                    <Dumbbell className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-700">Actividades Físicas (AF)</h3>
                    {status.af_inscrito ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>{status.af_categoria}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>No inscrito</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Información importante */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Límites de inscripción:</p>
                    <ul className="mt-1 space-y-1">
                      <li>• Máximo 1 actividad DET + 1 actividad AF (CONSULTA SI ESTAS EN SELECTIVO/EXTRAMUROS DE AF)</li>
                      <li>• Puedes darte de baja e inscribirte en otra categoría</li>
                      <li>• Las inscripciones están sujetas a disponibilidad de cupo</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs para DET/AF */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex space-x-2 bg-white/20 backdrop-blur-md rounded-lg p-2">
            <Button
              onClick={() => setActiveTab('DET')}
              variant={activeTab === 'DET' ? 'default' : 'ghost'}
              className={`flex-1 ${
                activeTab === 'DET'
                  ? 'bg-blue-600 text-white'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Cpu className="h-4 w-4 mr-2" />
              Desarrollo De Talentos ({detCategories.length})
            </Button>
            <Button
              onClick={() => setActiveTab('AF')}
              variant={activeTab === 'AF' ? 'default' : 'ghost'}
              className={`flex-1 ${
                activeTab === 'AF'
                  ? 'bg-green-600 text-white'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Dumbbell className="h-4 w-4 mr-2" />
              Actividades Físicas ({afCategories.length})
            </Button>
          </div>
        </motion.div>

        {/* Grid de categorías */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {(activeTab === 'DET' ? detCategories : afCategories).map((category) => {
            const isEnrolled = activeTab === 'DET' 
              ? status.det_inscrito && status.det_categoria === category.nombre
              : status.af_inscrito && status.af_categoria === category.nombre;
            
            const canEnroll = activeTab === 'DET' ? canEnrollInDET : canEnrollInAF;
            
            const inscriptionId = activeTab === 'DET' 
              ? status.det_inscripcion_id 
              : status.af_inscripcion_id;

            return (
              <CategoryCard
                key={category.id}
                category={category}
                isEnrolled={isEnrolled}
                canEnroll={canEnroll}
                onEnroll={() => handleEnroll(category.id)}
                onUnenroll={() => inscriptionId && handleUnenroll(inscriptionId)}
                loading={enrolling}
              />
            );
          })}
        </motion.div>

        {/* Empty state */}
        {(activeTab === 'DET' ? detCategories : afCategories).length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Card className="bg-white/95 backdrop-blur-md shadow-xl max-w-md mx-auto">
              <CardContent className="pt-6">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay categorías disponibles
                </h3>
                <p className="text-gray-600 mb-4">
                  No se encontraron categorías {activeTab} en este momento.
                </p>
                <Button
                  onClick={refreshData}
                  className="bg-lasalle-blue hover:bg-lasalle-gold"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
