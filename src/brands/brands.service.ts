import { BadRequestException, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { CreateBrandDto } from './dto/create-brand.dto';
import { CreateBrandMealAddonDto } from './dto/create-meal-addon.dto';
import { UpdateMealAddonDto } from './dto/update-meal-addon.dto';

@Injectable()
export class BrandsService {
  constructor(@InjectModel() private readonly knex: Knex) {}
  async create(createBrandDto: CreateBrandDto) {
    const existingBrand = await this.knex
      .table('brands')
      .where('name', createBrandDto.name)
      .first();

    if (existingBrand) {
      throw new BadRequestException('Brand already exists.');
    }

    const brand = await this.knex
      .table('brands')
      .returning('*')
      .insert(createBrandDto);

    return { message: 'Brand registered successfully', data: brand[0] };
  }

  async createMealAddon(brandId: number, payload: CreateBrandMealAddonDto) {
    const existingMeal = await this.knex
      .table('meal_addons')
      .where('name', payload.name)
      .andWhere('brand_id', brandId)
      .first();

    if (existingMeal) {
      throw new BadRequestException(
        'Meal Addon already exists for this brand.',
      );
    }

    const addon = await this.knex
      .table('meal_addons')
      .returning('*')
      .insert({ ...payload, brand_id: brandId });

    return { message: 'Addon created successfully', data: addon[0] };
  }

  async findAllBrandMeals(brandId: number, limit = 5, offset = 0) {
    // check if brand exists
    const existingBrand = await this.knex
      .table('brands')
      .where('id', brandId)
      .first();

    if (!existingBrand) {
      throw new BadRequestException('Brand does not exist.');
    }

    // retrieve a paginated list of all brands meal addons
    const query = this.knex.table('meal_addons').where('brand_id', brandId);
    const addons = await query.limit(limit).offset(offset);
    const addonCount = (await query.count())[0]['count'];

    return { addons, addonCount };
  }

  findOneBrandMeal(id: number) {
    return `This action returns a #${id} brand`;
  }

  updateBrandMeal(id: number, updateMealDto: UpdateMealAddonDto) {
    return `This action updates a #${id} brand`;
  }

  removeBrandMeal(id: number) {
    return `This action removes a #${id} brand`;
  }

  createMealCategory(brandId: number, categoryName: string) {
    return 'Category created';
  }
}
