import { createContext, useContext, useState, ReactNode } from "react";

type Language = "es" | "en";

interface Translations {
  common: {
    welcome: string;
    backToDashboard: string;
    loading: string;
    search: string;
    settings: string;
    logout: string;
    save: string;
    cancel: string;
    close: string;
    edit: string;
    delete: string;
    add: string;
    view: string;
  };
  auth: {
    login: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    enterSystem: string;
    recoverPassword: string;
    contactSupport: string;
    loginProblems: string;
    studentId: string;
    enterCredentials: string;
  };
  dashboard: {
    welcome: string;
    academicSummary: string;
    studentInfo: string;
    studentId: string;
    career: string;
    semester: string;
    studyArea: string;
    quickActions: string;
    totalSubjects: string;
    currentGPA: string;
    completedCredits: string;
    attendanceRate: string;
  };
  sections: {
    // Secciones específicas para estudiantes - las originales de SIGEA
    subjects: string;
    subjectsDesc: string;
    downloads: string;
    downloadsDesc: string;
    detInscription: string;
    detInscriptionDesc: string;
    schoolCalendar: string;
    schoolCalendarDesc: string;
    intersemestralReg: string;
    intersemestralRegDesc: string;
    semestralReg: string;
    semestralRegDesc: string;
    extraordinary: string;
    extraordinaryDesc: string;
    chooseStudyArea: string;
    chooseStudyAreaDesc: string;
    inscription: string;
    inscriptionDesc: string;
    reinscription: string;
    reinscriptionDesc: string;
    admission: string;
    admissionDesc: string;
    systemManual: string;
    systemManualDesc: string;
  };
  manual: {
    title: string;
    subtitle: string;
    contents: string;
    gettingStarted: string;
    accessInstructions: string;
    frequentlyAsked: string;
    importantNotes: string;
    sessionTime: string;
    recoverPassword: string;
    systemAccess: string;
    troubleshooting: string;
    // Contenido específico para manual de estudiantes
    admissionIntro: string;
    systemIntro: string;
    accessInfo: string;
    accountNote: string;
    systemFeatures: string;
    chromeRecommendation: string;
    faq1Question: string;
    faq1Answer: string;
    faq2Question: string;
    faq2Answer: string;
    faq3Question: string;
    faq3Answer: string;
    useInstitutionalEmail: string;
    institutionalEmailLabel: string;
    important: string;
    underConstruction: string;
    // Contenido detallado para estudiantes
    admissionFormInfo: string;
    admissionImportantNote: string;
  };
  settings: {
    title: string;
    appearance: string;
    darkMode: string;
    language: string;
    spanish: string;
    english: string;
    support: string;
    contactSupport: string;
    profile: string;
    preferences: string;
  };
  placeholder: {
    underConstruction: string;
    continueMessage: string;
  };
}

