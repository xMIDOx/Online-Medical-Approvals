import { NgModule } from '@angular/core';
import { CanActivate, RouterModule, Routes } from '@angular/router';

import { CreateApprovalComponent } from './components/approval/create-approval/create-approval.component';
import { LogInComponent } from './components/auth/log-in/log-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import {
  PendingApprovalDetailsComponent,
} from './components/cmc/pending-approval-details/pending-approval-details.component';
import { PendingApprovalsListComponent } from './components/cmc/pending-approvals-list/pending-approvals-list.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './models/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'log-in', component: LogInComponent },
  { path: 'sign-up', component: SignUpComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'create-approval', component: CreateApprovalComponent, canActivate: [AuthGuard] },
  { path: 'pending-approvals', component: PendingApprovalsListComponent, canActivate: [AuthGuard] },
  { path: 'pending-approval-details/:id', component: PendingApprovalDetailsComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
