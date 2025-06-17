export interface AppUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  ci: string;
  charge: 'Administrativo' | 'Limpieza';
  role: 'Administrador' | 'Usuario';
  building: string;
  photoUrl?: string;
  active?: boolean;
}
