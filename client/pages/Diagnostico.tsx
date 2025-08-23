import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
  Database,
  User,
  BookOpen,
  Activity,
  Settings,
  RefreshCw,
  UserPlus,
  Terminal
} from "lucide-react";

interface DiagnosticoData {
  conexion: string;
  tablas: string[];
  usuarios: {
    total: number;
    lista: any[];
  };
  usuarioMauro: {
    encontrado: boolean;
    datos: any;
  };
  testLogin: {
    exitoso: boolean;
    usuario: any;
  };
  materias: {
    total: number;
    lista: any[];
  };
  calificaciones: {
    total: number;
    lista: any[];
  };
  configuracion: any;
}

export default function Diagnostico() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [diagnostico, setDiagnostico] = useState<DiagnosticoData | null>(null);
  const [loading, setLoading] = useState(false);

  const ejecutarDiagnostico = async () => {
    try {
      setLoading(true);
      console.log('🔍 Ejecutando diagnóstico completo...');
      
      const response = await fetch('/api/debug/full', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('📊 Resultado diagnóstico:', data);

      if (response.ok) {
        setDiagnostico(data.diagnostico);
        toast({
          title: "Diagnóstico completado",
          description: "Revisa los resultados abajo",
          variant: "default"
        });
      } else {
        toast({
          title: "Error en diagnóstico",
          description: data.error || "Error desconocido",
          variant: "destructive"
        });
        console.error('❌ Error:', data);
      }
    } catch (error) {
      console.error('💥 Error ejecutando diagnóstico:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const crearUsuarioForzado = async () => {
    try {
      setLoading(true);
      console.log('🔧 Creando usuario forzado...');
      
      const response = await fetch('/api/debug/force-create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('👤 Usuario creado:', data);

      if (response.ok) {
        toast({
          title: "Usuario creado",
          description: `Usuario ${data.usuario?.nombre} creado exitosamente`,
          variant: "default"
        });
        // Reejecutar diagnóstico
        await ejecutarDiagnostico();
      } else {
        toast({
          title: "Error creando usuario",
          description: data.error || "Error desconocido",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('💥 Error creando usuario:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo crear el usuario",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const getStatusColor = (status: boolean) => {
    return status ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600">
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
              className="text-white hover:text-yellow-300 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Regresar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <AlertCircle className="h-8 w-8 mr-3 text-yellow-300" />
                Diagnóstico de Sistema
              </h1>
              <p className="text-orange-100">Herramienta de debug para resolver problemas</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={ejecutarDiagnostico}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Ejecutar Diagnóstico
            </Button>
            <Button
              onClick={crearUsuarioForzado}
              disabled={loading}
              className="bg-green-500/20 hover:bg-green-500/30 text-white border border-green-300"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Crear Usuario
            </Button>
          </div>
        </motion.div>

        {/* Instrucciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-white/95 backdrop-blur-md shadow-xl border-l-4 border-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Terminal className="h-6 w-6 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Instrucciones de Diagnóstico</h3>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Haz clic en "Ejecutar Diagnóstico" para revisar el estado actual</li>
                    <li>Si el usuario Mauro no existe, haz clic en "Crear Usuario"</li>
                    <li>Verifica que todas las secciones muestren estado ✅</li>
                    <li>Si hay problemas, ejecuta los scripts SQL proporcionados</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resultados del Diagnóstico */}
        {diagnostico && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Estado de Conexión */}
            <Card className="bg-white/95 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-blue-600" />
                  Estado de Conexi��n
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(diagnostico.conexion === 'OK')}
                  <span className={`font-semibold ${getStatusColor(diagnostico.conexion === 'OK')}`}>
                    {diagnostico.conexion === 'OK' ? 'Conexión exitosa' : 'Error de conexión'}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Servidor:</p>
                    <p>{diagnostico.configuracion?.SQL_SERVER || 'No configurado'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Base de datos:</p>
                    <p>{diagnostico.configuracion?.SQL_DATABASE || 'No configurado'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Usuario:</p>
                    <p>{diagnostico.configuracion?.SQL_USER || 'No configurado'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Tablas:</p>
                    <p>{diagnostico.tablas?.length || 0} encontradas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estado del Usuario Mauro */}
            <Card className="bg-white/95 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  Usuario Mauro Ortiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(diagnostico.usuarioMauro.encontrado)}
                    <span className={`font-semibold ${getStatusColor(diagnostico.usuarioMauro.encontrado)}`}>
                      {diagnostico.usuarioMauro.encontrado ? 'Usuario encontrado' : 'Usuario NO encontrado'}
                    </span>
                  </div>
                  
                  {diagnostico.usuarioMauro.encontrado && diagnostico.usuarioMauro.datos && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Datos del usuario:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div><strong>ID:</strong> {diagnostico.usuarioMauro.datos.id}</div>
                        <div><strong>Nombre:</strong> {diagnostico.usuarioMauro.datos.nombre}</div>
                        <div><strong>Email:</strong> {diagnostico.usuarioMauro.datos.email}</div>
                        <div><strong>Matrícula:</strong> {diagnostico.usuarioMauro.datos.matricula}</div>
                        <div><strong>Área:</strong> {diagnostico.usuarioMauro.datos.area_estudios}</div>
                        <div><strong>Semestre:</strong> {diagnostico.usuarioMauro.datos.semestre}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    {getStatusIcon(diagnostico.testLogin.exitoso)}
                    <span className={`font-semibold ${getStatusColor(diagnostico.testLogin.exitoso)}`}>
                      {diagnostico.testLogin.exitoso ? 'Login funciona correctamente' : 'Login NO funciona'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estado de Materias */}
            <Card className="bg-white/95 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                  Materias de Arquitectura 3er Semestre
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  {getStatusIcon(diagnostico.materias.total > 0)}
                  <span className={`font-semibold ${getStatusColor(diagnostico.materias.total > 0)}`}>
                    {diagnostico.materias.total} materias encontradas
                  </span>
                </div>
                
                {diagnostico.materias.total > 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Materias disponibles:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {diagnostico.materias.lista.map((materia, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Badge variant="outline">{materia.codigo}</Badge>
                          <span>{materia.nombre}</span>
                          <span className="text-gray-500">({materia.creditos} cr.)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estado de Calificaciones */}
            <Card className="bg-white/95 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-orange-600" />
                  Calificaciones de Mauro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  {getStatusIcon(diagnostico.calificaciones.total > 0)}
                  <span className={`font-semibold ${getStatusColor(diagnostico.calificaciones.total > 0)}`}>
                    {diagnostico.calificaciones.total} calificaciones encontradas
                  </span>
                </div>
                
                {diagnostico.calificaciones.total > 0 && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Primeras 5 calificaciones:</h4>
                    <div className="space-y-2 text-sm">
                      {diagnostico.calificaciones.lista.map((cal, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-1">
                          <span>{cal.materia} ({cal.tipo_evaluacion})</span>
                          <Badge variant="secondary">{cal.calificacion}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resumen */}
            <Card className="bg-white/95 backdrop-blur-md shadow-xl border-l-4 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-600" />
                  Resumen del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{diagnostico.usuarios.total}</div>
                    <div className="text-sm text-gray-600">Usuarios Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{diagnostico.materias.total}</div>
                    <div className="text-sm text-gray-600">Materias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{diagnostico.calificaciones.total}</div>
                    <div className="text-sm text-gray-600">Calificaciones</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{diagnostico.tablas.length}</div>
                    <div className="text-sm text-gray-600">Tablas BD</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Mensaje inicial */}
        {!diagnostico && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Card className="bg-white/95 backdrop-blur-md shadow-xl max-w-md mx-auto">
              <CardContent className="pt-6">
                <Database className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Listo para Diagnóstico
                </h3>
                <p className="text-gray-600 mb-4">
                  Haz clic en "Ejecutar Diagnóstico" para comenzar el análisis del sistema.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
