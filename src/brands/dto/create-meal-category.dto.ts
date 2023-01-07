import { IsNotEmpty } from 'class-validator';

export class CreateMealCategory {
  @IsNotEmpty()
  readonly name: string;
}
