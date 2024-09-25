import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { of } from 'rxjs';
import { CreateMessageDto } from './dto/create-message.dto';

describe('MessageController', () => {
  let messageController: MessageController;
  // I want to keep the messageService var even if it's not used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let messageService: MessageService;

  // Create a mock implementation of MessageService
  const mockMessageService = {
    getAllMessages: jest.fn(), // Mocking getAllMessages method
    createMessage: jest.fn(), // Mocking createMessage method
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageService,
          useValue: mockMessageService, // Provide the mock
        },
      ],
    }).compile();

    messageController = module.get<MessageController>(MessageController);
    messageService = module.get<MessageService>(MessageService);
  });

  describe('getMessages', () => {
    it('should return an observable of messages', () => {
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
      mockMessageService.getAllMessages.mockReturnValue(of(mockMessages));

      messageController.getMessages().subscribe((messages) => {
        expect(messages).toEqual(mockMessages); // Expect the mocked return
        expect(mockMessageService.getAllMessages).toHaveBeenCalled(); // Ensure the method was called
      });
    });
  });

  describe('createMessage', () => {
    it('should create a message and return it', () => {
      const newMessage = { content: 'New Message', username: 'User3' };
      const createdMessage = {
        id: 1,
        content: newMessage.content,
        username: newMessage.username,
        createdAt: new Date('2024-09-25T15:41:59Z'), // Fixed createdAt value
      };

      mockMessageService.createMessage.mockReturnValue(of(createdMessage));

      const createMessageDto = new CreateMessageDto();
      createMessageDto.content = newMessage.content;
      createMessageDto.username = newMessage.username;

      messageController.createMessage(createMessageDto).subscribe((result) => {
        expect(result).toEqual(createdMessage); // Expect the mocked return
        expect(mockMessageService.createMessage).toHaveBeenCalledWith(
          createMessageDto.content,
          createMessageDto.username,
        ); // Ensure the method was called with correct arguments
      });
    });
  });
});
