import { Pipe, PipeTransform } from '@angular/core';
import {
  UserCharge,
  UserRole,
} from '../../auth/interfaces/user-enum.interface';

@Pipe({ name: 'userRole', standalone: true })
export class UserRolePipe implements PipeTransform {
  transform(value: UserRole): string {
    return UserRole[value];
  }
}

@Pipe({ name: 'userCharge', standalone: true })
export class UserChargePipe implements PipeTransform {
  transform(value: UserCharge): string {
    return UserCharge[value];
  }
}
