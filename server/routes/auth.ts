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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    const grades = await UserService.getUserGrades(decoded.id);

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

// Ruta para obtener categorías DET/AF
export const handleGetDetAfCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await UserService.getDetAfCategories();

    res.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    console.error('Error obteniendo categorías DET/AF:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error obteniendo categorías'
    });
  }
};

// Ruta para obtener inscripciones DET/AF del usuario
export const handleGetUserDetAfInscriptions: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.userId;

    const inscriptions = await UserService.getUserDetAfInscriptions(parseInt(userId));

    res.json({
      success: true,
      data: inscriptions
    });
  } catch (error: any) {
    console.error('Error obteniendo inscripciones DET/AF:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error obteniendo inscripciones'
    });
  }
};

// Ruta para inscribirse en DET/AF
export const handleEnrollDetAf: RequestHandler = async (req, res) => {
  try {
    const { userId, categoryId } = req.body;

    const result = await UserService.enrollDetAf(userId, categoryId);

    res.json({
      success: true,
      message: 'Inscripción exitosa',
      data: result
    });
  } catch (error: any) {
    console.error('Error en inscripción DET/AF:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Error en inscripción'
    });
  }
};

// Ruta para darse de baja de DET/AF
export const handleUnenrollDetAf: RequestHandler = async (req, res) => {
  try {
    const { userId, inscriptionId } = req.body;

    const result = await UserService.unenrollDetAf(userId, inscriptionId);

    res.json({
      success: true,
      message: 'Baja exitosa',
      data: result
    });
  } catch (error: any) {
    console.error('Error dando de baja DET/AF:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Error dando de baja'
    });
  }
};

// Ruta para obtener resumen académico del usuario
export const handleAcademicSummary: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
    }

    const token = authHeader.substring(7);
    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    const summary = await UserService.getUserAcademicSummary(decoded.id);

    res.json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    console.error('Error obteniendo resumen académico:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error obteniendo resumen académico'
    });
  }
};

// Ruta de debug para calificaciones
export const handleDebugGrades: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
    }

    const token = authHeader.substring(7);
    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    console.log('Usuario decodificado:', decoded);

    // Verificar usuario en BD
    const user = await UserService.getUserProfile(decoded.id);
    console.log('Usuario encontrado:', user);

    // Intentar obtener calificaciones
    const grades = await UserService.getUserGrades(decoded.id);
    console.log('Calificaciones encontradas:', grades);

    res.json({
      success: true,
      debug: {
        tokenDecoded: decoded,
        userFound: user,
        gradesCount: grades.length,
        grades: grades
      }
    });
  } catch (error: any) {
    console.error('Error en debug:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
};
