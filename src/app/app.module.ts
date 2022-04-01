import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTablesModule } from 'angular-datatables';
import { ToastrModule } from 'ngx-toastr';

import { AppErrorhandler } from './app-error-handler';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApprovalPrintTemplateComponent } from './components/approval-print-template/approval-print-template.component';
import { CreateApprovalItemsComponent } from './components/approval/create-approval-items/create-approval-items.component';
import { CreateApprovalComponent } from './components/approval/create-approval/create-approval.component';
import { LogInComponent } from './components/auth/log-in/log-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import { BsModalComponent } from './components/bs-modal/bs-modal.component';
import {
  PendingApprovalDetailsComponent,
} from './components/cmc/pending-approval-details/pending-approval-details.component';
import { PendingApprovalsListComponent } from './components/cmc/pending-approvals-list/pending-approvals-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DisplayApprovalItemsComponent } from './components/display-approval-items/display-approval-items.component';
import { DisplayApprovalsListComponent } from './components/display-approvals-list/display-approvals-list.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { HomeComponent } from './components/home/home.component';
import { LoadingOrErrorComponent } from './components/loading-or-error/loading-or-error.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgSelectComponent } from './components/ng-select/ng-select.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PrintLayoutComponent } from './components/print-layout/print-layout.component';
import { MaxApprovalAmtDirective } from './custom/directives/max-approval-amt.directive';
import { LoadingSpinner } from './models/loading-spinner.pipe';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { ClaimPhotoComponent } from './components/claim-photo/claim-photo.component';
import { EditClaimPhotoComponent } from './components/edit-claim-photo/edit-claim-photo.component';
import { ClaimPhotoListComponent } from './components/claim-photo-list/claim-photo-list.component';
import { ClaimPhotoDetailsComponent } from './components/claim-photo-details/claim-photo-details.component';
import { ClaimPrintTemplateComponent } from './components/claim-print-template/claim-print-template.component';
import { EPrescriptionFormComponent } from './components/e-prescription-form/e-prescription-form.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    NotFoundComponent,
    CreateApprovalComponent,
    CreateApprovalItemsComponent,
    NgSelectComponent,
    PendingApprovalsListComponent,
    PendingApprovalDetailsComponent,
    SignUpComponent,
    LogInComponent,
    ForbiddenComponent,
    LoadingSpinner,
    LoadingOrErrorComponent,
    DashboardComponent,
    BsModalComponent,
    DisplayApprovalItemsComponent,
    DisplayApprovalsListComponent,
    ApprovalPrintTemplateComponent,
    PrintLayoutComponent,
    MaxApprovalAmtDirective,
    ClaimPhotoComponent,
    EditClaimPhotoComponent,
    ClaimPhotoListComponent,
    ClaimPhotoDetailsComponent,
    ClaimPrintTemplateComponent,
    EPrescriptionFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    NgSelectModule,
    CommonModule,
    DataTablesModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      countDuplicates: true,
      closeButton: true,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: ErrorHandler, useClass: AppErrorhandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
