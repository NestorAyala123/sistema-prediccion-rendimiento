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
exports.EstudiantesController = void 0;
const common_1 = require("@nestjs/common");
const estudiantes_service_1 = require("./estudiantes.service");
const create_estudiante_dto_1 = require("./dto/create-estudiante.dto");
const update_estudiante_dto_1 = require("./dto/update-estudiante.dto");
const common_2 = require("@nestjs/common");
let EstudiantesController = class EstudiantesController {
    constructor(estudiantesService) {
        this.estudiantesService = estudiantesService;
    }
    async findAll(search) {
        if (search) {
            return await this.estudiantesService.search(search);
        }
        return await this.estudiantesService.findAll();
    }
    async findOne(id) {
        return await this.estudiantesService.findOne(id);
    }
    async create(createEstudianteDto) {
        try {
            console.log('Datos recibidos:', createEstudianteDto);
            return await this.estudiantesService.create(createEstudianteDto);
        }
        catch (error) {
            console.error('Error al crear estudiante:', error);
            throw error;
        }
    }
    async update(id, updateEstudianteDto) {
        return await this.estudiantesService.update(id, updateEstudianteDto);
    }
    async remove(id) {
        await this.estudiantesService.remove(id);
        return { message: 'Estudiante eliminado exitosamente' };
    }
    async exportCsv(res) {
        const csvBuffer = await this.estudiantesService.exportCSV();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=estudiantes-${new Date().toISOString().split('T')[0]}.csv`);
        return res.send(csvBuffer);
    }
};
exports.EstudiantesController = EstudiantesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstudiantesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstudiantesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_estudiante_dto_1.CreateEstudianteDto]),
    __metadata("design:returntype", Promise)
], EstudiantesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_estudiante_dto_1.UpdateEstudianteDto]),
    __metadata("design:returntype", Promise)
], EstudiantesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EstudiantesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    __param(0, (0, common_2.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EstudiantesController.prototype, "exportCsv", null);
exports.EstudiantesController = EstudiantesController = __decorate([
    (0, common_1.Controller)('estudiantes'),
    __metadata("design:paramtypes", [estudiantes_service_1.EstudiantesService])
], EstudiantesController);
//# sourceMappingURL=estudiantes.controller.js.map