import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, UserPlus, Database, AlertCircle, CheckCircle } from "lucide-react";

interface BulkCreationResult {
  success: boolean;
  message: string;
  data?: {
    totalCreated: number;
    totalRequested: number;
    errors: string[];
    sample: any[];
  };
}

interface UserStats {
  area_estudios: string;
  semestres: Array<{
    semestre: number;
    total_usuarios: number;
    usuarios_activos: number;
  }>;
  total_usuarios: number;
  usuarios_activos: number;
}

export default function BulkUsers() {
  const [startMatricula, setStartMatricula] = useState("240001");
  const [count, setCount] = useState("700");
  const [distributeYears, setDistributeYears] = useState("24,25");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BulkCreationResult | null>(null);
  const [stats, setStats] = useState<UserStats[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  const handleCreateUsers = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const years = distributeYears.split(',').map(y => y.trim());
      
      const response = await fetch('/api/bulk-users/bachillerato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startMatricula: parseInt(startMatricula),
          count: parseInt(count),
          distributeYears: years
        })
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Recargar estadísticas después de crear usuarios
        await loadStats();
      }

    } catch (error) {
      setResult({
        success: false,
        message: `Error de conexión: ${error}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch('/api/bulk-users/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data.byArea);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Creación Masiva de Usuarios</h1>
          <p className="text-muted-foreground">
            Genera usuarios de bachillerato de forma masiva
          </p>
        </div>
      </div>

      {/* Formulario de creación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Generar Usuarios de Bachillerato
          </CardTitle>
          <CardDescription>
            Crea usuarios masivamente del 240001 hasta donde caiga, distribuidos entre años y semestres
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startMatricula">Matrícula Inicial</Label>
              <Input
                id="startMatricula"
                value={startMatricula}
                onChange={(e) => setStartMatricula(e.target.value)}
                placeholder="240001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="count">Cantidad de Usuarios</Label>
              <Input
                id="count"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="700"
                type="number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="years">Años de Distribución</Label>
              <Input
                id="years"
                value={distributeYears}
                onChange={(e) => setDistributeYears(e.target.value)}
                placeholder="24,25"
              />
              <p className="text-xs text-muted-foreground">
                Separados por comas (ej: 24,25)
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleCreateUsers} 
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? "Creando usuarios..." : "Crear Usuarios"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultado de la creación */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              Resultado de la Creación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className={result.success ? "border-green-200" : "border-red-200"}>
              <AlertDescription>
                {result.message}
              </AlertDescription>
            </Alert>

            {result.success && result.data && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    Creados: {result.data.totalCreated}
                  </Badge>
                  <Badge variant="outline">
                    Solicitados: {result.data.totalRequested}
                  </Badge>
                  <Badge variant={result.data.errors.length > 0 ? "destructive" : "default"}>
                    Errores: {result.data.errors.length}
                  </Badge>
                </div>

                {result.data.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Errores encontrados:</h4>
                    <Textarea
                      value={result.data.errors.join('\n')}
                      readOnly
                      className="h-24 text-xs"
                    />
                  </div>
                )}

                {result.data.sample.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Muestra de usuarios creados:</h4>
                    <div className="text-xs space-y-1">
                      {result.data.sample.map((user, index) => (
                        <div key={index} className="font-mono">
                          {user.matricula} - {user.nombre} - {user.email}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Estadísticas de usuarios */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>Estadísticas de Usuarios</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadStats}
              disabled={loadingStats}
            >
              {loadingStats ? "Cargando..." : "Actualizar"}
            </Button>
          </div>
          <CardDescription>
            Resumen de usuarios por área de estudios y semestre
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Haz clic en "Actualizar" para cargar las estadísticas
            </p>
          ) : (
            <div className="space-y-4">
              {stats.map((area, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{area.area_estudios}</h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        Total: {area.total_usuarios}
                      </Badge>
                      <Badge variant="default">
                        Activos: {area.usuarios_activos}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-6 gap-2">
                    {area.semestres.map((sem, semIndex) => (
                      <div key={semIndex} className="text-center p-2 bg-muted rounded">
                        <div className="text-xs font-medium">Sem {sem.semestre}</div>
                        <div className="text-sm">{sem.usuarios_activos}</div>
                      </div>
                    ))}
                  </div>
                  
                  {index < stats.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
