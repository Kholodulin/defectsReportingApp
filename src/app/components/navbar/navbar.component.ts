import { CommonModule } from '@angular/common';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MenubarModule,
    InputTextModule,
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  items: any[] = [];
  loginLogoutItems: any[] = [];
  userRole: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService
      .getRole()
      .pipe(distinctUntilChanged())
      .subscribe((role) => {
        this.userRole = role;
        this.configureItems();
      });
  }

  LogOut() {
    this.authService.logout();
    this.userRole = '';
    this.configureItems();
  }

  configureItems() {
    this.items = [
      ...(this.userRole === 'Manager'
        ? [
            {
              label: 'Objects',
              icon: 'pi pi-briefcase',
              routerLink: ['/objects'],
            },
          ]
        : []),
      ...(this.userRole === 'Manager'
        ? [{ label: 'Requests', icon: 'pi pi-file', routerLink: ['/requests'] }]
        : []),
      {
        label: 'Submit Request',
        icon: 'pi pi-send',
        routerLink: ['/submit-request'],
      },
    ];
  }
}
