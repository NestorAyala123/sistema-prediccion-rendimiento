"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongodb_config_1 = require("./database/mongodb.config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const estudiantes_module_1 = require("./modules/estudiantes/estudiantes.module");
const auth_module_1 = require("./auth/auth.module");
const soporte_module_1 = require("./modules/soporte/soporte.module");
const predicciones_module_1 = require("./modules/predicciones/predicciones.module");
const calificaciones_module_1 = require("./modules/calificaciones/calificaciones.module");
const asignaturas_module_1 = require("./modules/asignaturas/asignaturas.module");
const inscripciones_module_1 = require("./modules/inscripciones/inscripciones.module");
const asistencias_module_1 = require("./modules/asistencias/asistencias.module");
const auditoria_module_1 = require("./modules/auditoria/auditoria.module");
const notificaciones_module_1 = require("./modules/notificaciones/notificaciones.module");
const events_module_1 = require("./events/events.module");
const usuario_schema_1 = require("./schemas/usuario.schema");
const estudiante_schema_1 = require("./schemas/estudiante.schema");
const asignatura_schema_1 = require("./schemas/asignatura.schema");
const inscripcion_schema_1 = require("./schemas/inscripcion.schema");
const calificacion_schema_1 = require("./schemas/calificacion.schema");
const asistencia_schema_1 = require("./schemas/asistencia.schema");
const habito_estudio_schema_1 = require("./schemas/habito-estudio.schema");
const prediccion_riesgo_schema_1 = require("./schemas/prediccion-riesgo.schema");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(mongodb_config_1.mongoConfig.uri, mongodb_config_1.mongoConfig.options),
            mongoose_1.MongooseModule.forFeature([
                { name: usuario_schema_1.Usuario.name, schema: usuario_schema_1.UsuarioSchema },
                { name: estudiante_schema_1.Estudiante.name, schema: estudiante_schema_1.EstudianteSchema },
                { name: asignatura_schema_1.Asignatura.name, schema: asignatura_schema_1.AsignaturaSchema },
                { name: inscripcion_schema_1.Inscripcion.name, schema: inscripcion_schema_1.InscripcionSchema },
                { name: calificacion_schema_1.Calificacion.name, schema: calificacion_schema_1.CalificacionSchema },
                { name: asistencia_schema_1.Asistencia.name, schema: asistencia_schema_1.AsistenciaSchema },
                { name: habito_estudio_schema_1.HabitoEstudio.name, schema: habito_estudio_schema_1.HabitoEstudioSchema },
                { name: prediccion_riesgo_schema_1.PrediccionRiesgo.name, schema: prediccion_riesgo_schema_1.PrediccionRiesgoSchema },
            ]),
            auth_module_1.AuthModule,
            estudiantes_module_1.EstudiantesModule,
            asignaturas_module_1.AsignaturasModule,
            inscripciones_module_1.InscripcionesModule,
            calificaciones_module_1.CalificacionesModule,
            asistencias_module_1.AsistenciasModule,
            predicciones_module_1.PrediccionesModule,
            soporte_module_1.SoporteModule,
            auditoria_module_1.AuditoriaModule,
            notificaciones_module_1.NotificacionesModule,
            events_module_1.EventsModule,
            auditoria_module_1.AuditoriaModule,
            notificaciones_module_1.NotificacionesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map