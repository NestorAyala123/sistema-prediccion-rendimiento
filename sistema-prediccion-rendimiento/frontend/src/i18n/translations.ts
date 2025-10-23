export const translations = {
  es: {
    // Navbar
    help: 'Ayuda',
    logout: 'Cerrar sesión',
    language: 'Idioma',
    darkMode: 'Modo oscuro',

    // Sidebar
    dashboard: 'Panel',
    students: 'Estudiantes',
    predictions: 'Predicciones',
    reports: 'Reportes',
    settings: 'Configuración',

    // Footer
    footer:
      '© 2025 Sistema de Predicción de Rendimiento. Todos los derechos reservados.',

    // Estudiantes
    addStudent: 'Agregar estudiante',
    editStudent: 'Editar estudiante',
    deleteStudent: 'Eliminar estudiante',
    name: 'Nombre',
    email: 'Correo',
    phone: 'Teléfono',
    actions: 'Acciones',
    averageGrade: 'Promedio de notas',
    attendancePercentage: 'Porcentaje de asistencia',
    semester: 'Semestre',
    riskLevel: 'Nivel de riesgo',

    // Predicciones
    addPrediction: 'Agregar nueva predicción',
    exportData: 'Exportar datos',
    viewReports: 'Ver reportes',
    studentId: 'ID de estudiante',
    generatePrediction: 'Generar predicción',
    selectStudent: 'Seleccionar estudiante',
    viewDetails: 'Ver detalles',
    generateReport: 'Generar reporte',
    recalculate: 'Recalcular',
    allLevels: 'Todos los niveles',
    highRisk: 'Riesgo Alto',
    mediumRisk: 'Riesgo Medio',
    lowRisk: 'Riesgo Bajo',
    alto: 'Alto',
    medio: 'Medio',
    bajo: 'Bajo',
    critico: 'Crítico',
    keyFactors: 'Factores clave',
    managementStudents: 'Gestión de estudiantes',
    riskAnalysis: 'Análisis de riesgo académico',
    generatedPredictions: 'Predicciones generadas',
    studentManagement: 'Gestión de estudiantes',
    academicData: 'Gestionar datos académicos',
    searchStudents: 'Buscar estudiantes...',
    noStudentsFound: 'No se encontraron estudiantes',
    noPredictionsFound: 'No se encontraron predicciones',

    // General
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
  },
  en: {
    // Navbar
    help: 'Help',
    logout: 'Logout',
    language: 'Language',
    darkMode: 'Dark Mode',

    // Sidebar
    dashboard: 'Dashboard',
    students: 'Students',
    predictions: 'Predictions',
    reports: 'Reports',
    settings: 'Settings',

    // Footer
    footer: '© 2025 Prediction System. All rights reserved.',

    // Estudiantes
    addStudent: 'Add student',
    editStudent: 'Edit student',
    deleteStudent: 'Delete student',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    actions: 'Actions',
    averageGrade: 'Average Grade',
    attendancePercentage: 'Attendance Percentage',
    semester: 'Semester',
    riskLevel: 'Risk level',

    // Predicciones
    addPrediction: 'Add new prediction',
    exportData: 'Export data',
    viewReports: 'View reports',
    studentId: 'Student ID',
    generatePrediction: 'Generate prediction',
    selectStudent: 'Select student',
    viewDetails: 'View details',
    generateReport: 'Generate report',
    recalculate: 'Recalculate',
    allLevels: 'All levels',
    highRisk: 'High Risk',
    mediumRisk: 'Medium Risk',
    lowRisk: 'Low Risk',
    alto: 'High',
    medio: 'Medium',
    bajo: 'Low',
    critico: 'Critical',
    keyFactors: 'Key factors',
    managementStudents: 'Student Management',
    riskAnalysis: 'Academic risk analysis',
    generatedPredictions: 'Generated predictions',
    studentManagement: 'Student Management',
    academicData: 'Manage students and academic data',
    searchStudents: 'Search students...',
    noStudentsFound: 'No students found',
    noPredictionsFound: 'No predictions found',

    // General
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
  },
};

export type TranslationKey = keyof typeof translations.es;
