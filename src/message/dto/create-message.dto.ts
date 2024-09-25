import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'The content of the message',
    type: String,
    required: true,
    example: 'Hello, World!',
  })
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    description: 'The username of the message author',
    type: String,
    required: true,
    example: 'JohnDoe',
  })
  @IsNotEmpty()
  username: string;
}
