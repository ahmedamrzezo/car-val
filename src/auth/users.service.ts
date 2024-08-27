import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

	createUser(email: string, password: string) {
		const entity = this.userRepository.create({ email, password });
		return this.userRepository.save(entity);
	}

	findOne(id: string) {
		if (!id) {
			return null;
		}
		return this.userRepository.findOneBy({ id });
	}

	find(email: string) {
		return this.userRepository.find({ where: { email } });
	}

	async update(id: string, changes: Partial<User>) {
		const user = await this.findOne(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		Object.assign(user, changes);
		return this.userRepository.save(user);
	}

	async remove(id: string) {
		const user = await this.findOne(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return this.userRepository.remove(user);
	}
}
