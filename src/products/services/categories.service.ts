import { Injectable, NotFoundException } from '@nestjs/common';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async findAll() {
    return await this.categoryRepo.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async create(data: CreateCategoryDto) {
    const newcategory = await this.categoryRepo.create(data);
    return await this.categoryRepo.save(newcategory);
  }

  async update(id: number, changes: UpdateCategoryDto) {
    const updatedCategory = await this.categoryRepo.findOneBy({ id });
    this.categoryRepo.merge(updatedCategory, changes);
    return await this.categoryRepo.save(updatedCategory);
  }

  async remove(id: number) {
    return await this.categoryRepo.delete(id);
  }
}
