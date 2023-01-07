import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandMealAddonDto } from './create-meal-addon.dto';

export class UpdateMealAddonDto extends PartialType(CreateBrandMealAddonDto) {}
