import { FastifyInstance } from 'fastify';
import { JwtPayload, LoginInput, RegistrationInput } from './auth.schema';
import { hashPassword, verifyPasswordWithHash } from '../../utils/hash';

export class AuthService {
  jwt;
  userService;
  logService;
  constructor(app: FastifyInstance) {
    this.jwt = app.jwt;
    this.userService = app.prisma.user;
    this.logService = app.prisma.log;
  }

  async registration({ email, password, name, phone }: RegistrationInput) {
    const candidate = await this.userService.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    if (candidate) {
      throw new Error(`Пользователь c email ${email} уже зарегистрирован`);
    }
    const hash = await hashPassword(password);
    const user = await this.userService.create({
      data: {
        email,
        password: hash,
        name,
        phone,
        role: 'USER',
        activated: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        activated: true,
      },
    });
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      activated: user.activated || false,
    };
    const token = this.jwt.sign(payload, {
      expiresIn: '30m',
    });
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: '30d',
    });

    await this.logService.create({
      data: { operation: 'registration', userId: payload.userId },
    });

    return { user, token, refreshToken };
  }

  async login({ email, password }: LoginInput) {
    const user = await this.userService.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    const hash = user.password;
    const isPassEquals = await verifyPasswordWithHash(password, hash);
    if (!isPassEquals) {
      throw new Error('Неверный пароль');
    }
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      activated: user.activated || false,
    };
    const token = this.jwt.sign(payload, {
      expiresIn: '30m',
    });
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: '30d',
    });

    if (user.role === 'USER') {
      await this.logService.create({
        data: { operation: 'login', userId: payload.userId },
      });
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        activated: user.activated,
      },
      token,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const decoded = this.jwt.verify<JwtPayload>(refreshToken);

    const user = await this.userService.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        activated: true,
      },
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      activated: user.activated || false,
    };

    const token = this.jwt.sign(payload, {
      expiresIn: '30m',
    });

    const newRefreshToken = this.jwt.sign(payload, {
      expiresIn: '30d',
    });

    if (user.role === 'USER') {
      await this.logService.create({
        data: { operation: 'refresh', userId: payload.userId },
      });
    }

    return { user, token, newRefreshToken };
  }
}
