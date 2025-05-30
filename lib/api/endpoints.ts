export const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  RESEND_VERIFICATION: '/email/verification-notification',
  USER: '/user',
} as const; 

export const API_ENDPOINTS = {
  DASHBOARD: '/dashboard',
  INVOICE: '/invoice',
  INVOICES: '/invoices',
  USERS: '/users',
  CREATE_USER: '/users',
  DELETE_USER: '/users',
  UPDATE_USER: '/users',
  CAMPUSES: '/campuses',
  CREATE_CAMPUS: '/campuses',
  DELETE_CAMPUS: '/campuses',
  UPDATE_CAMPUS: '/campuses',
  STUDENTS: '/students',
  CREATE_STUDENT: '/students',
  STUDENT: '/student',
  UPDATE_STUDENT: '/students',
  DELETE_STUDENT: '/students',
  STUDENTS_BY_COHORT: '/cohorts/:cohortId/students',
  ACTIVE_STUDENTS: '/students/status/active',
  IMPORT_STUDENTS: '/students/import',
  PERIODS: '/periods',
  CREATE_PERIOD: '/periods',
  UPDATE_PERIOD: '/periods',
  DELETE_PERIOD: '/periods',
  CREATE_CHARGE: '/charges',
  GET_CHARGES: '/charges',
  UPDATE_CHARGE: '/charges',
  MUNICIPIOS: '/municipios',
  CREATE_MUNICIPIO: '/municipios',
  UPDATE_MUNICIPIO: '/municipios',
  DELETE_MUNICIPIO: '/municipios',
  PREPAS: '/prepas',
  CREATE_PREPA: '/prepas',
  UPDATE_PREPA: '/prepas',
  DELETE_PREPA: '/prepas',
  FACULTADES: '/facultades',
  CREATE_FACULTAD: '/facultades',
  UPDATE_FACULTAD: '/facultades',
  DELETE_FACULTAD: '/facultades',
  CARREERAS: '/carreras',
  CREATE_CARREERA: '/carreras',
  UPDATE_CARREERA: '/carreras',
  DELETE_CARREERA: '/carreras',
  MODULOS: '/modulos',
  CREATE_MODULO: '/modulos',
  UPDATE_MODULO: '/modulos',
  DELETE_MODULO: '/modulos',
  PROMOS: '/promociones',
  CREATE_PROMO: '/promociones',
  UPDATE_PROMO: '/promociones',
  DELETE_PROMO: '/promociones',
  GRUPOS: '/grupos',
  CREATE_GRUPO: '/grupos',
  UPDATE_GRUPO: '/grupos',
  DELETE_GRUPO: '/grupos',
  GASTOS: '/gastos',
  CREATE_GASTO: '/gastos',
  UPDATE_GASTO: '/gastos',
  DELETE_GASTO: '/gastos',
  PRODUCTOS: '/products',
  CREATE_PRODUCTO: '/products',
  UPDATE_PRODUCTO: '/products',
  DELETE_PRODUCTO: '/products',
  CAJA: '/caja',
  CREATE_CAJA: '/caja',
  UPDATE_CAJA: '/caja',
  DELETE_CAJA: '/caja',
  CURRENT_CAJA: '/caja/current',
  SYNC_STUDENT_MODULES: '/students/sync-modules',
} as const;
