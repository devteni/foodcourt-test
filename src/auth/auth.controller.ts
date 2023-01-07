import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(@InjectModel() private readonly knex: Knex, private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    console.log('signup');
    // check if user already exists
    const existingUser = await this.knex
      .table('users')
      .where('email', createUserDto.email)
      .first();

    if (existingUser) {
      return { message: 'This user already exists. Log in instead.' };
    }

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // create user with hashed password
    const user = await this.knex.table('users').returning('*').insert({
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
    });

    // return user details
    return { message: 'User created successfully', data: user[0] };
  }

  // Local auth guard verifies the user. This method is used to generate an access token for the user
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }
}
