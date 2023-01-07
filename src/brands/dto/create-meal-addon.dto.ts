import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateBrandMealAddonDto {
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  readonly description?: string;

  @IsNumber()
  readonly price: number;

  @IsOptional()
  readonly category?: string;
}
