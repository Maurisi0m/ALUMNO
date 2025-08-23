import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  ArrowLeft,
  TrendingUp,
  Award,
  BarChart3,
  Calculator,
  Clock,
  Target,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface Calificacion {
  tipo: string;
  calificacion: number;
  porcentaje: number;
}

interface Materia {
  codigo: string;
  materia: string;
  creditos: number;
  calificaciones: Calificacion[];
}

export default function MateriasNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchGrades();
    }
  }, [user]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('sigea-token');
      console.log('🔐 Token encontrado:', !!token);
      
      const response = await fetch('/api/auth/grades', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📊 Response data:', data);

      if (response.ok) {
        setMaterias(data.data || []);
        console.log('✅ Materias configuradas:', data.data?.length || 0);
        
        if (data.data?.length > 0) {
          toast({
            title: "Datos cargados",
            description: `Se encontraron ${data.data.length} materias`,
            variant: "default"
          });
        }
      } else {
        console.error('❌ Error en respuesta:', data);
        toast({
          title: "Error",
          description: data.error || "Error cargando calificaciones",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('💥 Error cargando calificaciones:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDebugInfo = async () => {
    try {
      const token = localStorage.getItem('sigea-token');
      const response = await fetch('/api/auth/debug-grades', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setDebugInfo(data.debug);
      console.log('🐛 Debug info:', data.debug);
      
      toast({
        title: "Debug ejecutado",
        description: `Usuario: ${data.debug?.userFound?.nombre || 'No encontrado'}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error en debug:', error);
    }
  };

  const getTipoEvaluacionLabel = (tipo: string) => {
    const labels: { [key: string]: string } = {
      'primer_parcial': 'Primer Parcial',
      'segundo_parcial': 'Segundo Parcial',
      'ordinario': 'Ordinario',
      'proyecto': 'Proyecto',
      'examenes_semanales': 'Exámenes Semanales',
      'calificacion_final': 'Calificación Final'
    };
    return labels[tipo] || tipo;
  };

  const getCalificacionColor = (calificacion: number) => {
    if (calificacion >= 90) return 'text-green-600';
    if (calificacion >= 80) return 'text-blue-600';
    if (calificacion >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculatePromedio = () => {
    if (materias.length === 0) return 0;
    
    const promedios = materias.map(materia => {
      const calificacionFinal = materia.calificaciones.find(c => c.tipo === 'calificacion_final');
      return calificacionFinal ? calificacionFinal.calificacion : 0;
    });
    
    return promedios.reduce((sum, cal) => sum + cal, 0) / promedios.length;
  };

  const getMateriasAprobadas = () => {
    return materias.filter(materia => {
      const final = materia.calificaciones.find(c => c.tipo === 'calificacion_final');
      return final && final.calificacion >= 70;
    }).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lasalle-blue to-lasalle-gold">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Cargando materias...</p>
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
                <BookOpen className="h-8 w-8 mr-3 text-lasalle-gold" />
                Materias y Calificaciones
              </h1>
              <p className="text-blue-100">3° Semestre - {user?.area_estudios}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={fetchGrades}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recargar
            </Button>
            <Button
              onClick={fetchDebugInfo}
              variant="outline"
              className="bg-red-500/20 hover:bg-red-500/30 text-white border-red-300"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Debug
            </Button>
          </div>
        </motion.div>

        {/* Información del Usuario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-white/95 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-lasalle-blue">Información del Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Nombre:</p>
                  <p>{user?.nombre}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Matrícula:</p>
                  <p>{user?.matricula}</p>
                </div>
                <div>
                  <p className="font-semibold">Área:</p>
                  <p>{user?.area_estudios} - {user?.semestre}° Semestre</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resumen Académico */}
        {materias.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-white/95 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="text-lasalle-blue flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Resumen Académico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-lasalle-blue/10 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <BookOpen className="h-6 w-6 text-lasalle-blue" />
                    </div>
                    <p className="text-sm text-gray-600">Total Materias</p>
                    <p className="text-2xl font-bold text-lasalle-blue">{materias.length}</p>
                  </div>
                  <div className="text-center p-4 bg-lasalle-gold/10 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-6 w-6 text-lasalle-gold" />
                    </div>
                    <p className="text-sm text-gray-600">Promedio General</p>
                    <p className="text-2xl font-bold text-lasalle-gold">{calculatePromedio().toFixed(1)}</p>
                  </div>
                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">Materias Aprobadas</p>
                    <p className="text-2xl font-bold text-green-600">{getMateriasAprobadas()}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-100 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Calculator className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">Total Créditos</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {materias.reduce((sum, m) => sum + m.creditos, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tabla de Materias */}
        {materias.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/95 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="text-lasalle-blue">Tabla de Calificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Materia</th>
                        <th className="text-center p-3 font-semibold">Código</th>
                        <th className="text-center p-3 font-semibold">Créditos</th>
                        <th className="text-center p-3 font-semibold">1er Parcial</th>
                        <th className="text-center p-3 font-semibold">2do Parcial</th>
                        <th className="text-center p-3 font-semibold">Ordinario</th>
                        <th className="text-center p-3 font-semibold">Proyecto</th>
                        <th className="text-center p-3 font-semibold">Semanales</th>
                        <th className="text-center p-3 font-semibold bg-lasalle-gold/20">Final</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materias.map((materia, index) => {
                        const primerParcial = materia.calificaciones.find(c => c.tipo === 'primer_parcial');
                        const segundoParcial = materia.calificaciones.find(c => c.tipo === 'segundo_parcial');
                        const ordinario = materia.calificaciones.find(c => c.tipo === 'ordinario');
                        const proyecto = materia.calificaciones.find(c => c.tipo === 'proyecto');
                        const semanales = materia.calificaciones.find(c => c.tipo === 'examenes_semanales');
                        const final = materia.calificaciones.find(c => c.tipo === 'calificacion_final');
                        
                        return (
                          <tr 
                            key={materia.codigo} 
                            className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-25' : ''}`}
                          >
                            <td className="p-3">
                              <div>
                                <p className="font-medium">{materia.materia}</p>
                                <p className="text-xs text-gray-500">{materia.codigo}</p>
                              </div>
                            </td>
                            <td className="text-center p-3">
                              <Badge variant="outline">{materia.codigo}</Badge>
                            </td>
                            <td className="text-center p-3 font-medium">{materia.creditos}</td>
                            <td className={`text-center p-3 font-bold ${getCalificacionColor(primerParcial?.calificacion || 0)}`}>
                              {primerParcial?.calificacion?.toFixed(1) || '-'}
                            </td>
                            <td className={`text-center p-3 font-bold ${getCalificacionColor(segundoParcial?.calificacion || 0)}`}>
                              {segundoParcial?.calificacion?.toFixed(1) || '-'}
                            </td>
                            <td className={`text-center p-3 font-bold ${getCalificacionColor(ordinario?.calificacion || 0)}`}>
                              {ordinario?.calificacion?.toFixed(1) || '-'}
                            </td>
                            <td className={`text-center p-3 font-bold ${getCalificacionColor(proyecto?.calificacion || 0)}`}>
                              {proyecto?.calificacion?.toFixed(1) || '-'}
                            </td>
                            <td className={`text-center p-3 font-bold ${getCalificacionColor(semanales?.calificacion || 0)}`}>
                              {semanales?.calificacion?.toFixed(1) || '-'}
                            </td>
                            <td className={`text-center p-3 font-bold text-lg bg-lasalle-gold/10 ${getCalificacionColor(final?.calificacion || 0)}`}>
                              {final?.calificacion?.toFixed(1) || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Card className="bg-white/95 backdrop-blur-md shadow-xl max-w-lg mx-auto">
              <CardContent className="pt-6">
                <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No hay materias disponibles
                </h3>
                <p className="text-gray-600 mb-4">
                  No se encontraron calificaciones para tu usuario.
                </p>
                
                <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm"><strong>Usuario:</strong> {user?.nombre}</p>
                  <p className="text-sm"><strong>Email:</strong> {user?.email}</p>
                  <p className="text-sm"><strong>Área:</strong> {user?.area_estudios}</p>
                  <p className="text-sm"><strong>Semestre:</strong> {user?.semestre}</p>
                </div>

                {debugInfo && (
                  <div className="text-left bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm font-semibold mb-2">Debug Info:</p>
                    <p className="text-xs"><strong>Usuario encontrado:</strong> {debugInfo.userFound ? 'Sí' : 'No'}</p>
                    <p className="text-xs"><strong>Calificaciones:</strong> {debugInfo.gradesCount || 0}</p>
                    <p className="text-xs"><strong>Token válido:</strong> {debugInfo.tokenDecoded ? 'Sí' : 'No'}</p>
                  </div>
                )}

                <div className="flex space-x-2 justify-center">
                  <Button
                    onClick={fetchGrades}
                    className="bg-lasalle-blue hover:bg-lasalle-gold"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Recargar
                  </Button>
                  <Button
                    onClick={fetchDebugInfo}
                    variant="outline"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Debug
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
