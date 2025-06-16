export interface AppUser {
  /** Para autenticación y datos de perfil */
  name: string;
  surname: string;
  email: string;
  password: string;
  ci: string;
  charge: 'Administrativo' | 'Limpieza';
  role: 'Administrador' | 'Usuario';
  building: string;
  photoUrl?: string;
  /** Para el listado en UI */
  id: number;
  active?: boolean;
}
