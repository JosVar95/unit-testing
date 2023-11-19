import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Users } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  findOne(id: string): Promise<Users> {
    const user = this.prismaService.users.findFirst({
      where: { id }
    });

    if(!user) throw new NotFoundException('User not found.');

    return user;
  }

  findAll(): Promise<Users[]> {
    return this.prismaService.users.findMany();
  }

  createUser(user: Users): Promise<Users> {
    return this.prismaService.$transaction(async prisma => {
      return prisma.users.create({
        data: user
      });
    });
  }

  updateUser(id: string, user: Users): Promise<Users> {
    return this.prismaService.$transaction(async (prisma) => {
      return prisma.users.update({
        where: { id },
        data: user,
      });
    });
  }
}
