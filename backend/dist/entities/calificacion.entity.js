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
exports.Calificacion = void 0;
const typeorm_1 = require("typeorm");
const inscripcion_entity_1 = require("./inscripcion.entity");
let Calificacion = class Calificacion {
};
exports.Calificacion = Calificacion;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], Calificacion.prototype, "id_calificacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 36, nullable: false }),
    __metadata("design:type", String)
], Calificacion.prototype, "id_inscripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], Calificacion.prototype, "tipo_evaluacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Calificacion.prototype, "nota", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Calificacion.prototype, "fecha_registro", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Calificacion.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Calificacion.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inscripcion_entity_1.Inscripcion, inscripcion => inscripcion.calificaciones),
    (0, typeorm_1.JoinColumn)({ name: 'id_inscripcion' }),
    __metadata("design:type", inscripcion_entity_1.Inscripcion)
], Calificacion.prototype, "inscripcion", void 0);
exports.Calificacion = Calificacion = __decorate([
    (0, typeorm_1.Entity)('calificaciones')
], Calificacion);
//# sourceMappingURL=calificacion.entity.js.map