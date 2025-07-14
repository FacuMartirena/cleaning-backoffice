import { AppUser } from './appUser.interface';

export interface AuthResponse {
  token: string;
  user: AppUser;
}
