import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { of } from 'rxjs';
import { MessageService } from 'src/message/message.service';

describe('ChatGateway', () => {
  let chatGateway: ChatGateway;
  // I want to keep the service for reference
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let messageService: MessageService;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        {
          provide: MessageService,
          useValue: {
            createMessage: jest
              .fn()
              .mockReturnValue(
                of({ id: 1, content: 'Test message', username: 'User' }),
              ),
            getAllMessages: jest
              .fn()
              .mockReturnValue(
                of([{ id: 1, content: 'Test message', username: 'User' }]),
              ),
          },
        },
      ],
    }).compile();

    chatGateway = module.get<ChatGateway>(ChatGateway);
    messageService = module.get<MessageService>(MessageService);

    // Mocking server
    server = {
      emit: jest.fn(),
      engine: {
        clientsCount: 0,
      },
    } as unknown as Server;

    chatGateway.server = server; // Assigning the mocked server to the gateway
  });

  describe('handleConnection', () => {
    it('should log client connection and total clients', () => {
      const client = { id: 'test-client-id' };
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');

      chatGateway.handleConnection(client);

      expect(loggerSpy).toHaveBeenCalledWith(`Client connected: ${client.id}`);
      expect(loggerSpy).toHaveBeenCalledWith('Total clients: 0'); // initial clients count
    });
  });

  describe('handleDisconnect', () => {
    it('should log client disconnection', () => {
      const client = { id: 'test-client-id' };
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');

      chatGateway.handleDisconnect(client);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Client disconnected: ${client.id}`,
      );
    });
  });

  describe('handleMessage', () => {
    it('should log new message event and emit the new message', (done) => {
      const messageData = { content: 'Hello, world!', username: 'User1' };
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');

      chatGateway.handleMessage(messageData);

      expect(loggerSpy).toHaveBeenCalledWith(
        `New message event from ${messageData.username}: ${messageData.content}`,
      );

      // Wait for the observable to emit
      setTimeout(() => {
        expect(server.emit).toHaveBeenCalledWith('newMessage', {
          id: 1,
          content: 'Test message',
          username: 'User',
        });
        done();
      }, 0);
    });
  });

  describe('handleGetMessages', () => {
    it('should log get all messages event and emit messages', (done) => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');

      chatGateway.handleGetMessages();

      expect(loggerSpy).toHaveBeenCalledWith('Get all messages event');

      // Wait for the observable to emit
      setTimeout(() => {
        expect(server.emit).toHaveBeenCalledWith('allMessages', [
          { id: 1, content: 'Test message', username: 'User' },
        ]);
        done();
      }, 0);
    });
  });
});
