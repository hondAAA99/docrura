import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class confirmEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  @IsString()
  @Length(5, 5)
  @IsNotEmpty()
  otp!: string;
}
