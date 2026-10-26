import {
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { signUpDTO } from './signUp.dto.js';
import { userGender } from '../../../common/enum/user.base.enum.js';

export class registerGuestAsUserDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsString()
  @IsNotEmpty()
  password!: string;
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  @IsDateString()
  age!: string;
  @IsEnum(userGender)
  gender!: string;
  @IsString()
  phone_number!: string;
}
