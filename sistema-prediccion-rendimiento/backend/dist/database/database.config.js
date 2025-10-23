"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const usuario_entity_1 = require("../entities/usuario.entity");
const estudiante_entity_1 = require("../entities/estudiante.entity");
const asignatura_entity_1 = require("../entities/asignatura.entity");
const inscripcion_entity_1 = require("../entities/inscripcion.entity");
const calificacion_entity_1 = require("../entities/calificacion.entity");
const asistencia_entity_1 = require("../entities/asistencia.entity");
const habito_estudio_entity_1 = require("../entities/habito-estudio.entity");
const prediccion_riesgo_entity_1 = require("../entities/prediccion-riesgo.entity");
exports.databaseConfig = {
    type: 'sqlite',
    database: 'database/academic_prediction.db',
    entities: [
        usuario_entity_1.Usuario,
        estudiante_entity_1.Estudiante,
        asignatura_entity_1.Asignatura,
        inscripcion_entity_1.Inscripcion,
        calificacion_entity_1.Calificacion,
        asistencia_entity_1.Asistencia,
        habito_estudio_entity_1.HabitoEstudio,
        prediccion_riesgo_entity_1.PrediccionRiesgo,
    ],
    synchronize: true,
    logging: true,
    migrations: ['dist/migrations/*.js'],
    migrationsRun: false,
};
//# sourceMappingURL=database.config.js.map