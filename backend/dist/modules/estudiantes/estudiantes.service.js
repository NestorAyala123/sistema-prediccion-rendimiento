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
exports.EstudiantesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const estudiante_schema_1 = require("../../schemas/estudiante.schema");
let EstudiantesService = class EstudiantesService {
    constructor(estudiantesModel) {
        this.estudiantesModel = estudiantesModel;
    }
    async findAll() {
        return await this.estudiantesModel
            .find()
            .sort({ apellidos: 1, nombres: 1 })
            .exec();
    }
    async findOne(id) {
        const estudiante = await this.estudiantesModel
            .findOne({ id_estudiante: id })
            .exec();
        if (!estudiante) {
            throw new common_1.NotFoundException(`Estudiante con ID ${id} no encontrado`);
        }
        return estudiante;
    }
    async create(createEstudianteDto) {
        const estudiante = new this.estudiantesModel(createEstudianteDto);
        return await estudiante.save();
    }
    async update(id, updateEstudianteDto) {
        const estudiante = await this.estudiantesModel
            .findOneAndUpdate({ id_estudiante: id }, { $set: updateEstudianteDto }, { new: true })
            .exec();
        if (!estudiante) {
            throw new common_1.NotFoundException(`Estudiante con ID ${id} no encontrado`);
        }
        return estudiante;
    }
    async remove(id) {
        const result = await this.estudiantesModel
            .findOneAndDelete({ id_estudiante: id })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException(`Estudiante con ID ${id} no encontrado`);
        }
    }
    async search(term) {
        const regex = new RegExp(term, 'i');
        return await this.estudiantesModel
            .find({
            $or: [
                { nombres: regex },
                { apellidos: regex },
                { email: regex },
                { id_estudiante: regex },
            ],
        })
            .sort({ apellidos: 1, nombres: 1 })
            .exec();
    }
};
exports.EstudiantesService = EstudiantesService;
exports.EstudiantesService = EstudiantesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(estudiante_schema_1.Estudiante.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EstudiantesService);
//# sourceMappingURL=estudiantes.service.js.map