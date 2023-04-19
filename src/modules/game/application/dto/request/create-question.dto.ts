import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @MinLength(10)
  body: string;
  correctAnswers: string[];
}
