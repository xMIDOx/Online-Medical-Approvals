import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApprovalPrintTemplateComponent } from './components/approval-print-template/approval-print-template.component';
import { CreateApprovalComponent } from './components/approval/create-approval/create-approval.component';
import { LogInComponent } from './components/auth/log-in/log-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { ClaimPhotoDetailsComponent } from './components/claim-photo-details/claim-photo-details.component';
import { ClaimPhotoListComponent } from './components/claim-photo-list/claim-photo-list.component';
import { ClaimPhotoComponent } from './components/claim-photo/claim-photo.component';
import { ClaimPrintTemplateComponent } from './components/claim-print-template/claim-print-template.component';
import {
  PendingApprovalDetailsComponent,
} from './components/cmc/pending-approval-details/pending-approval-details.component';
import { PendingApprovalsListComponent } from './components/cmc/pending-approvals-list/pending-approvals-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EPrescriptionFormComponent } from './components/e-prescription-form/e-prescription-form.component';
import { EditClaimPhotoComponent } from './components/edit-claim-photo/edit-claim-photo.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PrintLayoutComponent } from './components/print-layout/print-layout.component';
import { TicketsListComponent } from './components/tickets-list/tickets-list.component';
import { AuthGuard } from './models/auth.guard';
import { Roles } from './models/user-roles.enum';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },

  {
    path: 'log-in',
    component: LogInComponent,
  },

  {
    path: 'claim-photo',
    component: ClaimPhotoComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'e-prescription',
    component: EPrescriptionFormComponent,
    canActivate: [AuthGuard],
    data: { roles: [Roles.Receptionist] },
  },

  {
    path: 'pending-tickets',
    component: TicketsListComponent,
    canActivate: [AuthGuard],
    data: {roles: [Roles.Receptionist, Roles.Doctor]}
  },

  {
    path: 'claim-photo-details/:id',
    component: ClaimPhotoDetailsComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'Edit-claim-photo/:id',
    component: EditClaimPhotoComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [AuthGuard],
    data: { roles: [Roles.Admin, Roles.ProviderAdmin] },
  },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'print',
    outlet: 'print',
    component: PrintLayoutComponent,
    children: [
      { path: 'approval/:id', component: ApprovalPrintTemplateComponent },
      { path: 'claim/:id', component: ClaimPrintTemplateComponent },
    ],
  },

  {
    path: 'test/:id',
    component: ClaimPrintTemplateComponent,
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [{ path: 'claims/posted', component: ClaimPhotoListComponent }],
  },

  {
    path: 'create-approval',
    component: CreateApprovalComponent,
    canActivate: [AuthGuard],
    data: { roles: [Roles.ProviderUser] },
  },

  {
    path: 'pending-approvals',
    component: PendingApprovalsListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Roles.CMCDoctor, Roles.ProviderUser] },
  },

  {
    path: 'pending-approval-details/:id',
    component: PendingApprovalDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Roles.CMCDoctor, Roles.ProviderUser] },
  },

  {
    path: 'forbidden',
    component: ForbiddenComponent,
    canActivate: [AuthGuard],
  },

  {
    path: '404',
    component: NotFoundComponent,
  },

  {
    path: '**',
    redirectTo: '/404',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
