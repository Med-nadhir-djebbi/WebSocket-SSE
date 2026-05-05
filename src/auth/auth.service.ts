import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity'; // Adjust path if needed
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService, 
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<Partial<User>> {
    const { username, email, password } = registerUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword, 
    });

    try {
      await this.userRepository.save(user);
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };
    } catch (error) {
      throw new ConflictException('Username or email already exists');
    }
  }

  async login(loginCredentialsDto: LoginCredentialsDto) {
    const { username, password } = loginCredentialsDto;

    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('Wrong username or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong username or password');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const jwt = this.jwtService.sign(payload);

    return {
      access_token: jwt,
    };
  }
}