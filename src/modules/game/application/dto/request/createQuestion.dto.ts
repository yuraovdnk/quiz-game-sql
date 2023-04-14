import { IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  body: string;
  correctAnswers: [string];
}
