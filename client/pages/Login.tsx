import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, GraduationCap, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "@/hooks/use-loading";
import { useUser } from "@/hooks/use-user";
import { useI18n } from "@/hooks/use-i18n";

export default function Login() {
  const navigate = useNavigate();
  const { loadingWithDuration } = useLoading();
  const { setUserData } = useUser();
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Show loading animation
      const duration = Math.random() * (2000 - 1000) + 1000;
      const loadingPromise = loadingWithDuration(duration);

      // Make login API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if response is ok before reading body
      if (!response.ok) {
        let errorMessage = 'Error en login';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Save token and user data
      localStorage.setItem('sigea-token', data.token);
      setUserData(data.user);

      await loadingPromise;
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2Fb36e4af7e41f44e28ca835fddd3c49bf%2Fa9ee0952f0354bb6804c466eac9c3940?format=webp&width=800')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-lasalle-blue/20 via-transparent to-lasalle-blue/30"></div>
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/50">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fb36e4af7e41f44e28ca835fddd3c49bf%2F3593875d6b494a9cb99b9a85064b1311?format=webp&width=800"
                  alt="Universidad La Salle Pachuca"
                  className="h-20 w-auto"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-lasalle-blue mb-4">SIGEA</h1>
            <h2 className="text-2xl font-semibold text-lasalle-blue mb-6">
              Sistema Integral de Gestión Estudiantil
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Sistema Integral de Gestión Estudiantil y Académica
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Seguro</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4" />
                <span>Académico</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border border-white/50 bg-white/95 backdrop-blur-md">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4 lg:hidden">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Fb36e4af7e41f44e28ca835fddd3c49bf%2F3593875d6b494a9cb99b9a85064b1311?format=webp&width=800"
                    alt="Universidad La Salle Pachuca"
                    className="h-8 w-auto"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-lasalle-blue lg:hidden">
                SIGEA
              </CardTitle>
              <CardTitle className="text-2xl font-bold text-lasalle-blue hidden lg:block">
                {t.auth.login}
              </CardTitle>
              <p className="text-gray-600 mt-2">{t.auth.enterCredentials}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email / Matrícula
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="240088@lasallep.mx"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-12 border-gray-300 focus:border-lasalle-blue focus:ring-lasalle-blue"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    {t.auth.password}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={`${t.auth.password.toLowerCase()}...`}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="h-12 pr-12 border-gray-300 focus:border-lasalle-blue focus:ring-lasalle-blue"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="rounded border-gray-300 text-lasalle-blue focus:ring-lasalle-blue"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      {t.auth.rememberMe}
                    </Label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-lasalle-blue hover:text-lasalle-gold transition-colors"
                  >
                    {t.auth.forgotPassword}
                  </Link>
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-lasalle-blue hover:bg-lasalle-blue/90 text-white font-semibold transition-colors"
                >
                  {t.auth.login}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {t.auth.loginProblems}{" "}
                  <Link
                    to="/support"
                    className="text-lasalle-blue hover:text-lasalle-gold transition-colors font-medium"
                  >
                    {t.auth.contactSupport}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
