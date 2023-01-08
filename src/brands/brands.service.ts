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
    return 'Addon created';
  }

  findAllBrandMeals(brandId: number) {
    return `This action returns all brands`;
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
