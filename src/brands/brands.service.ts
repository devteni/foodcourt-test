import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Addon, Brand, Category } from 'index';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { CreateBrandDto } from './dto/create-brand.dto';
import { CreateBrandMealAddonDto } from './dto/create-meal-addon.dto';
import { UpdateMealAddonDto } from './dto/update-meal-addon.dto';

@Injectable()
export class BrandsService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async findBrandById(id: number) {
    const brand = await this.knex.table<Brand>('brands').where('id', id).first();

    return brand;
  }

  async findBrandByName(name: string) {
    const brand = await this.knex.table('brands').where('name', name).first();

    return brand;
  }

  async create(createBrandDto: CreateBrandDto) {
    const existingBrand = await this.findBrandByName(createBrandDto.name);

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

    let categoryId: number | null = null;
    let categoryName: string | null = null;

    if (payload.category) {
      // check if category exists
      const existingCategory = await this.knex('meal_categories')
        .where({
          name: payload.category,
          brand_id: brandId,
        })
        .first();

      if (existingCategory) {
        categoryId = existingCategory.id;
        categoryName = existingCategory.name;
      } else {
        const newCategory = await this.knex
          .table('meal_categories')
          .returning('*')
          .insert({ name: payload.category, brand_id: brandId });

        categoryId = newCategory[0]['id'];
        categoryName = newCategory[0]['name'];
      }
    }

    const addon = await this.knex
      .table<Addon>('meal_addons')
      .insert({
        name: payload.name,
        price: payload.price,
        brand_id: brandId,
        category_id: categoryId,
      })
      .returning('*');

    return {
      message: 'Addon created successfully',
      data: { ...addon[0], categoryName },
    };
  }

  async findAllBrandMeals(brandId: number, limit = 5, offset = 0) {
    // check if brand exists
    const existingBrand = await this.findBrandById(brandId);

    if (!existingBrand) {
      throw new BadRequestException('Brand does not exist.');
    }

    // retrieve a paginated list of all brands meal addons
    const query = this.knex.table('meal_addons').where('brand_id', brandId);
    const addons = await query.limit(limit).offset(offset);
    const addonCount = (await query.count())[0]['count'];

    return { addons, addonCount };
  }

  async findOneBrandMeal(brandId: number, addonId: number) {
    const existingBrand = await this.findBrandById(brandId);

    if (!existingBrand) {
      throw new BadRequestException('Brand does not exist.');
    }

    const addon = await this.knex
      .table('meal_addons')
      .where('id', addonId)
      .andWhere('brand_id', brandId)
      .first();

    if (!addon) {
      throw new NotFoundException('Meal addon does not exist for this brand');
    }

    return { data: addon };
  }

  async updateBrandMeal({
    brandId,
    addonId,
    updateMealDto,
  }: {
    brandId: number;
    addonId: number;
    updateMealDto: UpdateMealAddonDto;
  }) {
    const existingBrand = await this.findBrandById(brandId);

    if (!existingBrand) {
      throw new BadRequestException('Brand does not exist.');
    }

    const addon = await this.knex
      .table('meal_addons')
      .where('id', addonId)
      .andWhere('brand_id', brandId)
      .first();

    if (!addon) {
      throw new NotFoundException('Meal addon does not exist for this brand');
    }

    const updatedAddon = await this.knex
      .table('meal_addons')
      .returning('*')
      .where({ id: addonId })
      .update({
        ...updateMealDto,
      });

    return { message: 'Addon updated successfully', data: updatedAddon[0] };
  }

  async removeBrandMeal(brandId: number, addonId: number) {
    const existingBrand = await this.findBrandById(brandId);

    if (!existingBrand) {
      throw new BadRequestException('Brand does not exist.');
    }

    const addon = await this.knex
      .table('meal_addons')
      .where('id', addonId)
      .andWhere('brand_id', brandId)
      .first();

    if (!addon) {
      throw new NotFoundException('Meal addon does not exist for this brand');
    }

    await this.knex
      .table('meal_addons')
      .where({ id: addonId, brand_id: brandId })
      .del();

    return { message: ` Addon with name ${addon.name} deleted successfully` };
  }

  async createMealCategory(brandId: number, categoryName: string) {
    const existingBrand = await this.findBrandById(brandId);

    if (!existingBrand) {
      throw new BadRequestException('Brand does not exist.');
    }

    const existingCategory = await this.knex
      .table('meal_categories')
      .where('name', categoryName)
      .first();

    if (existingCategory) {
      throw new BadRequestException(
        'Meal Category already exists for this brand.',
      );
    }

    const mealCategory = await this.knex
      .table<Category>('meal_categories')
      .insert({ name: categoryName, brand_id: brandId })
      .returning('*');

    return { data: { ...mealCategory[0], brandName: existingBrand.name } };
  }
}
