import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-dashboard-layout',
  imports: [SideMenuComponent, RouterOutlet],
  templateUrl: './user-dashboard-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDashboardLayoutComponent {}
