import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

const testEmail = 'test@test.com';
const testPassword = 'test';

describe('AuthController', () => {
  let controller: AuthController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    fakeAuthService = {
      signIn: (email: string, password: string) => Promise.resolve({ id: '1', email, password } as unknown as User),
    };
    fakeUserService = {
      findOne: (id: string) => Promise.resolve({ id, email: testEmail, password: testPassword } as unknown as User),
      find: (email: string) => Promise.resolve([{ id: '1', email, password: testPassword } as unknown as User]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of users', async () => {
    const users = await controller.findAll(testEmail);

    expect(users).toEqual([{ id: '1', email: testEmail, password: testPassword }]);
  });

  it('should return a user by id', async () => {
    const user = await controller.findUser('1');
    expect(user.email).toEqual(testEmail);
  });

  it('should throw error user id not found', async () => {
    fakeUserService.findOne = () => Promise.resolve(null);
    await expect(controller.findUser('2')).rejects.toThrow(NotFoundException);
  });

  it('should update session object and returns user', async () => {
    const session = {userId: '43'};
    const user = await controller.signIn({email: testEmail, password: testPassword}, session);
    expect(user.email).toEqual(testEmail);
    expect(session.userId).toEqual('1');
  });
});
