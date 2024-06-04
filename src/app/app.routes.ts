import { RequestStatusComponent } from './user/request-status/request-status.component';
import { SubmitRequestComponent } from './user/submit-request/submit-request.component';
import { ObjectsListComponent } from './manager/objects-list/objects-list.component';
import { RequestsListComponent } from './manager/requests-list/requests-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'requests', title: 'Requests', component: RequestsListComponent },
  { path: 'objects', title: 'Objects', component: ObjectsListComponent },
  { path: 'submit-request', title: 'Submit-request', component: SubmitRequestComponent },
  {path: 'request-status/:id', title: 'Request Status', component: RequestStatusComponent},
  { path: '',   redirectTo: '/requests', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
