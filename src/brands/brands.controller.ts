import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { CreateBrandMealAddonDto } from './dto/create-meal-addon.dto';
import { CreateMealCategory } from './dto/create-meal-category.dto';
import { UpdateMealAddonDto } from './dto/update-meal-addon.dto';

@Controller('brands')
@UseGuards(JwtAuthGuard)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @Roles(Role.Admin)
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Post(':brandId/addons')
  createBrandMealAddon(
    @Param('brandId') brandId: string,
    @Body() MealAddonDto: CreateBrandMealAddonDto,
  ) {
    return this.brandsService.createMealAddon(+brandId, MealAddonDto);
  }

  @Get(':brandId/addons')
  findAllBrandMealAddons(@Param('brandId') brandId: string) {
    return this.brandsService.findAllBrandMeals(+brandId);
  }

  @Get(':brandId/addons/:addonId')
  findOneBrandMealAddon(
    @Param('brandId') brandId: string,
    @Param('addonId') addonId: string,
  ) {
    return this.brandsService.findOneBrandMeal(+brandId);
  }

  @Patch(':brandId/addons/:addonId')
  update(
    @Param('brandId') brandId: string,
    @Param('addonId') addonId: string,
    @Body() updateBrandDto: UpdateMealAddonDto,
  ) {
    return this.brandsService.updateBrandMeal(+brandId, updateBrandDto);
  }

  @Delete(':brandId/addons/:addonId')
  remove(@Param('brandId') id: string, @Param('addonId') addonId: string) {
    return this.brandsService.removeBrandMeal(+id);
  }

  @Post(':brandId/addon-categories')
  createBrandMealCategory(
    @Param('brandId') brandId: string,
    @Body() mealCategory: CreateMealCategory,
  ) {
    return this.brandsService.createMealCategory(+brandId, mealCategory.name);
  }
}
