import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private messageService: MessageService) {}

  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id}`);
    this.logger.log(`Total clients: ${this.server.engine.clientsCount}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() data: { content: string; username: string }) {
    this.logger.log(`New message event from ${data.username}: ${data.content}`);
    return this.messageService
      .createMessage(data.content, data.username)
      .subscribe((message) => {
        this.server.emit('newMessage', message);
      });
  }

  @SubscribeMessage('getMessages')
  handleGetMessages() {
    this.logger.log('Get all messages event');
    // Here we subscribe to the observable returned by the service method and emit the messages to all clients
    return this.messageService.getAllMessages().subscribe((messages) => {
      this.server.emit('allMessages', messages);
    });
  }
}
