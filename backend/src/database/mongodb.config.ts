// Configuración MongoDB para NestJS
export const mongoConfig = {
  // URI de conexión a MongoDB
  // En desarrollo: mongodb://localhost:27017/academic_prediction
  // En producción: usar MongoDB Atlas o servidor remoto
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/academic_prediction',
  
  // Opciones de conexión
  options: {
    retryWrites: true,
    w: 'majority' as const,
  },
};

// Configuración para diferentes entornos
export const getMongoConfig = (env: string = 'development') => {
  switch (env) {
    case 'production':
      return {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/academic_prediction_prod',
        options: {
          retryWrites: true,
          w: 'majority' as const,
          maxPoolSize: 10,
          minPoolSize: 2,
        },
      };
    case 'test':
      return {
        uri: process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/academic_prediction_test',
        options: {
          retryWrites: true,
          w: 'majority' as const,
        },
      };
    default: // development
      return mongoConfig;
  }
};
