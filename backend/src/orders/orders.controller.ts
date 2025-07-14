import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  BadRequestException,
  ForbiddenException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.orderService.findAll(paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/finalize')
  async finalizeOrder(@Param('id') id: string, @Req() req: any) {
    console.log('Header Authorization:', req.headers.authorization);
    console.log('Usuario autenticado:', req.user);
    const role = req.user.role;

    if (role !== 'Administrador' && role !== 'Administrativo') {
      throw new BadRequestException('No tienes permiso para finalizar pedidos');
    }

    return this.orderService.finalize(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/reject')
  async rejectOrder(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    const role = req.user.role;

    if (role !== 'Administrador' && role !== 'Administrativo') {
      throw new ForbiddenException('No tienes permiso para rechazar pedidos');
    }

    return this.orderService.reject(id, reason);
  }
}
