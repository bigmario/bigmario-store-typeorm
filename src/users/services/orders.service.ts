import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { Customer } from '../entities/customer.entity';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {}

  async findAll() {
    return await this.orderRepo.find({
      relations: {
        items: {
          product: true,
        },
        customer: true,
      },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      relations: {
        items: {
          product: true,
        },
        customer: true,
      },
      where: {
        id,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async create(data: CreateOrderDto) {
    const newOrder = new Order();
    if (data.customerId) {
      const customer = await this.customerRepo.findOne({
        where: {
          id: data.customerId,
        },
      });
      newOrder.customer = customer;
    }
    return this.orderRepo.save(newOrder);
  }

  async update(id: number, changes: UpdateOrderDto) {
    const updatedOrder = await this.orderRepo.findOneBy({ id });
    if (changes.customerId) {
      const customer = await this.customerRepo.findOne({
        where: {
          id: changes.customerId,
        },
      });
      updatedOrder.customer = customer;
    }
    return this.orderRepo.save(updatedOrder);
  }

  async remove(id: number) {
    return await this.orderRepo.delete(id);
  }
}
