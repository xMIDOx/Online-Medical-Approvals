import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';

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
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgSelectComponent } from './components/ng-select/ng-select.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';


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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    NgSelectModule,
    CommonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
