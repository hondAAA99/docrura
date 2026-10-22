import { IsNotEmpty, IsString } from 'class-validator';

export class signWithGmailDTO {
  @IsNotEmpty()
  @IsString()
  idToken!: string;
}
