import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Medicine } from 'src/app/models/medicine';
import { ServiceTypes } from 'src/app/models/service-type.enum';

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
  public medicalTests$ = new Observable<object>();
  public queryObj: any = {};
  public photoServices: PhotoService[] = [];
  public selectedService = <PhotoService>{};
  public isActiveRow = false;
  public activeRowIndex = -1 ;

  constructor(
    private route: ActivatedRoute,
    private claimPhotoService: ClaimPhotoService,
    private onlineLookups: OnlineLookupsService
  ) {}

  ngOnInit(): void {
    this.photoId = this.route.snapshot.params['id'];

    if (this.photoId) {
      this.claimPhotoService
      .getClaimPhoto(this.photoId)
      .subscribe((res) => (this.photo = res));
    }
  }

  public onSubmit(claimForm: NgForm) {

    this.claimPhoto.claimPhotoDetails = this.photoServices;
    this.claimPhoto.clientId = this.photo.clientId;
    this.claimPhoto.onlineStatusId = 1005;

    this.claimPhotoService.updateClaimPhoto(this.photoId, this.claimPhoto)
    .subscribe(res => console.log(res));
  }

  public getICDCodes(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;
    this.isLoading = true;

    this.icdCodes$ = this.onlineLookups
      .getICDCodes(this.queryObj)
      .pipe(tap(() => (this.isLoading = false)));
  }

  public selectedDiagnosis(diagnosis: KeyValue) {
    this.claimPhoto.icdCodeId = diagnosis.id;
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

  public getMedicalTests(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;
    this.isLoading = true;

    this.medicalTests$ = this.onlineLookups
      .GetMedicalServices(this.queryObj)
      .pipe(tap(() => (this.isLoading = false)));
  }

  public getSelectedService(service: PhotoService) {
    this.selectedService = service;
  }

  public addNewMedicine() {
    let _medicine = <PhotoService>{};
    _medicine.serviceTypeId = ServiceTypes.Medication;

    this.activeRowIndex = this.photoServices.push(_medicine) - 1;
    this.isActiveRow = true;
  }

  public addNewScan() {
    let _scan = <PhotoService>{};
    _scan.serviceTypeId = ServiceTypes.Scan;

    this.activeRowIndex = this.photoServices.push(_scan) - 1;
    this.isActiveRow = true;
  }

  public addNewTest() {
    let _test = <PhotoService>{};
    _test.serviceTypeId = ServiceTypes.Lab;

    this.activeRowIndex = this.photoServices.push(_test) - 1;
    this.isActiveRow = true;
  }

  public saveItem(service: PhotoService) {
    const index = this.photoServices.indexOf(service);
    this.photoServices[index] = Object.assign({}, this.selectedService);
    this.resetObj(this.selectedService);
    this.isActiveRow = false;
    this.activeRowIndex = -1;
  }

  public deleteItem(service: PhotoService) {
    const index = this.photoServices.indexOf(service);
    this.photoServices.splice(index, 1);
  }

  public isEditMode(service: PhotoService): boolean {
    const index = this.photoServices.indexOf(service);
    return this.isActiveRow && this.activeRowIndex == index;
  }

  public filterScans(): PhotoService[] {
    return this.photoServices.filter(s => s.serviceTypeId == ServiceTypes.Scan);
  }

  public filterMedications(): PhotoService[] {
    return this.photoServices.filter(s => s.serviceTypeId == ServiceTypes.Medication);
  }

  public filterMedicalTests(): PhotoService[] {
    return this.photoServices.filter(s => s.serviceTypeId == ServiceTypes.Lab);
  }

  private resetObj(obj: any) {
    var props = Object.getOwnPropertyNames(obj);
    for (var i = 0; i < props.length; i++) {
      delete obj[props[i]];
    }
  }
}
