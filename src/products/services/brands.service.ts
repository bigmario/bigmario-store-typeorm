import { Injectable, NotFoundException } from '@nestjs/common';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BrandsService {
  constructor(@InjectRepository(Brand) private brandRepo: Repository<Brand>) {}

  async findAll() {
    return await this.brandRepo.find();
  }

  async findOne(id: number) {
    const brand = await this.brandRepo.findOneBy({ id });
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return brand;
  }

  async create(data: CreateBrandDto) {
    const newBrand = this.brandRepo.create(data);
    return this.brandRepo.save(newBrand);
  }

  async update(id: number, changes: UpdateBrandDto) {
    const brand = await this.brandRepo.findOneBy({ id });
    this.brandRepo.merge(brand, changes);
    return this.brandRepo.save(brand);
  }

  async remove(id: number) {
    return this.brandRepo.delete(id);
  }
}
