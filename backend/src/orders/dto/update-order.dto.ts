import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../entities/order.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
