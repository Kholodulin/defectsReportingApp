import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { LoginComponent } from '../../auth/login/login.component';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MenubarModule, LoginComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  items!: any[];
  ngOnInit() {
    this.items = [
      { label: 'Requests', icon: 'pi pi-file', routerLink: ['/requests'] },
      { label: 'Objects', icon: 'pi pi-briefcase', routerLink: ['/objects'] },
      {
        label: 'Submit Request',
        icon: 'pi pi-send',
        routerLink: ['/submit-request'],
      },
      { label: 'Login', icon: 'pi pi-sign-in', routerLink: ['/login'] },
      {
        icon: 'pi pi-sign-out',
        routerLink: ['/login'],
        command: () => this.LogOut(),
      },
    ];
  }

  LogOut() {
    localStorage.clear();
  }
}
