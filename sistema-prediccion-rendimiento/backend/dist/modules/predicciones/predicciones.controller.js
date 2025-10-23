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
exports.PrediccionesController = void 0;
const common_1 = require("@nestjs/common");
const predicciones_service_1 = require("./predicciones.service");
let PrediccionesController = class PrediccionesController {
    constructor(prediccionesService) {
        this.prediccionesService = prediccionesService;
    }
    async findAll() {
        return await this.prediccionesService.findAll();
    }
    async generar(id_estudiante) {
        return await this.prediccionesService.generateForStudent(id_estudiante);
    }
    async getReporte(id, res) {
        const pdfBuffer = await this.prediccionesService.getReportPdf(id);
        if (!pdfBuffer) {
            return res
                .status(common_1.HttpStatus.NOT_FOUND)
                .json({ message: 'Reporte no disponible' });
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte-${id}.pdf`);
        return res.status(common_1.HttpStatus.OK).send(pdfBuffer);
    }
    async delete(id) {
        return await this.prediccionesService.delete(id);
    }
};
exports.PrediccionesController = PrediccionesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrediccionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('generar'),
    __param(0, (0, common_1.Body)('id_estudiante')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrediccionesController.prototype, "generar", null);
__decorate([
    (0, common_1.Get)(':id/reporte'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrediccionesController.prototype, "getReporte", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrediccionesController.prototype, "delete", null);
exports.PrediccionesController = PrediccionesController = __decorate([
    (0, common_1.Controller)('predicciones'),
    __metadata("design:paramtypes", [predicciones_service_1.PrediccionesService])
], PrediccionesController);
//# sourceMappingURL=predicciones.controller.js.map