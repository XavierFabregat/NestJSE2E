import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { PrismaService } from '../prisma/service/prisma.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,
  ],
})
export class AuthModule {}
