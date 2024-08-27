import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scryptSync } from 'crypto';


@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) { }

	async signUp(email: string, password: string) {
		const user = await this.usersService.find(email);

		if (user.length) {
			throw new BadRequestException('User email already exists!');
		}
		
		const salt = randomBytes(8).toString('hex');

		const hash = scryptSync(password, salt, 32).toString('hex');
		const encryptedPassword = `${salt}.${hash}`;

		return await this.usersService.createUser(email, encryptedPassword);
	}

	async signIn(email: string, password: string) {
		const [user] = await this.usersService.find(email);

		if (!user) {
			throw new NotFoundException('User not found');
		}

		const [salt, savedHash] = user.password.split('.');
		const hash = scryptSync(password, salt, 32).toString('hex');
		
		if (hash !== savedHash) {
			throw new ForbiddenException('Invalid password');
		}
		return user;
	}
}
