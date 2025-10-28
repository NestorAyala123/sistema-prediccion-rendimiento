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
exports.SoporteController = void 0;
const common_1 = require("@nestjs/common");
const soporte_service_1 = require("./soporte.service");
const create_soporte_dto_1 = require("./dto/create-soporte.dto");
let SoporteController = class SoporteController {
    constructor(soporteService) {
        this.soporteService = soporteService;
    }
    async create(dto) {
        const created = await this.soporteService.create(dto);
        return { success: true, data: created };
    }
    async findAll() {
        const list = await this.soporteService.findAll();
        return { success: true, data: list };
    }
};
exports.SoporteController = SoporteController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_soporte_dto_1.CreateSoporteDto]),
    __metadata("design:returntype", Promise)
], SoporteController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SoporteController.prototype, "findAll", null);
exports.SoporteController = SoporteController = __decorate([
    (0, common_1.Controller)('soporte'),
    __metadata("design:paramtypes", [soporte_service_1.SoporteService])
], SoporteController);
//# sourceMappingURL=soporte.controller.js.map