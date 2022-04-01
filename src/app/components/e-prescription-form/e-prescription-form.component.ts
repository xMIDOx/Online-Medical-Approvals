import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminEPrescription } from 'src/app/models/admin-e-prescription.model';

import { ClaimPhotoService } from './../../services/claim-photo.service';

@Component({
  selector: 'app-e-prescription-form',
  templateUrl: './e-prescription-form.component.html',
  styleUrls: ['./e-prescription-form.component.css'],
})
export class EPrescriptionFormComponent implements OnInit {
  public adminEPrescription = <AdminEPrescription>{};

  constructor(private claimPhotoService: ClaimPhotoService) {}

  ngOnInit(): void {}

  public submitTicket(ticketFrom: NgForm): void {
    if (!ticketFrom.valid) return;

    this.adminEPrescription.providerAdminId = "feac9c1d-1ca4-4544-adf3-d65c7a2bfe51"; // at login
    this.adminEPrescription.clientId = 4; // at login
    this.adminEPrescription.providerId = 2; // at login
    this.adminEPrescription.doctorId = "ffa6a104-a86f-48e1-a48b-549c1e4b28d5"; // DDL
    this.adminEPrescription.stampDate = new Date();
    this.adminEPrescription.onlineEntryTypeId = 2;

    this.claimPhotoService
      .createTicket(this.adminEPrescription)
      .subscribe((res) => {
        console.log(res);
        ticketFrom.resetForm();
      });

    // ticketFrom.reset();
  }
}
