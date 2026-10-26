var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { User } from './user.model.js';
import { userTokenEnum } from '../common/enum/user.base.enum.js';
let revokeToken = class revokeToken {
    id;
    token;
    expiresIn;
    userId;
    user;
    type;
    timestamp;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], revokeToken.prototype, "id", void 0);
__decorate([
    Column('varchar'),
    __metadata("design:type", String)
], revokeToken.prototype, "token", void 0);
__decorate([
    Column('date'),
    __metadata("design:type", Date)
], revokeToken.prototype, "expiresIn", void 0);
__decorate([
    Column('uuid'),
    __metadata("design:type", String)
], revokeToken.prototype, "userId", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.id),
    JoinColumn({ name: 'userId' }),
    __metadata("design:type", User)
], revokeToken.prototype, "user", void 0);
__decorate([
    Column('enum', { enum: userTokenEnum }),
    __metadata("design:type", String)
], revokeToken.prototype, "type", void 0);
__decorate([
    Column('date'),
    __metadata("design:type", Date)
], revokeToken.prototype, "timestamp", void 0);
revokeToken = __decorate([
    Entity('revokeToken')
], revokeToken);
export { revokeToken };
//# sourceMappingURL=revokeToken.model.js.map