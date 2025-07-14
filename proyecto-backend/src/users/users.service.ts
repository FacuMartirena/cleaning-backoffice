import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Orders } from 'src/orders/entities/order.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');
  ordersRepository: any;
  usersRepository: any;

  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,

    @InjectRepository(Orders)
    private readonly ordersRepo: Repository<Orders>,
  ) {}

  async create(dto: CreateUserDto): Promise<Users> {
    try {
      const hasedPassword = await bcrypt.hash(dto.password, 10);
      const user = this.usersRepo.create({ ...dto, password: hasedPassword });
      return await this.usersRepo.save(user);
    } catch (error) {
      if (error.code === '23505') {
        const detail = error.detail?.toLowerCase();

        if (detail?.includes('email')) {
          throw new BadRequestException(
            `El correo electrónico está siendo usado por otro usuario`,
          );
        }

        if (detail?.includes('ci')) {
          throw new BadRequestException(
            `Ya existe un usuario registrado con esa ci.`,
          );
        }
      }

      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error inesperado al crear usuario.',
      );
    }
  }

  async findAll(): Promise<Users[]> {
    return this.usersRepo.find({ relations: ['orders'] });
  }

  async findOne(id: string): Promise<Users> {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ['orders'],
    });
    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado.`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.usersRepo.findOneByOrFail({ id });

    if (!updateUserDto.photoUrl) {
      updateUserDto.photoUrl = user.photoUrl;
    }

    const updated = this.usersRepo.merge(user, updateUserDto);
    return this.usersRepo.save(updated);
  }

  async updateStatus(id: string, active: boolean): Promise<Users> {
    const user = await this.findOne(id);
    user.active = active;
    return this.usersRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
  }

  async deleteMany(ids: string[]) {
    for (const id of ids) {
      await this.ordersRepo.delete({ user: { id } });

      await this.usersRepo.delete(id);
    }

    return { message: 'Usuarios eliminados correctamente' };
  }
}
