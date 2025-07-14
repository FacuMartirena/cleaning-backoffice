import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Redirect,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.authService.generateToken(user);
    return { token, user };
  }

  @Get('logout')
  @Redirect('http://localhost:4200/auth/login', 302)
  logout(@Res() res: Response) {
    res.clearCookie('connect.sid');
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh-token')
  getNewToken(@Req() req: any) {
    const user = req.user;
    const token = this.authService.generateToken(user);
    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  getCurrentUser(@Req() req: any) {
    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    try {
      const googleUser = req.user;
      const user = await this.authService.findOrCreateGoogleUser(googleUser);

      if (!user.active) {
        return res.redirect(
          `http://localhost:4200/auth/google-succes?error=${encodeURIComponent('Usuario inactivo')}`,
        );
      }

      const token = this.authService.generateToken(user);
      return res.redirect(
        `http://localhost:4200/auth/google-succes?token=${token}`,
      );
    } catch (err) {
      return res.redirect(
        `http://localhost:4200/auth/google-succes?error=${encodeURIComponent('Error inesperado')}`,
      );
    }
  }
}
