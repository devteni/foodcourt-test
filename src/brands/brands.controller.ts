import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import paginator from 'src/lib/paginator';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { CreateBrandMealAddonDto } from './dto/create-meal-addon.dto';
import { CreateMealCategory } from './dto/create-meal-category.dto';
import { UpdateMealAddonDto } from './dto/update-meal-addon.dto';

@Controller('brands')
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
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
  async findAllBrandMealAddons(
    @Req() req,
    @Param('brandId') brandId: string,
    @Query('size') size: string,
    @Query('page') page: string,
  ) {
    const pageNumber = page !== undefined ? +page : 1;
    const pageSize = size !== undefined ? +size : 5;
    const baseUrl = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;

    const limit = pageSize < 1 || pageSize > 100 ? 5 : pageSize;
    const offset = paginator.offset(pageNumber, pageSize);
    const { addons, addonCount } = await this.brandsService.findAllBrandMeals(
      +brandId,
      limit,
      offset,
    );

    const entriesCount = parseInt(addonCount.toString(), 10);
    const pointers = paginator.pageUrls(
      pageNumber,
      limit,
      entriesCount,
      baseUrl,
    );

    return {
      data: {
        items: addons,
        previous_page: pointers.previous,
        next_page: pointers.next,
        total: addonCount,
      },
    };
  }

  @Get(':brandId/addons/:addonId')
  findOneBrandMealAddon(
    @Param('brandId') brandId: string,
    @Param('addonId') addonId: string,
  ) {
    return this.brandsService.findOneBrandMeal(+brandId, +addonId);
  }

  @Patch(':brandId/addons/:addonId')
  update(
    @Param('brandId') brandId: string,
    @Param('addonId') addonId: string,
    @Body() updateMealDto: UpdateMealAddonDto,
  ) {
    return this.brandsService.updateBrandMeal({
      brandId: +brandId,
      addonId: +addonId,
      updateMealDto,
    });
  }

  @Delete(':brandId/addons/:addonId')
  remove(@Param('brandId') brandId: string, @Param('addonId') addonId: string) {
    return this.brandsService.removeBrandMeal(+brandId, +addonId);
  }

  @Post(':brandId/addon-categories')
  createBrandMealCategory(
    @Param('brandId') brandId: string,
    @Body() mealCategory: CreateMealCategory,
  ) {
    return this.brandsService.createMealCategory(+brandId, mealCategory.name);
  }
}
