import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ username, password: hashed });
    return this.userRepo.save(user);
  }

  async login(username: string, password: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid password');

    const payload = { username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateUser(username: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { username } });
  }
}
