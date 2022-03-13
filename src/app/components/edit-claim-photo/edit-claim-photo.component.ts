import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Medicine } from 'src/app/models/medicine';

import { PhotoService } from '../../models/photo-Service';
import { environment } from './../../../environments/environment';
import { EditClaimPhoto } from './../../models/edit-claim-photo';
import { KeyValue } from './../../models/key-value.model';
import { ClaimPhotoService } from './../../services/claim-photo.service';
import { OnlineLookupsService } from './../../services/online-lookups.service';

@Component({
  selector: 'app-edit-claim-photo',
  templateUrl: './edit-claim-photo.component.html',
  styleUrls: ['./edit-claim-photo.component.css'],
})
export class EditClaimPhotoComponent implements OnInit {
  public envUrl = environment.urlAddress;
  public photo: any;
  public claimPhoto = <EditClaimPhoto>{};
  public photoId: number = 0;
  public isLoading = false;
  public icdCodes$ = new Observable<object>();
  public medications$ = new Observable<object>();
  public medicalServices$ = new Observable<object>();

  public queryObj: any = {};

  public photoServices: PhotoService[] = [];
  public selectedService = <PhotoService>{};
  public photoMedications: PhotoService[] = [];
  public isActiveRow = false;
  public activeRowIndex = -1 ;

  constructor(
    private route: ActivatedRoute,
    private photoService: ClaimPhotoService,
    private onlineLookups: OnlineLookupsService
  ) {}

  ngOnInit(): void {
    this.photoId = this.route.snapshot.params['id'];

    this.photoService
      .getClaimPhoto(this.photoId)
      .subscribe((res) => (this.photo = res));
  }

  public onSubmit(claimForm: NgForm) {
    console.log(claimForm.value);
    //this.photoService.updateClaimPhoto(this.photoId, this.claimPhoto);
  }

  public getICDCodes(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;
    this.isLoading = true;

    this.icdCodes$ = this.onlineLookups
      .getICDCodes(this.queryObj)
      .pipe(tap(() => (this.isLoading = false)));
  }

  public selectedDiagnosis(diagnosis: KeyValue) {
    console.log('selected Diagnosis', diagnosis);
  }

  public getMedications(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;
    this.isLoading = true;

    this.medications$ = this.onlineLookups
      .getMedications(this.queryObj)
      .pipe(tap(() => (this.isLoading = false)));
  }

  public getMedicalServices(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;
    this.isLoading = true;

    this.medicalServices$ = this.onlineLookups
      .GetMedicalServices(this.queryObj)
      .pipe(tap(() => (this.isLoading = false)));
  }

  public getSelectedMedicine(medicine: PhotoService) {
    this.selectedService = medicine;
  }

  public addNewRow() {
    this.activeRowIndex = this.photoMedications.push(<PhotoService>{}) - 1;
    this.isActiveRow = true;
  }

  public saveItem(index: number) {
    this.photoMedications[index] = Object.assign({}, this.selectedService);
    this.resetObj(this.selectedService);
    this.isActiveRow = false;
    this.activeRowIndex = -1;
  }

  public deleteItem(index: number) {
    this.photoMedications.splice(index, 1);
  }

  public isEditMode(index: number): boolean {
    return this.isActiveRow && this.activeRowIndex == index;
  }

  private resetObj(obj: any) {
    var props = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < props.length; i++) {
      delete obj[props[i]];
    }
  }
}
