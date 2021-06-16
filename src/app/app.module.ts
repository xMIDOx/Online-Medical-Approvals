import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateApprovalItemsComponent } from './components/approval/create-approval-items/create-approval-items.component';
import { CreateApprovalComponent } from './components/approval/create-approval/create-approval.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgSelectComponent } from './components/ng-select/ng-select.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PendingApprovalsListComponent } from './components/cmc/pending-approvals-list/pending-approvals-list.component';
import { PendingApprovalDetailsComponent } from './components/cmc/pending-approval-details/pending-approval-details.component';

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
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
