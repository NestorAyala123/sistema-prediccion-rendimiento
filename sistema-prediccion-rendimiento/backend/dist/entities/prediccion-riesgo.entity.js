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
exports.PrediccionRiesgo = void 0;
const typeorm_1 = require("typeorm");
const estudiante_entity_1 = require("./estudiante.entity");
let PrediccionRiesgo = class PrediccionRiesgo {
};
exports.PrediccionRiesgo = PrediccionRiesgo;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', length: 36 }),
    __metadata("design:type", String)
], PrediccionRiesgo.prototype, "id_prediccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], PrediccionRiesgo.prototype, "id_estudiante", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], PrediccionRiesgo.prototype, "fecha_prediccion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        nullable: false,
        default: 'Bajo',
    }),
    __metadata("design:type", String)
], PrediccionRiesgo.prototype, "nivel_riesgo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], PrediccionRiesgo.prototype, "factores_clave", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        nullable: false,
        default: 'Calculando',
    }),
    __metadata("design:type", String)
], PrediccionRiesgo.prototype, "estado_prediccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], PrediccionRiesgo.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], PrediccionRiesgo.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => estudiante_entity_1.Estudiante, (estudiante) => estudiante.predicciones_riesgo, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'id_estudiante' }),
    __metadata("design:type", estudiante_entity_1.Estudiante)
], PrediccionRiesgo.prototype, "estudiante", void 0);
exports.PrediccionRiesgo = PrediccionRiesgo = __decorate([
    (0, typeorm_1.Entity)('predicciones_riesgo')
], PrediccionRiesgo);
//# sourceMappingURL=prediccion-riesgo.entity.js.map