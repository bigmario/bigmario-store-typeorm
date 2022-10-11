import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, In, Repository } from 'typeorm';

import { Product } from './../entities/product.entity';
import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from './../dtos/products.dtos';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async findAll(queryParams?: FilterProductsDto) {
    if (queryParams) {
      const { limit, offset } = queryParams;
      const { minPrice, maxPrice } = queryParams;
      const findOptions: FindOptionsWhere<Product> = {
        price: Between(minPrice, maxPrice),
      };
      return await this.productRepo.find({
        relations: {
          brand: true,
          categories: true,
        },
        take: limit,
        skip: offset,
        ...(queryParams?.minPrice && {
          where: findOptions,
        }),
      });
    }
    return await this.productRepo.find({
      relations: {
        brand: true,
        categories: true,
      },
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

  async removeCategoryByProductId(productId: number, categoryId: number) {
    const product = await this.productRepo.findOne({
      relations: ['categories'],
      where: {
        id: productId,
      },
    });

    product.categories = product.categories.filter(
      (item) => item.id !== categoryId,
    );
    return this.productRepo.save(product);
  }

  async addCategoryToProduct(productId: number, categoryId: number) {
    const product = await this.productRepo.findOne({
      relations: ['categories'],
      where: {
        id: productId,
      },
    });

    const category = await this.categoryRepo.findOne({
      where: {
        id: categoryId,
      },
    });

    product.categories.push(category);
    return this.productRepo.save(product);
  }
}
