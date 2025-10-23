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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrediccionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const prediccion_riesgo_entity_1 = require("../../entities/prediccion-riesgo.entity");
const estudiante_entity_1 = require("../../entities/estudiante.entity");
const uuid_1 = require("uuid");
let PrediccionesService = class PrediccionesService {
    constructor(predRepo, estRepo) {
        this.predRepo = predRepo;
        this.estRepo = estRepo;
    }
    async findAll() {
        return await this.predRepo.find({
            relations: ['estudiante'],
            order: { fecha_prediccion: 'DESC' },
        });
    }
    async generateForStudent(id_estudiante) {
        const estudiante = await this.estRepo.findOne({ where: { id_estudiante } });
        if (!estudiante) {
            throw new common_1.NotFoundException(`Estudiante con ID ${id_estudiante} no encontrado`);
        }
        let nivel_riesgo = 'Medio';
        let factores_clave = '';
        const factores = [];
        if (estudiante.promedio_notas !== null &&
            estudiante.promedio_notas !== undefined) {
            if (estudiante.promedio_notas >= 80) {
                factores.push('Desempeño académico excelente (Notas: ' +
                    estudiante.promedio_notas +
                    '%)');
            }
            else if (estudiante.promedio_notas >= 70) {
                factores.push('Desempeño académico bueno (Notas: ' +
                    estudiante.promedio_notas +
                    '%)');
            }
            else if (estudiante.promedio_notas >= 60) {
                factores.push('Desempeño académico aceptable (Notas: ' +
                    estudiante.promedio_notas +
                    '%)');
            }
            else if (estudiante.promedio_notas >= 50) {
                factores.push('Desempeño académico deficiente (Notas: ' +
                    estudiante.promedio_notas +
                    '%)');
            }
            else {
                factores.push('Desempeño académico crítico (Notas: ' +
                    estudiante.promedio_notas +
                    '%)');
            }
        }
        if (estudiante.porcentaje_asistencia !== null &&
            estudiante.porcentaje_asistencia !== undefined) {
            if (estudiante.porcentaje_asistencia >= 90) {
                factores.push('Asistencia excelente (' + estudiante.porcentaje_asistencia + '%)');
            }
            else if (estudiante.porcentaje_asistencia >= 80) {
                factores.push('Asistencia buena (' + estudiante.porcentaje_asistencia + '%)');
            }
            else if (estudiante.porcentaje_asistencia >= 70) {
                factores.push('Asistencia aceptable (' + estudiante.porcentaje_asistencia + '%)');
            }
            else if (estudiante.porcentaje_asistencia >= 60) {
                factores.push('Asistencia baja (' + estudiante.porcentaje_asistencia + '%)');
            }
            else {
                factores.push('Asistencia muy baja (' + estudiante.porcentaje_asistencia + '%)');
            }
        }
        if (estudiante.promedio_notas !== null &&
            estudiante.promedio_notas !== undefined &&
            estudiante.porcentaje_asistencia !== null &&
            estudiante.porcentaje_asistencia !== undefined) {
            const promedio = estudiante.promedio_notas;
            const asistencia = estudiante.porcentaje_asistencia;
            if (promedio < 50 || asistencia < 60) {
                nivel_riesgo = 'Alto';
            }
            else if (promedio < 60 || asistencia < 70) {
                nivel_riesgo = 'Medio';
            }
            else if (promedio >= 80 && asistencia >= 90) {
                nivel_riesgo = 'Bajo';
            }
            else if (promedio >= 70 && asistencia >= 80) {
                nivel_riesgo = 'Bajo';
            }
            else {
                nivel_riesgo = 'Medio';
            }
        }
        factores_clave =
            factores.length > 0 ? factores.join('; ') : 'Sin datos suficientes';
        const nueva = {
            id_prediccion: (0, uuid_1.v4)(),
            id_estudiante,
            nivel_riesgo,
            factores_clave,
            estado_prediccion: 'Completado',
        };
        const created = this.predRepo.create(nueva);
        return await this.predRepo.save(created);
    }
    async getReportPdf(id_prediccion) {
        const pred = await this.predRepo.findOne({
            where: { id_prediccion },
            relations: ['estudiante'],
        });
        if (!pred)
            return null;
        const content = `Reporte de Predicción\nID: ${pred.id_prediccion}\nEstudiante: ${pred.estudiante?.nombres || ''} ${pred.estudiante?.apellidos || ''}\nNivel de riesgo: ${pred.nivel_riesgo}\nFactores: ${pred.factores_clave}`;
        const buffer = Buffer.from(content, 'utf-8');
        return buffer;
    }
    async delete(id_prediccion) {
        const prediccion = await this.predRepo.findOne({
            where: { id_prediccion },
        });
        if (!prediccion) {
            throw new common_1.NotFoundException(`Predicción con ID ${id_prediccion} no encontrada`);
        }
        await this.predRepo.remove(prediccion);
    }
};
exports.PrediccionesService = PrediccionesService;
exports.PrediccionesService = PrediccionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(prediccion_riesgo_entity_1.PrediccionRiesgo)),
    __param(1, (0, typeorm_1.InjectRepository)(estudiante_entity_1.Estudiante)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PrediccionesService);
//# sourceMappingURL=predicciones.service.js.map