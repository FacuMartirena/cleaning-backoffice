import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDto } from './dto/product-dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const prod = await this.productsService.findOne(id);
    if (!prod) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return new ProductDto(prod!);
  }

  @Post()
  async create(@Body() dto: CreateProductDto) {
    const prod = await this.productsService.create(dto);
    if (!prod) {
      throw new NotFoundException(`Product could not be created`);
    }
    return new ProductDto(prod);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    const prod = await this.productsService.update(id, dto);
    if (!prod) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return new ProductDto(prod);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.productsService.remove(id);
  }

  @Get(':id/has-orders')
  async hasOrders(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
    return this.productsService.hasOrders(id);
  }
}
