"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inscripcion = void 0;
const typeorm_1 = require("typeorm");
const estudiante_entity_1 = require("./estudiante.entity");
const asignatura_entity_1 = require("./asignatura.entity");
const calificacion_entity_1 = require("./calificacion.entity");
const asistencia_entity_1 = require("./asistencia.entity");
let Inscripcion = class Inscripcion {
};
exports.Inscripcion = Inscripcion;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], Inscripcion.prototype, "id_inscripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Inscripcion.prototype, "id_estudiante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Inscripcion.prototype, "id_asignatura", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Inscripcion.prototype, "periodo_academico", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Inscripcion.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Inscripcion.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estudiante_entity_1.Estudiante, (estudiante) => estudiante.inscripciones, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'id_estudiante' }),
    __metadata("design:type", estudiante_entity_1.Estudiante)
], Inscripcion.prototype, "estudiante", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => asignatura_entity_1.Asignatura, (asignatura) => asignatura.inscripciones),
    (0, typeorm_1.JoinColumn)({ name: 'id_asignatura' }),
    __metadata("design:type", asignatura_entity_1.Asignatura)
], Inscripcion.prototype, "asignatura", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => calificacion_entity_1.Calificacion, (calificacion) => calificacion.inscripcion),
    __metadata("design:type", Array)
], Inscripcion.prototype, "calificaciones", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => asistencia_entity_1.Asistencia, (asistencia) => asistencia.inscripcion),
    __metadata("design:type", Array)
], Inscripcion.prototype, "asistencias", void 0);
exports.Inscripcion = Inscripcion = __decorate([
    (0, typeorm_1.Entity)('inscripciones')
], Inscripcion);
//# sourceMappingURL=inscripcion.entity.js.map