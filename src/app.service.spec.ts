const userMock = {
    "id": "1f865418-be1a-4e19-898f-3c89eb68c0f3",
    "name": "test2",
    "phone": "1122334455",
    "email": "test@test.com",
    "birthdate": new Date("2000-11-06T00:00:00.000Z"),
    "gender": "male"
}

import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from './prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AppService', () => {
  let appService: AppService;
  let prisma: DeepMockProxy<PrismaClient>

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
            provide: PrismaService,
            useValue: mockDeep<PrismaClient>(),
        }
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
    // @ts-ignore
    prisma = app.get<PrismaService>(PrismaService);
  });

  it('should to be defined the services', () => {
    expect(appService).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('User CRUD', () => {
    it('should find one user', async () => {
        // @ts-ignore
        prisma.users.findFirst.mockResolvedValue(userMock.id);
    
        const result = await appService.findOne(userMock.id);
        
        expect(result).toEqual(userMock.id);
    });

    it('should find many users', async () => {
        // Definicion y resolucion de métodos de prisma.
        // @ts-ignore
        prisma.users.findMany.mockResolvedValue([userMock]);
        
        // Ejecución del metodo del AppService a testear y guardar resultado.
        const result = await appService.findAll();
        
        // Comparacion de resultados obtenidos.
        expect(result).toEqual([userMock]);
    });

    it('should create a user', async () => {
        // @ts-ignore
        prisma.users.create.mockResolvedValue(userMock);
        // @ts-ignore
        prisma.$transaction.mockImplementationOnce(callback => callback(prisma));
    
        const result = await appService.createUser(userMock);
        console.log({ result });
        
        expect(result).toEqual(userMock);
        // @ts-ignore
        expect(prisma.users.create).toHaveBeenCalled();
        expect(prisma.users.create).toHaveBeenCalledWith({ data: userMock });
    });

    it('should update a user', async () => {
        // @ts-ignore
        prisma.users.update.mockResolvedValue({ ...userMock, name: "lupin" });
        // @ts-ignore
        prisma.$transaction.mockImplementation(callback => callback(prisma));

        const result = await appService.updateUser(userMock.id, userMock);
        console.log({result});

        expect(result).toEqual({ ...userMock, name: 'lupin' });
        expect(prisma.users.update).toHaveBeenCalled();
        expect(prisma.users.update).toHaveBeenCalledWith({ where: { id: userMock.id }, data: userMock });
    });
  });

  describe('Get one user', () => {
    // it('throws an error when no pass id', async () => {
    //     try {
    //         await appService.findOne('');
    //     } catch (error) {
    //         expect(error).toBeInstanceOf(BadRequestException);
    //         expect(error.message).toBe('Id is required.');
    //     }
    // });

    it('throws an error when no user find', async () => {
        prisma.users.findFirst.mockReturnValue(undefined);

        try {
            await appService.findOne(userMock.id);
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
            expect(error.message).toEqual('User not found.');
        }
    });
  });
});
