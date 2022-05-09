import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AdminEPrescription } from 'src/app/models/admin-e-prescription.model';
import { ClaimHolder } from 'src/app/models/claim-holder.model';
import { OnlineEntryType } from 'src/app/models/online-entry-type.enum';
import { Roles } from 'src/app/models/user-roles.enum';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

import { KeyValue } from './../../models/key-value.model';
import { User } from './../../models/user.model';
import { ClaimPhotoService } from './../../services/claim-photo.service';
import { OnlineLookupsService } from './../../services/online-lookups.service';

@Component({
  selector: 'app-e-prescription-form',
  templateUrl: './e-prescription-form.component.html',
  styleUrls: ['./e-prescription-form.component.css'],
})
export class EPrescriptionFormComponent implements OnInit {
  public adminEPrescription = <AdminEPrescription>{};
  public doctors$ = new Observable<User[]>();
  public clients$ = new Observable<KeyValue[]>();
  public claimHolder$ = new Observable<ClaimHolder>();
  public isExist = false;
  private user = <User>{};

  constructor(
    private authService: AuthService,
    private claimPhotoService: ClaimPhotoService,
    private lookupService: OnlineLookupsService,
    private notifyService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getDoctors();
  }

  public submitTicket(ticketFrom: NgForm): void {
    if (!ticketFrom.valid) return;

    this.claimPhotoService
      .createTicket(this.adminEPrescription)
      .subscribe(() => {
        ticketFrom.resetForm();
        this.notifyService.showSuccess('Ticket Submitted Successfully.');
      });
  }

  public getUser() {
    this.authService
      .getUser()
      .pipe(take(1))
      .subscribe((res) => {
        this.user = res;
        this.clients$ = this.lookupService.clientsByProviderId(res.providerId);
        this.fetchTicketMeta();
      });
  }

  public findMember(input: HTMLInputElement) {
    this.claimHolder$ = this.lookupService
      .claimHolderByCardNum(input.value)
      .pipe(
        tap((claimHolder) => {
          if (claimHolder) {
            this.isExist = true;
            this.adminEPrescription.claimHolderId = claimHolder.id;
            this.adminEPrescription.cardNumber = claimHolder.cardNumber;
            this.adminEPrescription.memberName = claimHolder.name;
            this.adminEPrescription.phoneNumber = claimHolder.phoneNumber;
          }
          console.log(claimHolder);
        })
      );
  }

  private getDoctors() {
    this.doctors$ = this.authService.getUsersByRoleId(
      Roles.DoctorId.toString()
    );
  }

  private fetchTicketMeta() {
    this.adminEPrescription.onlineEntryTypeId = OnlineEntryType.Ticket;
    this.adminEPrescription.providerId = this.user.providerId;
    this.adminEPrescription.providerAdminId = this.user.id;
    this.adminEPrescription.stampDate = new Date();
  }
}
