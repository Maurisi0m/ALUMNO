import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/hooks/use-i18n";
import {
  BookOpen,
  ArrowLeft,
  AlertTriangle,
  ExternalLink,
  Clock,
  Users,
  GraduationCap,
  FileText,
  Shield,
  Calendar,
} from "lucide-react";

export default function Manual() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
          url('https://cdn.builder.io/api/v1/image/assets%2Fb36e4af7e41f44e28ca835fddd3c49bf%2Fc1e9f4b7f5a94e7db1f8c4d6e7c2b9a1?format=webp&width=1920')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-white hover:text-lasalle-gold hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.common.backToDashboard}
            </Button>
          </div>
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-lasalle-blue/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-lasalle-blue dark:text-white flex items-center justify-center">
                <BookOpen className="h-8 w-8 mr-3 text-lasalle-gold" />
                {t.manual.title}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {t.manual.subtitle}
              </p>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Tabla de Contenidos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-lasalle-blue/20">
            <CardHeader>
              <CardTitle className="text-xl text-lasalle-blue dark:text-white">
                {t.manual.contents}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#admission"
                    className="text-blue-600 hover:text-lasalle-gold transition-colors font-medium flex items-center"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    1. Solicitud de Admisión
                  </a>
                </li>
                <li>
                  <a
                    href="#system-access"
                    className="text-blue-600 hover:text-lasalle-gold transition-colors font-medium flex items-center"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    2. Sistema Escolar SIGEA
                  </a>
                </li>
                <li>
                  <a
                    href="#recommendations"
                    className="text-blue-600 hover:text-lasalle-gold transition-colors font-medium flex items-center"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    3. Recomendaciones Adicionales
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-blue-600 hover:text-lasalle-gold transition-colors font-medium flex items-center"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    4. {t.manual.frequentlyAsked}
                  </a>
                </li>
                <li>
                  <a
                    href="#important-links"
                    className="text-blue-600 hover:text-lasalle-gold transition-colors font-medium flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    5. Enlaces Importantes
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sección: Solicitud de Admisión */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          id="admission"
        >
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-lasalle-blue/20">
            <CardHeader>
              <CardTitle className="text-xl text-lasalle-blue dark:text-white flex items-center">
                <Users className="h-6 w-6 mr-2 text-lasalle-gold" />
                Solicitud de Admisión
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t.manual.admissionIntro}
              </p>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <a
                  href="https://sigea.lasallep.edu.mx/alumno/SolicitudAdmisionNueva.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Solicitud de Admisión
                </a>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t.manual.admissionFormInfo}
              </p>

              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                      {t.manual.important}
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">
                      {t.manual.admissionImportantNote}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sección: Sistema Escolar SIGEA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          id="system-access"
        >
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-lasalle-blue/20">
            <CardHeader>
              <CardTitle className="text-xl text-lasalle-blue dark:text-white flex items-center">
                <Shield className="h-6 w-6 mr-2 text-lasalle-gold" />
                Sistema Escolar SIGEA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t.manual.systemIntro}
              </p>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <a
                  href="https://sigea.lasallep.edu.mx/alumno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  SIGEA Alumno
                </a>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-lasalle-blue dark:text-white">
                  Información de Acceso:
                </h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-lasalle-gold">•</span>
                    <span>{t.manual.accessInfo}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-lasalle-gold">•</span>
                    <span>
                      <strong>Nota:</strong> {t.manual.accountNote}
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-lasalle-gold">•</span>
                    <span>{t.manual.systemFeatures}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  Datos de Acceso para Estudiantes:
                </h5>
                <div className="space-y-2 text-sm text-green-700 dark:text-green-400">
                  <p>
                    <strong>Estudiantes actuales:</strong> Correo institucional
                    y contraseña
                  </p>
                  <p>
                    <strong>Aspirantes:</strong> CURP y contraseña registrada en
                    la ficha de admisión
                  </p>
                  <p>
                    <strong>Nota:</strong> {t.manual.useInstitutionalEmail}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sección: Recomendaciones Adicionales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          id="recommendations"
        >
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-lasalle-blue/20">
            <CardHeader>
              <CardTitle className="text-xl text-lasalle-blue dark:text-white flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-lasalle-gold" />
                Recomendaciones Adicionales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    Navegador Recomendado:
                  </h5>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {t.manual.chromeRecommendation}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h5 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                    Tiempo de Sesión:
                  </h5>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    {t.manual.sessionTime}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sección: FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          id="faq"
        >
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-lasalle-blue/20">
            <CardHeader>
              <CardTitle className="text-xl text-lasalle-blue dark:text-white">
                {t.manual.frequentlyAsked}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-lasalle-gold pl-4">
                <h5 className="font-semibold text-lasalle-blue dark:text-white mb-2">
                  {t.manual.faq1Question}
                </h5>
                <p className="text-gray-600 dark:text-gray-300">
                  {t.manual.faq1Answer}
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h5 className="font-semibold text-lasalle-blue dark:text-white mb-2">
                  {t.manual.faq2Question}
                </h5>
                <p className="text-gray-600 dark:text-gray-300">
                  {t.manual.faq2Answer}
                  <a
                    href="https://sigea.lasallep.edu.mx/alumno"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    SIGEA Alumno
                  </a>
                  .
                </p>
              </div>

              <div className="border-l-4 border-lasalle-blue pl-4">
                <h5 className="font-semibold text-lasalle-blue dark:text-white mb-2">
                  {t.manual.faq3Question}
                </h5>
                <p className="text-gray-600 dark:text-gray-300">
                  {t.manual.faq3Answer}
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h5 className="font-semibold text-lasalle-blue dark:text-white mb-2">
                  ¿Cómo accedo al calendario académico?
                </h5>
                <p className="text-gray-600 dark:text-gray-300">
                  Puedes acceder al calendario oficial a través del enlace en el
                  dashboard o directamente en:
                  <a
                    href="https://www.lasallep.edu.mx/ulsap/AlumnoDocente/Calendario.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Calendario Académico Oficial
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sección: Enlaces Importantes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          id="important-links"
        >
          <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl border border-lasalle-blue/20">
            <CardHeader>
              <CardTitle className="text-xl text-lasalle-blue dark:text-white flex items-center">
                <ExternalLink className="h-6 w-6 mr-2 text-lasalle-gold" />
                Enlaces y Documentos Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h6 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                    Accesos Directos al Sistema
                  </h6>
                  <div className="space-y-2">
                    <a
                      href="https://sigea.lasallep.edu.mx/alumno"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      SIGEA Alumno
                    </a>
                    <a
                      href="https://sigea.lasallep.edu.mx/alumno/SolicitudAdmisionNueva.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Solicitud de Admisión
                    </a>
                    <a
                      href="https://www.lasallep.edu.mx/ulsap/AlumnoDocente/Calendario.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Calendario Académico Oficial
                    </a>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h6 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                    Plataformas Relacionadas
                  </h6>
                  <div className="space-y-2 text-sm text-green-700 dark:text-green-400">
                    <p>• Outlook (Correo institucional)</p>
                    <p>• Moodle (Plataforma virtual)</p>
                    <p>• Teams (Videoconferencias)</p>
                    <p>• Portal web universitario</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 dark:text-yellow-300 font-medium mb-2">
                      Importante: Credenciales Unificadas
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                      {t.manual.accountNote} Si tienes problemas con alguna
                      plataforma, es probable que sea la misma solución para
                      todas.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
