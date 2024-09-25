import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('MessageService', () => {
  let messageService: MessageService;
  // I want to keep the prismaService var even if it's not used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prismaService: PrismaService;

  // Create a mock implementation of PrismaService
  const mockPrismaService = {
    message: {
      findMany: jest.fn(), // Mocking findMany method
      create: jest.fn(), // Mocking create method
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: PrismaService,
          useValue: mockPrismaService, // Provide the mock
        },
      ],
    }).compile();

    messageService = module.get<MessageService>(MessageService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getAllMessages', () => {
    it('should return an observable of messages', (done) => {
      const mockMessages = [
        {
          id: 1,
          content: 'Hello',
          createdAt: new Date('2024-09-25T15:41:59Z'),
          username: 'User1',
        },
        {
          id: 2,
          content: 'World',
          createdAt: new Date('2024-09-25T15:41:59Z'),
          username: 'User2',
        },
      ];
      mockPrismaService.message.findMany.mockResolvedValue(mockMessages);

      messageService.getAllMessages().subscribe((messages) => {
        expect(messages).toEqual(mockMessages); // Expect the mocked return
        expect(mockPrismaService.message.findMany).toHaveBeenCalled(); // Ensure the method was called
        done();
      });
    });
  });

  describe('createMessage', () => {
    it('should create a message and return it', (done) => {
      const newMessage = { content: 'New Message', username: 'User3' };
      const createdAt = new Date('2024-09-25T15:41:59Z'); // Fixed createdAt value
      const createdMessage = {
        id: 1, // Fixed ID for consistency
        content: newMessage.content,
        username: newMessage.username,
        createdAt, // Use the same createdAt value
      };

      mockPrismaService.message.create.mockResolvedValue(createdMessage);

      messageService
        .createMessage(newMessage.content, newMessage.username)
        .subscribe((result) => {
          expect(result).toEqual(createdMessage); // Expect the mocked return
          expect(mockPrismaService.message.create).toHaveBeenCalledWith({
            data: newMessage,
          }); // Ensure the method was called with correct arguments
          done();
        });
    });
  });
});
