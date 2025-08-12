import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Sun, Globe, HelpCircle } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { language, setLanguage, t } = useI18n();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as "es" | "en");
  };

  const handleContactSupport = () => {
    // Scroll to footer or open support modal
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
          >
            <Card className="h-full rounded-none border-0 dark:bg-gray-900">
              <CardHeader className="border-b bg-lasalle-blue dark:bg-gray-800 text-white border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {t.settings.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Appearance Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    {isDarkMode ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                    <span>{t.settings.appearance}</span>
                  </h3>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {isDarkMode ? (
                        <Moon className="h-5 w-5 text-gray-600" />
                      ) : (
                        <Sun className="h-5 w-5 text-gray-600" />
                      )}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.settings.darkMode}
                      </span>
                    </div>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={handleDarkModeToggle}
                    />
                  </div>
                </div>

                {/* Language Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>{t.settings.language}</span>
                  </h3>

                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Select
                      value={language}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">{t.settings.spanish}</SelectItem>
                        <SelectItem value="en">{t.settings.english}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Support Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5" />
                    <span>{t.settings.support}</span>
                  </h3>

                  <Button
                    onClick={handleContactSupport}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    {t.settings.contactSupport}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
