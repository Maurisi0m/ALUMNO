import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleLogin, handleProfile, handleGrades, handleRegister } from "./routes/auth";
import { getConnection, closeConnection } from "./config/database";

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

  // Ruta de prueba de conexión a base de datos
  app.get("/api/test-db", async (req, res) => {
    try {
      await getConnection();
      res.json({ message: "Conexión a base de datos exitosa" });
    } catch (error: any) {
      res.status(500).json({ error: "Error conectando a base de datos: " + error.message });
    }
  });

  return app;
}
