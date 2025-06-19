import { UserCharge, UserRole } from './user-enum.interface';

export interface AppUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  ci: string;
  charge: UserCharge;
  role: UserRole;
  building: string;
  photoUrl?: string;
  active?: boolean;
}
