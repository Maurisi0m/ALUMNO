import { motion } from "framer-motion";
import { ArrowLeft, Construction } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PlaceholderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function Placeholder({
  title,
  description,
  icon,
}: PlaceholderProps) {
  const { t } = useI18n();
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2Fb36e4af7e41f44e28ca835fddd3c49bf%2Fa9ee0952f0354bb6804c466eac9c3940?format=webp&width=800')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-white/80"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-lasalle-blue/10 via-transparent to-lasalle-blue/20"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md text-center bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {icon || (
                <Construction className="h-16 w-16 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.placeholder.underConstruction} {t.placeholder.continueMessage}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/dashboard">
                <Button className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t.common.backToDashboard}
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
