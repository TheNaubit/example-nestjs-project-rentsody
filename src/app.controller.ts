import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  @ApiResponse({
    status: 200,
    description: 'The server is alive.',
  })
  ping(): string {
    return this.appService.ping();
  }
}
