import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Products } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Orders } from 'src/orders/entities/order.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Products)
    private readonly productRepo: Repository<Products>,
    @InjectRepository(Orders)
    private readonly orderRepo: Repository<Orders>,
  ) {}

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.productRepo.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not exist`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Products> {
    try {
      const product = this.productRepo.create(createProductDto);
      return await this.productRepo.save(product);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '23505'
      ) {
        throw new ConflictException('Ya existe un producto con ese nombre');
      }
      throw error;
    }
  }

  async update(
    @Param('id', ParseUUIDPipe) id: string,
    dto: UpdateProductDto,
  ): Promise<Products> {
    const prod = await this.productRepo.preload({ id, ...dto });
    if (!prod) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    }
    return this.productRepo.save(prod);
  }

  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    await this.productRepo.remove(product);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check servers log',
    );
  }

  async hasOrders(productId: string): Promise<boolean> {
    const count = await this.orderRepo.count({
      where: { product: { id: productId } },
    });
    return count > 0;
  }
}
