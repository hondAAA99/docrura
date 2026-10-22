import { IsEmail, IsEnum, IsNotEmpty, IsString, Validate } from 'class-validator';
import { userGender } from '../../../common/enum/user.base.enum.js';



export class signUpDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  @IsNotEmpty()
  @IsString()
  password!: string;
  @IsNotEmpty()
  @IsString()
  phone_number!: string;
  @IsNotEmpty()
  @IsEnum(userGender)
  gender!: string;
  @IsNotEmpty()
  @IsString()
  age!: string;
}
