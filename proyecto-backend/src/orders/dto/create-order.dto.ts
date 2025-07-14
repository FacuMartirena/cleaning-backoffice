import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  building: string;
}
