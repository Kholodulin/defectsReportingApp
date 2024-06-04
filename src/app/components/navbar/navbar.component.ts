import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MenubarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  items!: any[];
  ngOnInit() {
    this.items = [
      { label: 'Requests', icon: 'pi pi-file', routerLink: ['/requests'] },
      { label: 'Objects', icon: 'pi pi-briefcase', routerLink: ['/objects'] },
      { label: 'Submit Request', icon: 'pi pi-send', routerLink: ['/submit-request'] }
    ];
  }
}
