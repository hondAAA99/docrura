var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { userGender, userProvider, userRoles, } from '../common/enum/user.base.enum.js';
let User = class User {
    id;
    name;
    email;
    password;
    gender;
    role;
    confirm;
    phone_number;
    age;
    provider;
    credentials;
};
__decorate([
    PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    Column('varchar', { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    Column('varchar', { unique: true, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column('varchar', { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Column('enum', {
        enum: userGender,
        default: userGender.female,
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    Column('enum', {
        enum: userRoles,
        default: userRoles.user,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    Column('boolean', { default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "confirm", void 0);
__decorate([
    Column('varchar', { unique: true, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone_number", void 0);
__decorate([
    Column('varchar', { nullable: true }),
    __metadata("design:type", String)
], User.prototype, "age", void 0);
__decorate([
    Column('enum', { enum: userProvider, default: userProvider.system }),
    __metadata("design:type", String)
], User.prototype, "provider", void 0);
__decorate([
    Column('date', { nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "credentials", void 0);
User = __decorate([
    Entity('users')
], User);
export { User };
//# sourceMappingURL=user.model.js.map