import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import {
  BookOpen,
  ArrowLeft,
  TrendingUp,
  Award,
  BarChart3,
  Calculator,
  Clock,
  Target
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

export default function Materias() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGrades();
    }
  }, [user]);

  const fetchGrades = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token encontrado:', !!token);

      const response = await fetch('/api/auth/grades', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setMaterias(data.data || []);
        console.log('Materias configuradas:', data.data?.length || 0);
      } else {
        console.error('Error en respuesta:', data);
      }
    } catch (error) {
      console.error('Error cargando calificaciones:', error);
    } finally {
      setLoading(false);
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
    if (calificacion >= 90) return 'text-green-600 bg-green-50';
    if (calificacion >= 80) return 'text-blue-600 bg-blue-50';
    if (calificacion >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const calculatePromedio = () => {
    if (materias.length === 0) return 0;
    
    const promedios = materias.map(materia => {
      const calificacionFinal = materia.calificaciones.find(c => c.tipo === 'calificacion_final');
      return calificacionFinal ? calificacionFinal.calificacion : 0;
    });
    
    return promedios.reduce((sum, cal) => sum + cal, 0) / promedios.length;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lasalle-blue to-lasalle-gold">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
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
        </motion.div>

        {/* Resumen General */}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Materias Aprobadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {materias.filter(m => {
                      const final = m.calificaciones.find(c => c.tipo === 'calificacion_final');
                      return final && final.calificacion >= 70;
                    }).length}
                  </p>
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

        {/* Lista de Materias */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6"
        >
          {materias.map((materia, index) => {
            const calificacionFinal = materia.calificaciones.find(c => c.tipo === 'calificacion_final');
            
            return (
              <motion.div
                key={materia.codigo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/95 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-lasalle-blue flex items-center">
                          <BookOpen className="h-5 w-5 mr-2" />
                          {materia.materia}
                        </CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline" className="text-gray-600">
                            {materia.codigo}
                          </Badge>
                          <Badge variant="outline" className="text-gray-600">
                            {materia.creditos} créditos
                          </Badge>
                        </div>
                      </div>
                      {calificacionFinal && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Calificación Final</p>
                          <p className={`text-3xl font-bold ${getCalificacionColor(calificacionFinal.calificacion)}`}>
                            {calificacionFinal.calificacion.toFixed(1)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {materia.calificaciones
                        .filter(cal => cal.tipo !== 'calificacion_final')
                        .map((calificacion, idx) => (
                        <div
                          key={idx}
                          className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-gray-600">
                              {getTipoEvaluacionLabel(calificacion.tipo)}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {calificacion.porcentaje}%
                            </Badge>
                          </div>
                          <p className={`text-lg font-bold ${getCalificacionColor(calificacion.calificacion)}`}>
                            {calificacion.calificacion.toFixed(1)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {materias.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Card className="bg-white/95 backdrop-blur-md shadow-xl max-w-md mx-auto">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay calificaciones disponibles
                </h3>
                <p className="text-gray-600 mb-4">
                  Las calificaciones aparecerán aquí una vez que sean registradas por tus profesores.
                </p>
                <div className="text-sm text-gray-500">
                  <p>Usuario: {user?.nombre}</p>
                  <p>Email: {user?.email}</p>
                  <p>Área: {user?.area_estudios}</p>
                  <p>Semestre: {user?.semestre}</p>
                </div>
                <Button
                  onClick={fetchGrades}
                  className="mt-4 bg-lasalle-blue hover:bg-lasalle-gold"
                >
                  Recargar datos
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
