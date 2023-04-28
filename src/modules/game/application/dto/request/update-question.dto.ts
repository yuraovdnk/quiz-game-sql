import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @MinLength(10)
  body: string;
  @ArrayNotEmpty()
  correctAnswers: string[];
}
