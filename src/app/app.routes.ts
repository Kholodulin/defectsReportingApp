import { Routes } from '@angular/router';
import { authGuard } from './auth/guard.guard';

export const routes: Routes = [
  {
    path: 'requests',
    title: 'Requests',
    loadComponent: () =>
      import('./manager/requests-list/requests-list.component').then(
        (m) => m.RequestsListComponent
      ),
    canActivate: [authGuard],
    data: { role: 'Manager' },
  },
  {
    path: 'objects',
    title: 'Objects',
    loadComponent: () =>
      import('./manager/objects-list/objects-list.component').then(
        (m) => m.ObjectsListComponent
      ),
    canActivate: [authGuard],
    data: { role: 'Manager' },
  },
  {
    path: 'submit-request',
    title: 'Submit-request',
    loadComponent: () =>
      import('./user/submit-request/submit-request.component').then(
        (m) => m.SubmitRequestComponent
      ),
  },
  {
    path: 'request-status/:id',
    title: 'Request Status',
    loadComponent: () =>
      import('./user/request-status/request-status.component').then(
        (m) => m.RequestStatusComponent
      ),
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    title: 'Register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: '',
    redirectTo: '/requests',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
