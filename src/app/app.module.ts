import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';

import { AppErrorhandler } from './app-error-handler';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateApprovalItemsComponent } from './components/approval/create-approval-items/create-approval-items.component';
import { CreateApprovalComponent } from './components/approval/create-approval/create-approval.component';
import { LogInComponent } from './components/auth/log-in/log-in.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';
import {
  PendingApprovalDetailsComponent,
} from './components/cmc/pending-approval-details/pending-approval-details.component';
import { PendingApprovalsListComponent } from './components/cmc/pending-approvals-list/pending-approvals-list.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { HomeComponent } from './components/home/home.component';
import { LoadingOrErrorComponent } from './components/loading-or-error/loading-or-error.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgSelectComponent } from './components/ng-select/ng-select.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoadingSpinner } from './models/loading-spinner.pipe';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { NotificationService } from './services/notification.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BsModalComponent } from './components/bs-modal/bs-modal.component';
import { DisplayApprovalItemsComponent } from './components/display-approval-items/display-approval-items.component';
import { DisplayApprovalsListComponent } from './components/display-approvals-list/display-approvals-list.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    NgSelectModule,
    CommonModule,
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
