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
exports.Asistencia = void 0;
const typeorm_1 = require("typeorm");
const inscripcion_entity_1 = require("./inscripcion.entity");
let Asistencia = class Asistencia {
};
exports.Asistencia = Asistencia;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], Asistencia.prototype, "id_asistencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 36, nullable: false }),
    __metadata("design:type", String)
], Asistencia.prototype, "id_inscripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: false }),
    __metadata("design:type", Date)
], Asistencia.prototype, "fecha_clase", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        nullable: false,
        default: 'Presente'
    }),
    __metadata("design:type", String)
], Asistencia.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Asistencia.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Asistencia.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => inscripcion_entity_1.Inscripcion, inscripcion => inscripcion.asistencias),
    (0, typeorm_1.JoinColumn)({ name: 'id_inscripcion' }),
    __metadata("design:type", inscripcion_entity_1.Inscripcion)
], Asistencia.prototype, "inscripcion", void 0);
exports.Asistencia = Asistencia = __decorate([
    (0, typeorm_1.Entity)('asistencias')
], Asistencia);
//# sourceMappingURL=asistencia.entity.js.map