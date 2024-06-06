import { NavbarComponent } from './components/navbar/navbar.component';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'defectReportingApp';
  @ViewChild('objectListTemplate', { static: true }) objectListTemplate!: TemplateRef<any>;
}
