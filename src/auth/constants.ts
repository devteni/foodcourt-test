import { ConfigService } from '@nestjs/config';

export class jwtConstants {
  constructor(private readonly configService: ConfigService) {}
  static SECRET: string | Buffer;
  static EXPIRY: string | number;
  SECRET = process.env.JWT_SECRET;
  EXPIRY = process.env.JWT_EXPIRY;
}
