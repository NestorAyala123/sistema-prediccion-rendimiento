"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstudiantesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const estudiantes_controller_1 = require(".//estudiantes.controller");
const estudiantes_service_1 = require("./estudiantes.service");
const estudiante_schema_1 = require("../../schemas/estudiante.schema");
let EstudiantesModule = class EstudiantesModule {
};
exports.EstudiantesModule = EstudiantesModule;
exports.EstudiantesModule = EstudiantesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: estudiante_schema_1.Estudiante.name, schema: estudiante_schema_1.EstudianteSchema }])],
        controllers: [estudiantes_controller_1.EstudiantesController],
        providers: [estudiantes_service_1.EstudiantesService],
        exports: [estudiantes_service_1.EstudiantesService],
    })
], EstudiantesModule);
//# sourceMappingURL=estudiantes.module.js.map