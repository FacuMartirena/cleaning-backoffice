import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { OrderStatus } from './entities/order.enum';
import { Products } from 'src/products/entities/product.entity';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly orderRepository: Repository<Orders>,
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,

    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Orders> {
    const { userId, productId, quantity, building } = dto;

    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!foundUser) throw new NotFoundException('Usuario no encontrado');

    const foundProduct = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!foundProduct) throw new NotFoundException('Producto no encontrado');

    const newOrder = this.orderRepository.create({
      quantity,
      user: foundUser,
      product: foundProduct,
      building,
      status: OrderStatus.pendent,
      date: new Date().toISOString(),
    });

    return this.orderRepository.save(newOrder);
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.orderRepository.find({
      relations: {
        user: true,
        product: true,
      },
      order: {
        date: 'DESC',
      },
      take: limit,
      skip: offset,
    });
  }

  async finalize(id: string): Promise<Orders> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException('Order was not found');

    order.status = OrderStatus.completed;
    order.reason = undefined;

    return this.orderRepository.save(order);
  }

  async reject(id: string, reason: string): Promise<Orders> {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException('Order was not found');

    order.status = OrderStatus.rejected;
    order.reason = reason;

    return this.orderRepository.save(order);
  }
}
