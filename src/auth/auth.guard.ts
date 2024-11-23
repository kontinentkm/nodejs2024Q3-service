// auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt, Strategy } from 'passport-jwt'; // Добавлен импорт Strategy и ExtractJwt
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends PassportStrategy(Strategy) {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Валидация, если нужно
    return { userId: payload.userId, login: payload.login };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) return false;
    try {
      const user = await this.jwtService.verifyAsync(token);
      request.user = user;
      return true;
    } catch (e) {
      return false;
    }
  }
}
