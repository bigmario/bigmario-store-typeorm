import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos/order-item.dto';
import { Customer } from '../entities/customer.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {}

  async findAll() {
    return await this.orderItemRepo.find({
      relations: ['customer', 'items'],
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      relations: ['customer', 'items'],
      where: {
        id,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async create(data: CreateOrderItemDto) {
    const newOrderItem = this.orderItemRepo.create(data);
    if (data.orderId) {
      const order = await this.orderRepo.findOne({
        where: {
          id: data.orderId,
        },
      });
      newOrderItem.order = order;
    }
    if (data.productId) {
      const product = await this.productRepo.findOne({
        where: {
          id: data.productId,
        },
      });
      newOrderItem.product = product;
    }

    return this.orderItemRepo.save(newOrderItem);
  }

  async update(id: number, changes: UpdateOrderItemDto) {
    const updatedOrderItem = await this.orderItemRepo.findOneBy({ id });

    if (changes.orderId) {
      const order = await this.orderRepo.findOne({
        where: {
          id: changes.orderId,
        },
      });
      updatedOrderItem.order = order;
    }
    if (changes.productId) {
      const product = await this.productRepo.findOne({
        where: {
          id: changes.productId,
        },
      });
      updatedOrderItem.product = product;
    }
    this.orderItemRepo.merge(updatedOrderItem, changes);
    return this.orderItemRepo.save(updatedOrderItem);
  }

  async remove(id: number, orderId: number) {
    const deleted = await this.orderItemRepo.delete({
      id,
      order: {
        id: orderId,
      },
    });
    return deleted;
  }
}
