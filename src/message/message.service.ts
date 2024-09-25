import { Injectable } from '@nestjs/common';
import { from } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  getAllMessages() {
    return from(this.prisma.message.findMany());
  }

  createMessage(content: string, username: string) {
    return from(
      this.prisma.message.create({
        data: {
          content,
          username,
        },
      }),
    );
  }
}
