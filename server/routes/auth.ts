import { RequestHandler } from "express";
import { UserService } from "../services/userService";
import jwt from "jsonwebtoken";

// Ruta de login
export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    const result = await UserService.login({ email, password });

    res.json({
      success: true,
      message: 'Login exitoso',
      token: result.token,
      user: result.user
    });

  } catch (error: any) {
    console.error('Error en login:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Error en autenticación'
    });
  }
};

// Ruta de perfil (requiere autenticación)
export const handleProfile: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    const user = await UserService.getUserProfile(decoded.id);

    res.json({
      success: true,
      user: user
    });

  } catch (error: any) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor'
    });
  }
};

// Ruta de calificaciones
export const handleGrades: RequestHandler = async (req, res) => {
  try {
    const userId = req.body.userId; // Del token JWT

    const grades = await UserService.getUserGrades(userId);

    res.json({
      success: true,
      data: grades
    });

  } catch (error: any) {
    console.error('Error obteniendo calificaciones:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error obteniendo calificaciones'
    });
  }
};

// Ruta de registro
export const handleRegister: RequestHandler = async (req, res) => {
  try {
    const userData = req.body;

    const newUser = await UserService.createUser(userData);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: newUser
    });

  } catch (error: any) {
    console.error('Error en registro:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Error creando usuario'
    });
  }
};
