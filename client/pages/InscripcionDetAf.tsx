import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  ArrowLeft,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  AlertCircle,
  Trophy,
  Zap
} from "lucide-react";

interface Category {
  id: number;
  tipo: 'DET' | 'AF';
  nombre: string;
  descripcion: string;
  cupo_maximo: number;
}

interface Inscription {
  id: number;
  tipo: 'DET' | 'AF';
  nombre: string;
  descripcion: string;
  fecha_inscripcion: string;
  estado: string;
}

export default function InscripcionDetAf() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCategories(),
        fetchInscriptions()
      ]);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/det-af/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const fetchInscriptions = async () => {
    try {
      if (!user?.id) return;
      
      const response = await fetch(`/api/det-af/inscriptions/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setInscriptions(data.data || []);
      }
    } catch (error) {
      console.error('Error cargando inscripciones:', error);
    }
  };

  const handleEnroll = async (categoryId: number, categoryName: string) => {
    try {
      const response = await fetch('/api/det-af/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.id,
          categoryId
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "¡Inscripción exitosa!",
          description: `Te has inscrito en ${categoryName}`,
          variant: "default"
        });
        await fetchInscriptions();
      } else {
        toast({
          title: "Error en inscripción",
          description: data.error || "No se pudo completar la inscripción",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error en inscripción:', error);
      toast({
        title: "Error",
        description: "Error de conexión. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  const handleUnenroll = async (inscriptionId: number, categoryName: string) => {
    try {
      const response = await fetch('/api/det-af/unenroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.id,
          inscriptionId
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Baja exitosa",
          description: `Te has dado de baja de ${categoryName}`,
          variant: "default"
        });
        await fetchInscriptions();
      } else {
        toast({
          title: "Error",
          description: data.error || "No se pudo completar la baja",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error en baja:', error);
      toast({
        title: "Error",
        description: "Error de conexión. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  const isEnrolled = (categoryId: number) => {
    return inscriptions.some(inscription => 
      categories.find(cat => cat.id === categoryId && cat.nombre === inscription.nombre)
    );
  };

  const getTypeIcon = (tipo: 'DET' | 'AF') => {
    return tipo === 'DET' ? <Zap className="h-5 w-5" /> : <Trophy className="h-5 w-5" />;
  };

  const getTypeColor = (tipo: 'DET' | 'AF') => {
    return tipo === 'DET' 
      ? 'bg-orange-500 text-white' 
      : 'bg-green-500 text-white';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lasalle-blue to-lasalle-gold">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  const detCategories = categories.filter(cat => cat.tipo === 'DET');
  const afCategories = categories.filter(cat => cat.tipo === 'AF');

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
                <Building2 className="h-8 w-8 mr-3 text-lasalle-gold" />
                Inscripción DET / AF
              </h1>
              <p className="text-blue-100">Desarrollo de Talentos y Activación Física</p>
            </div>
          </div>
        </motion.div>

        {/* Mis Inscripciones Actuales */}
        {inscriptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-white/95 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="text-lasalle-blue flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Mis Inscripciones Actuales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {inscriptions.map((inscription) => (
                    <div
                      key={inscription.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-green-50"
                    >
                      <div className="flex items-center space-x-4">
                        {getTypeIcon(inscription.tipo)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{inscription.nombre}</h3>
                          <p className="text-sm text-gray-600">{inscription.descripcion}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            <Badge className={getTypeColor(inscription.tipo)}>
                              {inscription.tipo}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Inscrito: {new Date(inscription.fecha_inscripcion).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnenroll(inscription.id, inscription.nombre)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Dar de baja
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Categorías DET */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-white/95 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-lasalle-blue flex items-center">
                <Zap className="h-5 w-5 mr-2 text-orange-500" />
                Desarrollo de Talentos (DET)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {detCategories.length > 0 ? (
                <div className="grid gap-4">
                  {detCategories.map((category) => {
                    const enrolled = isEnrolled(category.id);
                    return (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Zap className="h-6 w-6 text-orange-500" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{category.nombre}</h3>
                            <p className="text-sm text-gray-600">{category.descripcion}</p>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge className="bg-orange-500 text-white">
                                DET
                              </Badge>
                              <span className="text-xs text-gray-500 flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                Cupo máximo: {category.cupo_maximo}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          {enrolled ? (
                            <Badge variant="secondary" className="text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Inscrito
                            </Badge>
                          ) : (
                            <Button
                              onClick={() => handleEnroll(category.id, category.nombre)}
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Inscribirse
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay categorías DET disponibles en este momento.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Categorías AF */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/95 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-lasalle-blue flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-green-500" />
                Activación Física (AF)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {afCategories.length > 0 ? (
                <div className="grid gap-4">
                  {afCategories.map((category) => {
                    const enrolled = isEnrolled(category.id);
                    return (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Trophy className="h-6 w-6 text-green-500" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{category.nombre}</h3>
                            <p className="text-sm text-gray-600">{category.descripcion}</p>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge className="bg-green-500 text-white">
                                AF
                              </Badge>
                              <span className="text-xs text-gray-500 flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                Cupo máximo: {category.cupo_maximo}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          {enrolled ? (
                            <Badge variant="secondary" className="text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Inscrito
                            </Badge>
                          ) : (
                            <Button
                              onClick={() => handleEnroll(category.id, category.nombre)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Inscribirse
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay categorías AF disponibles en este momento.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
