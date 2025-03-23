import { Body, Controller, Post } from '@nestjs/common';

@Controller('/users')
export class CreateUserController {
  constructor(private readonly command: any) {}

  @Post('')
  async create(@Body() body: CreateUserRequestDTO): Promise<any> {}
}