const translations: Record<Language, Translations> = {
  es: {
    common: {
      welcome: "Bienvenido",
      backToDashboard: "Regresar al Panel",
      loading: "Cargando",
      search: "Buscar",
      settings: "Configuración",
      logout: "Cerrar Sesión",
      save: "Guardar",
      cancel: "Cancelar",
      close: "Cerrar",
      edit: "Editar",
      delete: "Eliminar",
      add: "Agregar",
      view: "Ver",
    },
    auth: {
      login: "Iniciar Sesión",
      password: "Contraseña",
      rememberMe: "Recordarme",
      forgotPassword: "¿Olvidaste tu contraseña?",
      enterSystem: "Ingresar al Sistema",
      recoverPassword: "Recuperar Contraseña",
      contactSupport: "Contactar Soporte",
      loginProblems: "¿Problemas para iniciar sesión?",
      studentId: "Matrícula",
      enterCredentials:
        "Ingresa tus credenciales para acceder al sistema académico",
    },
    dashboard: {
      welcome: "Bienvenido, Estudiante",
      academicSummary:
        "Aquí tienes un resumen de tu información académica actual",
      studentInfo: "Información del Estudiante",
      studentId: "Matrícula",
      career: "Carrera",
      semester: "Semestre",
      studyArea: "Área de Estudio",
      quickActions: "Acciones Rápidas",
      totalSubjects: "Materias Totales",
      currentGPA: "Promedio Actual",
      completedCredits: "Créditos Completados",
      attendanceRate: "Porcentaje de Asistencia",
    },
    sections: {
      subjects: "Materias",
      subjectsDesc: "Consulta tus materias, horarios y profesores asignados",
      downloads: "Descargas/Documentos",
      downloadsDesc: "Descarga boletas, constancias y documentos oficiales",
      detInscription: "Inscripción DET / AF",
      detInscriptionDesc:
        "Inscríbete a talleres DET y actividades de formación",
      schoolCalendar: "Calendario Escolar",
      schoolCalendarDesc: "Consulta fechas importantes y eventos académicos",
      intersemestralReg: "Regularización Intersemestral",
      intersemestralRegDesc: "Solicita regularización entre semestres",
      semestralReg: "Regularización Semestral",
      semestralRegDesc: "Solicita regularización del semestre actual",
      extraordinary: "Extraordinario",
      extraordinaryDesc: "Programa y consulta exámenes extraordinarios",
      chooseStudyArea: "Elegir Área de Estudios",
      chooseStudyAreaDesc: "Selecciona tu especialización académica",
      inscription: "Inscripción",
      inscriptionDesc: "Realiza tu inscripción al siguiente semestre",
      reinscription: "Reinscripción",
      reinscriptionDesc: "Confirma tu reinscripción semestral",
      admission: "Admisión",
      admissionDesc: "Consulta el estado de tu proceso de admisión",
      systemManual: "Manual del Sistema",
      systemManualDesc: "Consulta la guía completa de uso del sistema SIGEA",
    },
    manual: {
      title: "Manual del Usuario - Estudiantes",
      subtitle:
        "Guía completa del Sistema Integral de Gestión Estudiantil y Académica",
      contents: "Contenido",
      gettingStarted: "Primeros Pasos",
      accessInstructions: "Instrucciones de Acceso",
      frequentlyAsked: "Preguntas Frecuentes",
      importantNotes: "Notas Importantes",
      sessionTime: "El tiempo de sesión es de 30 minutos de inactividad.",
      recoverPassword: "Recuperar Contraseña",
      systemAccess: "Acceso al Sistema",
      troubleshooting: "Solución de Problemas",
      important: "Importante",
      underConstruction:
        "Esta sección está en construcción. Continúa desarrollando el contenido específico para esta página.",
      // Contenido específico para estudiantes
      admissionIntro:
        "Para iniciar ser parte de la comunidad, como primera estancia se inicia el proceso de solicitud de admisión. Puedes ingresar al siguiente enlace para iniciar:",
      systemIntro:
        "Los alumnos podrán ingresar al sistema mediante el siguiente enlace:",
      accessInfo:
        "Para poder acceder al sistema, el alumno tendrá que contar con correo institucional y los aspirantes deberán ingresar con su CURP y contraseña que registraron en la ficha de admisión.",
      accountNote:
        "La cuenta será la misma con la que el alumno ingresa a Outlook (correo institucional), Moodle (plataforma virtual) y SIGEA (sistema escolar).",
      systemFeatures:
        "Dentro del SIGEA el alumno podrá visualizar su estado durante su trayectoria escolar, así como las solicitudes, calificaciones, calendario, horarios, etc...",
      chromeRecommendation:
        "Usar Google Chrome como navegador. De preferencia utilizar una computadora o laptop para visualizar el sistema correctamente.",
      faq1Question: "¿Qué hago si olvidé mi contraseña?",
      faq1Answer:
        'Para poder recuperar contraseña el alumno deberá ingresar su correo institucional y dando clic en "recuperar contraseña", deberá de llegar un correo al correo institucional con la contraseña.',
      faq2Question:
        "¿Qué hago si no puedo ver visualizar los apartados del sistema?",
      faq2Answer:
        "Se debe de verificar si está entrando en la página correspondiente. Si ya eres alumno, NO ingresar con la CURP ya que no permitirá ver los apartados correspondientes.",
      faq3Question: "¿Qué pasa si no puedo entrar al sistema?",
      faq3Answer:
        "Como primer paso verifica si está correctamente escrito el correo y la contraseña, vuelve a cargar la pantalla ya que en muchos casos el internet está lento e intenta iniciar sesión unos minutos después.",
      useInstitutionalEmail:
        "Por favor usa tu correo institucional y contraseña si ya cuentas con ellos",
      institutionalEmailLabel:
        "Correo institucional (alumnos) o CURP (aspirantes):",
      admissionFormInfo:
        "Se te desplegará un pequeño formulario que se debe llenar de acuerdo con la solicitud. Debe de ser llenado con los datos personales y a que estudios está solicitando.",
      admissionImportantNote:
        "Para poder continuar con el trámite de admisión debes de tener siempre a la mano CURP y contraseña, ya que estos últimos te permitirán ingresar al sistema escolar (SIGEA) para poder revisar el estatus de admisión.",
    },
    settings: {
      title: "Configuración",
      appearance: "Apariencia",
      darkMode: "Modo Oscuro",
      language: "Idioma",
      spanish: "Español",
      english: "English",
      support: "Soporte",
      contactSupport: "Contactar Soporte",
      profile: "Perfil",
      preferences: "Preferencias",
    },
    placeholder: {
      underConstruction: "Esta sección está en construcción.",
      continueMessage:
        "Continúa desarrollando el contenido específico para esta página.",
    },
  },
  en: {
    common: {
      welcome: "Welcome",
      backToDashboard: "Back to Dashboard",
      loading: "Loading",
      search: "Search",
      settings: "Settings",
      logout: "Logout",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      edit: "Edit",
      delete: "Delete",
      add: "Add",
      view: "View",
    },
    auth: {
      login: "Login",
      password: "Password",
      rememberMe: "Remember Me",
      forgotPassword: "Forgot your password?",
      enterSystem: "Enter System",
      recoverPassword: "Recover Password",
      contactSupport: "Contact Support",
      loginProblems: "Login problems?",
      studentId: "Student ID",
      enterCredentials: "Enter your credentials to access the academic system",
    },
    dashboard: {
      welcome: "Welcome, Student",
      academicSummary: "Here's a summary of your current academic information",
      studentInfo: "Student Information",
      studentId: "Student ID",
      career: "Career",
      semester: "Semester",
      studyArea: "Study Area",
      quickActions: "Quick Actions",
      totalSubjects: "Total Subjects",
      currentGPA: "Current GPA",
      completedCredits: "Completed Credits",
      attendanceRate: "Attendance Rate",
    },
    sections: {
      subjects: "Subjects",
      subjectsDesc: "View your subjects, schedules and assigned teachers",
      downloads: "Downloads/Documents",
      downloadsDesc:
        "Download report cards, certificates and official documents",
      detInscription: "DET / AF Registration",
      detInscriptionDesc: "Register for DET workshops and training activities",
      schoolCalendar: "School Calendar",
      schoolCalendarDesc: "Check important dates and academic events",
      intersemestralReg: "Intersemestral Regularization",
      intersemestralRegDesc: "Request regularization between semesters",
      semestralReg: "Semestral Regularization",
      semestralRegDesc: "Request regularization for current semester",
      extraordinary: "Extraordinary",
      extraordinaryDesc: "Schedule and check extraordinary exams",
      chooseStudyArea: "Choose Study Area",
      chooseStudyAreaDesc: "Select your academic specialization",
      inscription: "Registration",
      inscriptionDesc: "Complete your registration for next semester",
      reinscription: "Re-registration",
      reinscriptionDesc: "Confirm your semester re-registration",
      admission: "Admission",
      admissionDesc: "Check the status of your admission process",
      systemManual: "System Manual",
      systemManualDesc: "Check the complete SIGEA system usage guide",
    },
    manual: {
      title: "User Manual - Students",
      subtitle:
        "Complete Guide to the Integrated Student and Academic Management System",
      contents: "Contents",
      gettingStarted: "Getting Started",
      accessInstructions: "Access Instructions",
      frequentlyAsked: "Frequently Asked Questions",
      importantNotes: "Important Notes",
      sessionTime: "Session time is 30 minutes of inactivity.",
      recoverPassword: "Recover Password",
      systemAccess: "System Access",
      troubleshooting: "Troubleshooting",
      important: "Important",
      underConstruction:
        "This section is under construction. Continue developing the specific content for this page.",
      // Student-specific content
      admissionIntro:
        "To begin being part of the community, the first step is to start the admission application process. You can access the following link to start:",
      systemIntro: "Students can access the system through the following link:",
      accessInfo:
        "To access the system, students must have an institutional email and applicants must enter with their CURP and password that they registered in the admission form.",
      accountNote:
        "The account will be the same one that students use to access Outlook (institutional email), Moodle (virtual platform) and SIGEA (school system).",
      systemFeatures:
        "Within SIGEA, students can view their status during their academic journey, as well as applications, grades, calendar, schedules, etc...",
      chromeRecommendation:
        "Use Google Chrome as your browser. Preferably use a computer or laptop to view the system correctly.",
      faq1Question: "What do I do if I forgot my password?",
      faq1Answer:
        'To recover your password, the student must enter their institutional email and click "recover password", an email should arrive at the institutional email with the password.',
      faq2Question: "What do I do if I cannot see the system sections?",
      faq2Answer:
        "You should verify that you are entering the correct page. If you are already a student, DO NOT log in with your CURP as it will not allow you to see the corresponding sections.",
      faq3Question: "What happens if I can't enter the system?",
      faq3Answer:
        "As a first step, verify that the email and password are correctly written, reload the screen as in many cases the internet is slow and try to log in a few minutes later.",
      useInstitutionalEmail:
        "Please use your institutional email and password if you already have them",
      institutionalEmailLabel:
        "Institutional email (students) or CURP (applicants):",
      admissionFormInfo:
        "A small form will be displayed that must be filled out according to the application. It must be completed with personal information and which studies you are applying for.",
      admissionImportantNote:
        "To continue with the admission process, you must always have your CURP and password at hand, as these will allow you to access the school system (SIGEA) to check your admission status.",
    },
    settings: {
      title: "Settings",
      appearance: "Appearance",
      darkMode: "Dark Mode",
      language: "Language",
      spanish: "Español",
      english: "English",
      support: "Support",
      contactSupport: "Contact Support",
      profile: "Profile",
      preferences: "Preferences",
    },
    placeholder: {
      underConstruction: "This section is under construction.",
      continueMessage:
        "Continue developing the specific content for this page.",
    },
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Verificar si el idioma está almacenado en localStorage
    const stored = localStorage.getItem("sigea-language");
    return (stored as Language) || "es";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("sigea-language", lang);
  };

  const t = translations[language];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n debe ser usado dentro de un I18nProvider");
  }
  return context;
}
