import { PrismaService } from './prisma.service';
import { Users } from '@prisma/client';
export declare class AppService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getHello(): Promise<Users[]>;
}
