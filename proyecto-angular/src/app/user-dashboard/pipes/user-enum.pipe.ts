import { Pipe, PipeTransform } from '@angular/core';
import { UserCharge, UserRole } from '../../auth/interfaces/user-enum';

@Pipe({ name: 'userRole', standalone: true })
export class UserRolePipe implements PipeTransform {
  transform(role: string | number): string {
    if (typeof role === 'string') return role;
    return UserRole[role];
  }
}

@Pipe({ name: 'userCharge', standalone: true })
export class UserChargePipe implements PipeTransform {
  transform(value: UserCharge): string {
    return UserCharge[value];
  }
}
