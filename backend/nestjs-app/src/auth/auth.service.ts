import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { Stripe } from 'stripe';

@Injectable()
export class AuthService {
  private stripe: Stripe;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly supabaseStrategy: SupabaseStrategy,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2020-08-27',
    });
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const { user, error } = await this.supabaseStrategy.validateUser(username, pass);
    if (error) {
      throw new Error(error.message);
    }
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    const stripeCustomer = await this.createStripeCustomer(user.email);
    const { password, ...result } = user;
    return result;
  }

  async createStripeCustomer(email: string): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      email,
    });
  }
}
