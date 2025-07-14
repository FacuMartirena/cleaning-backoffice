import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserPosition } from 'src/users/entities/user-position.enum';
import { UserRole } from 'src/users/entities/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Users | null> {
    const user = await this.usersRepo.findOneBy({ email });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    if (!user.active)
      throw new UnauthorizedException('El usuario está inactivo');

    return user;
  }

  generateToken(user: Users): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async findOrCreateGoogleUser(googleUser: any): Promise<Users> {
    const { email, firstName, lastName, picture } = googleUser;

    let user = await this.usersRepo.findOne({ where: { email } });

    if (!user) {
      user = this.usersRepo.create({
        email,
        firstName,
        lastName,
        photoUrl: picture,
        password: await bcrypt.hash('Globo1234', 10),
        ci: '00000000',
        position: UserPosition.LIMPIEZA,
        role: UserRole.USUARIO,
        building: 'Sin edificio',
        active: true,
      });

      await this.usersRepo.save(user);
    }

    return user;
  }
}
