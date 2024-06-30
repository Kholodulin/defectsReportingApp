import { CommonModule } from '@angular/common';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

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
export class NavbarComponent implements OnInit, OnDestroy {
export class NavbarComponent implements OnInit, OnDestroy {
  items: any[] = [];
  userRole: string | null = null;
  private destroy$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {}

  get isAuth() {
    return this.authService.isAuth;
  }

  ngOnInit() {
    this.authService
      .getRole()
      .pipe(takeUntil(this.destroy$))
      .subscribe((role) => {
        this.userRole = role;
        this.configureItems();
      });
    this.authService
      .getRole()
      .pipe(takeUntil(this.destroy$))
      .subscribe((role) => {
        this.userRole = role;
        this.configureItems();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isAuth(): boolean {
    return this.authService.isAuth;
  }

  LogOut() {
    this.router.navigate(['auth/login']);
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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
