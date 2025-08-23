import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";

export default function RegularizacionIntersemestral() {
  const navigate = useNavigate();

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
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center min-h-[60vh]"
        >
          <Card className="bg-white/95 backdrop-blur-md shadow-xl max-w-md w-full">
            <CardContent className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                NO HAY NADA AQUI.... (AUN)
              </h2>
              <p className="text-gray-600">
                Esta sección estará disponible próximamente.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
