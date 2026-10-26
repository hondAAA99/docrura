import { IsNotEmpty, IsString } from 'class-validator';

export class logoutDTO {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
