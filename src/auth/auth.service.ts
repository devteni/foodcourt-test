import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { TokenPayload, User } from 'index';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  protected db: Knex;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectModel() private readonly knex: Knex,
  ) {
    this.db = this.knex;
  }
  SECRET = this.configService.get('jwt.secret');
  EXPIRY = this.configService.get('jwt.expiry');

  async findByUserEmail(email: string) {
    const existingUser = await this.db('users').where('email', email);
    return existingUser[0];
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.findByUserEmail(email);

    if (!user) {
      return null;
    }

    const matchPass = await bcrypt.compare(pass, user.password);

    if (!matchPass) {
      throw new UnauthorizedException();
    }

    return { email: user.email, role: user.role };
  }

  async signup(createUserDto: CreateUserDto) {
    const existingUser = await this.db('users')
      .where('email', createUserDto.email)
      .first();

    if (existingUser) {
      throw new BadRequestException(
        'This user already exists. Log in instead.',
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const userRole = createUserDto.role === 'admin' ? Role.Admin : Role.Regular;

    const user = await this.db<User>('users')
      .insert({
        email: createUserDto.email,
        password: hashedPassword,
        role: userRole,
      })
      .returning('*');

    const payload = { email: user[0].email, sub: user[0].id };
    const token = await this.generateAccessToken(payload);

    return { message: 'User created successfully', data: user[0], token };
  }

  async login(user) {
    // This login method is used to generate access token for the verified `user` argument

    // generate access token
    const payload = { email: user.email, sub: user.id };
    const token = await this.generateAccessToken(payload);

    // return user details and token
    if (token)
      return {
        message: 'login successful',
        data: user,
        token,
      };
  }

  async generateAccessToken(payload: TokenPayload) {
    const secret = this.SECRET;
    const expiresIn = this.EXPIRY;
    return await this.jwtService.signAsync(payload, { expiresIn, secret });
  }
}
