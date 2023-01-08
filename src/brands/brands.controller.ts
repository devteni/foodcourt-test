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
  Request,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import paginator from 'src/utils/paginator';
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

    const pointers = paginator.pageUrls(pageNumber, limit, addonCount, baseUrl);

    console.log(baseUrl);

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
