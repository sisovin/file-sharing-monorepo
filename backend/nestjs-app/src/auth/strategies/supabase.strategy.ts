import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStrategy {
  private supabase: SupabaseClient;

  constructor(private readonly authService: AuthService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async validateUser(email: string, password: string): Promise<any> {
    const { user, error } = await this.supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return user;
  }
}
