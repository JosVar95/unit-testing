import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Users } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createUser(@Body() user: Users) {
    return this.appService.createUser(user);
  }
  @Get()
  getAll() {
    return this.appService.findAll();
  }

  @Get('id')
  getOne(@Param('id') id: string) {
    return this.appService.findOne(id)
  }
}
