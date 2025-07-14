export interface AppUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  ci: string;
  position: 'Administrativo' | 'Limpieza';
  role: 'Administrador' | 'Usuario';
  building: string;
  photoUrl?: string;
  active?: boolean;
}
