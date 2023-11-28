import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EditUserDto } from '../dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async editUser(
    id: number,
    dto: EditUserDto,
  ): Promise<Omit<User, 'hash'>> {
    try {
      const user =
        await this.prisma.user.update({
          where: {
            id,
          },
          data: {
            ...dto,
          },
        });
      delete user.hash;
      return user;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw error;
    }
  }
}
