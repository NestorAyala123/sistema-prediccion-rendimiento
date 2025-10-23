"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrediccionesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const predicciones_controller_1 = require("./predicciones.controller");
const predicciones_service_1 = require("./predicciones.service");
const prediccion_riesgo_entity_1 = require("../../entities/prediccion-riesgo.entity");
const estudiante_entity_1 = require("../../entities/estudiante.entity");
let PrediccionesModule = class PrediccionesModule {
};
exports.PrediccionesModule = PrediccionesModule;
exports.PrediccionesModule = PrediccionesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([prediccion_riesgo_entity_1.PrediccionRiesgo, estudiante_entity_1.Estudiante])],
        controllers: [predicciones_controller_1.PrediccionesController],
        providers: [predicciones_service_1.PrediccionesService],
        exports: [predicciones_service_1.PrediccionesService],
    })
], PrediccionesModule);
//# sourceMappingURL=predicciones.module.js.map