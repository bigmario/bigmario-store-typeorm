import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Product } from './../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './../dtos/products.dtos';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async findAll() {
    return await this.productRepo.find({
      relations: ['brand', 'categories'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      relations: ['brand', 'categories'],
      where: {
        id,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    // const newProduct = new Product();
    // newProduct.image = data.image;
    // newProduct.name = data.name;
    // newProduct.description = data.description;
    // newProduct.stock = data.stock;
    // newProduct.price = data.price;
    const newProduct = await this.productRepo.create(data);
    if (data.brandId) {
      const brand = await this.brandRepo.findOne({
        where: {
          id: data.brandId,
        },
      });
      newProduct.brand = brand;
    }
    if (data.categoriesIds) {
      const categories = await this.categoryRepo.findBy({
        id: In(data.categoriesIds),
      });
      newProduct.categories = categories;
    }
    return this.productRepo.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.productRepo.findOneBy({ id });
    if (changes.brandId) {
      const brand = await this.brandRepo.findOne({
        where: {
          id: changes.brandId,
        },
      });
      product.brand = brand;
    }
    this.productRepo.merge(product, changes);
    return this.productRepo.save(product);
  }

  async remove(id: number) {
    return await this.productRepo.delete(id);
  }
}
