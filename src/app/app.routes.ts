import { RequestStatusComponent } from './user/request-status/request-status.component';
import { SubmitRequestComponent } from './user/submit-request/submit-request.component';
import { ObjectsListComponent } from './manager/objects-list/objects-list.component';
import { RequestsListComponent } from './manager/requests-list/requests-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './auth/guard.guard';

export const routes: Routes = [
  { path: 'requests', title: 'Requests', component: RequestsListComponent, canActivate: [authGuard] },
  { path: 'objects', title: 'Objects', component: ObjectsListComponent, canActivate: [authGuard] },
  { path: 'submit-request', title: 'Submit-request', component: SubmitRequestComponent },
  { path: 'request-status/:id', title: 'Request Status', component: RequestStatusComponent},
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'register', title: 'Register', component: RegisterComponent },
  { path: '',   redirectTo: '/requests', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
