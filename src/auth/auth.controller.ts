import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Serialize(UserDto)
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@Post('signup')
	createUser(@Body() body: CreateUserDto) {
		this.authService.createUser(body.email, body.password);
	}

	@Get(':id')
	async findUser(@Param('id') id: string) {
		const user = await this.authService.findOne(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	@Get()
	findAll(@Query('email') email: string) {
		return this.authService.find(email);
	}

	@Patch(':id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.authService.update(id, body);
	}

	@Delete(':id')
	removeUser(@Param('id') id: string) {
		return this.authService.remove(id);
	}
}
