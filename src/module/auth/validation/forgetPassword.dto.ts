import { IsEmail, IsNotEmpty } from 'class-validator';

export class forgetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
