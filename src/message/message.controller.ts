import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The messages have been successfully retrieved.',
  })
  getMessages() {
    return this.messageService.getAllMessages();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The message has been successfully created.',
  })
  @ApiBody({
    type: CreateMessageDto,
    description: 'The message to create in the database',
  })
  createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.createMessage(
      createMessageDto.content,
      createMessageDto.username,
    );
  }
}
