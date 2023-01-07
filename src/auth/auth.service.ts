import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectModel() private readonly knex: Knex,
  ) {}
  SECRET = this.configService.get('jwt.secret');
  EXPIRY = this.configService.get('jwt.expiry');

  async findByUserEmail(email: string) {
    const existingUser = await this.knex.table('users').where('email', email);
    return existingUser[0];
  }

  async validateUser(email: string, pass: string): Promise<any> {
    // find user by email
    const user = await this.findByUserEmail(email);

    if (!user) {
      return null;
    }

    // confirm that password equals with decrypting of course
    const matchPass = await bcrypt.compare(pass, user.password);

    if (!matchPass) {
      return new UnauthorizedException();
    }

    return { email: user.email, role: user.role };
  }

  async login(user) {
    // This login method is used to generate access token for the verified `user` argument

    // generate access token
    const payload = { username: user.email, sub: user.id };
    const token = await this.generateAccessToken(payload);

    // return user details and token
    if (token)
      return {
        message: 'login successful',
        data: user,
        token,
      };
  }

  async generateAccessToken(payload: any) {
    const secret = this.SECRET;
    const expiresIn = this.EXPIRY;
    return await this.jwtService.signAsync(payload, { expiresIn, secret });
  }
}
