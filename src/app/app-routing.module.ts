import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateApprovalComponent } from './components/approval/create-approval/create-approval.component';
import {
  PendingApprovalDetailsComponent,
} from './components/cmc/pending-approval-details/pending-approval-details.component';
import { PendingApprovalsListComponent } from './components/cmc/pending-approvals-list/pending-approvals-list.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'create-approval', component: CreateApprovalComponent },
  { path: 'pending-approvals', component: PendingApprovalsListComponent },
  { path: 'pending-approval-details/:id', component: PendingApprovalDetailsComponent},
  { path: '404', component: NotFoundComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
