import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

const testEmail = 'test@test.com';
const testPassword = 'test';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: () => Promise.resolve([]),
      createUser: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as unknown as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: UsersService, useValue: fakeUsersService }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user with hashed password', async () => {
    const user = await service.signUp(testEmail, testPassword);
    expect(user).toBeDefined();
    expect(user.email).toBe(testEmail);
    expect(user.password).not.toEqual(testPassword);

    const [salt, hash] = user.password.split('.');
    expect(hash).toBeDefined();
    expect(salt).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as unknown as User]);

    await expect(service.signUp(testEmail, testPassword)).rejects.toThrow(
      BadRequestException
    );
  });

  it('should throw if signin is called with an unused email', async () => {
    await expect(service.signIn(testEmail, testPassword)).rejects.toThrow(NotFoundException);
  });

  it('should throw error if the password is incorrect', async () => {
    fakeUsersService.find = () => Promise.resolve([{ id: 1, email: testEmail, password: testPassword } as unknown as User]);

    await expect(service.signIn(testEmail, 'a')).rejects.toThrow(ForbiddenException);
  });

  it('should return the user if signin is called with correct credentials', async () => {
    const user = await service.signUp(testEmail, testPassword);
    fakeUsersService.find = () => Promise.resolve([user as unknown as User]);

    await expect(service.signIn(user.email, testPassword)).resolves.toBeDefined();
  });
});
