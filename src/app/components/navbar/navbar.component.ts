import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MenubarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  items: any[] = [];
  userRole: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getRole().subscribe((role) => {
      this.userRole = role;
      this.configureItems();
    });
  }

  LogOut() {
    this.authService.logout();
    this.userRole = null;
    this.configureItems();
  }

  configureItems() {
    this.items = [
      ...(this.userRole === 'Manager'
        ? [{ label: 'Requests', icon: 'pi pi-file', routerLink: ['/requests'] }]
        : []),
      ...(this.userRole === 'Manager'
        ? [
            {
              label: 'Objects',
              icon: 'pi pi-briefcase',
              routerLink: ['/objects'],
            },
          ]
        : []),
      {
        label: 'Submit Request',
        icon: 'pi pi-send',
        routerLink: ['/submit-request'],
      },
      {
        label: 'Login',
        icon: 'pi pi-sign-in',
        routerLink: ['auth/login'],
        visible: !this.userRole,
      },
      {
        label: 'Register',
        icon: 'pi pi-address-book',
        routerLink: ['auth/register'],
        visible: !this.userRole,
      },
      {
        icon: 'pi pi-sign-out',
        routerLink: ['auth/login'],
        command: () => this.LogOut(),
        visible: !!this.userRole,
      },
    ];
  }
}
