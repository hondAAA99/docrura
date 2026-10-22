var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { userGender } from '../../../common/enum/user.base.enum.js';
export class signUpDTO {
    name;
    email;
    password;
    phone_number;
    gender;
    age;
}
__decorate([
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], signUpDTO.prototype, "name", void 0);
__decorate([
    IsNotEmpty(),
    IsEmail(),
    __metadata("design:type", String)
], signUpDTO.prototype, "email", void 0);
__decorate([
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], signUpDTO.prototype, "password", void 0);
__decorate([
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], signUpDTO.prototype, "phone_number", void 0);
__decorate([
    IsNotEmpty(),
    IsEnum(userGender),
    __metadata("design:type", String)
], signUpDTO.prototype, "gender", void 0);
__decorate([
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], signUpDTO.prototype, "age", void 0);
//# sourceMappingURL=signUp.dto.js.map