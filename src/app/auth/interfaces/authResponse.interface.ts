// src/app/auth/interfaces/auth-response.interface.ts

import { AppUser } from './appUser.interface';

export interface AuthResponse {
  token: string;
  user: AppUser;
}
