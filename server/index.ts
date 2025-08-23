import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleLogin, handleProfile, handleGrades, handleRegister, handleGetDetAfCategories, handleGetUserDetAfInscriptions, handleEnrollDetAf, handleUnenrollDetAf, handleDebugGrades, handleAcademicSummary } from "./routes/auth";
import { handleFullDatabaseDebug, handleForceCreateUser, handleCustomQuery } from "./routes/debug";
import { getConnection, closeConnection } from "./config/database";

// Importar nuevas rutas DET/AF
import {
  authenticateToken,
  handleGetCategories,
  handleGetMyInscriptions,
  handleGetMyStatus,
  handleEnroll,
  handleUnenroll,
  handleCheckEligibility,
  handleGetStats,
  handleGetAllInscriptions
} from "./routes/detAf";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rutas API de ejemplo
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Rutas de autenticación y base de datos
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/register", handleRegister);
  app.get("/api/auth/profile", handleProfile);
  app.get("/api/auth/grades", handleGrades);
  app.get("/api/auth/debug-grades", handleDebugGrades);
  app.get("/api/auth/academic-summary", handleAcademicSummary);

  // ================================================================
  // NUEVAS RUTAS DET/AF CON AUTENTICACIÓN MEJORADA
  // ================================================================

  // Rutas públicas DET/AF (no requieren autenticación)
  app.get("/api/detaf/categories", handleGetCategories);
  app.get("/api/detaf/stats", handleGetStats);

  // Rutas protegidas DET/AF (requieren autenticación)
  app.get("/api/detaf/my-inscriptions", authenticateToken, handleGetMyInscriptions);
  app.get("/api/detaf/my-status", authenticateToken, handleGetMyStatus);
  app.post("/api/detaf/enroll", authenticateToken, handleEnroll);
  app.post("/api/detaf/unenroll", authenticateToken, handleUnenroll);
  app.get("/api/detaf/check-eligibility/:categoryId", authenticateToken, handleCheckEligibility);

  // Rutas de administrador DET/AF
  app.get("/api/detaf/admin/inscriptions", authenticateToken, handleGetAllInscriptions);

  // ================================================================
  // RUTAS LEGACY DET/AF (MANTENER PARA COMPATIBILIDAD TEMPORAL)
  // ================================================================
  app.get("/api/det-af/categories", handleGetDetAfCategories);
  app.get("/api/det-af/inscriptions/:userId", handleGetUserDetAfInscriptions);
  app.post("/api/det-af/enroll", handleEnrollDetAf);
  app.post("/api/det-af/unenroll", handleUnenrollDetAf);

  // Ruta de prueba de conexión a base de datos
  app.get("/api/test-db", async (req, res) => {
    try {
      await getConnection();
      res.json({ message: "Conexión a base de datos exitosa" });
    } catch (error: any) {
      res.status(500).json({ error: "Error conectando a base de datos: " + error.message });
    }
  });

  // Rutas de debug avanzado
  app.get("/api/debug/full", handleFullDatabaseDebug);
  app.post("/api/debug/force-create-user", handleForceCreateUser);
  app.post("/api/debug/custom-query", handleCustomQuery);

  // Test directo de calificaciones sin token
  app.get("/api/test/grades-direct", async (req, res) => {
    try {
      const pool = await getConnection();

      // Buscar usuario Mauro
      const userResult = await pool.request()
        .input('email', 'VARCHAR', '240088@lasallep.mx')
        .query('SELECT id, nombre, email FROM usuarios WHERE email = @email');

      if (userResult.recordset.length === 0) {
        return res.json({ error: 'Usuario Mauro no encontrado', usuarios: [] });
      }

      const userId = userResult.recordset[0].id;
      console.log('Test directo - Usuario ID:', userId);

      // Obtener calificaciones
      const { UserService } = await import('./services/userService');
      const grades = await UserService.getUserGrades(userId);

      res.json({
        success: true,
        usuario: userResult.recordset[0],
        calificaciones: grades,
        totalMaterias: grades.length
      });

    } catch (error: any) {
      console.error('Error en test directo:', error);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  });

  return app;
}
