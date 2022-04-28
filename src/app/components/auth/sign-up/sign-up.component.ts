import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { KeyValue } from 'src/app/models/key-value.model';
import { Provider } from 'src/app/models/provider.model';

import { Branch } from './../../../models/branch.model';
import { Register } from './../../../models/register.model';
import { Roles } from './../../../models/user-roles.enum';
import { User } from './../../../models/user.model';
import { AuthService } from './../../../services/auth.service';
import { LookupsService } from './../../../services/lookups.service';
import { NotificationService } from './../../../services/notification.service';
import { OnlineLookupsService } from './../../../services/online-lookups.service';
import { UserRolesService } from './../../../services/user-roles.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  public roles$ = new Observable<KeyValue[]>();
  public providers$ = new Observable<Object>();
  public branches$ = new Observable<Branch[]>();
  public provider$ = new Observable<Provider>();
  public specialties$ = new Observable<KeyValue[]>();
  public branch = <Branch>{};
  public rolesEnum = Roles;
  public isLoading = false;
  public ngLoading = false;
  public error: string = '';
  public rolesWithProvierId = [Roles.Doctor.toString(), Roles.Receptionist.toString(), Roles.ProviderAdmin.toString()];
  public userRegistration: Register = {
    email: '',
    password: '',
    confirmPassword: '',
    providerId: 0,
    roles: [],
  };
  private queryObj: any = {};

  constructor(
    private authService: AuthService,
    private userRolesService: UserRolesService,
    private viewlookupService: LookupsService,
    private onLinelookupService: OnlineLookupsService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.getLoggedUser();
    this.getSpecialties();
  }

  public signUp(form: NgForm) {
    this.userRegistration.confirmPassword = form.value.password;
    this.isLoading = true;

    if (this.userRegistration.providerId == 0 && this.userRegistration.roles.includes(Roles.ProviderUser))
      this.notification.showError('The user has no assigned provider.');
    else this.registerUser(this.userRegistration);

    this.isLoading = false;
    form.reset();
    this.userRegistration.roles = [];
  }

  public getSpecialties() {
    this.specialties$ = this.onLinelookupService.getSpecialties();
  }

  public isSelected(role: string): boolean {
    return this.userRegistration.roles.includes(role);
  }

  public isAnySelected(roles: string[]): boolean {
    return this.userRegistration.roles.some(ur => roles.includes(ur));
  }

  public isLoggedUserRole(role: string): boolean {
    let result = false;
     this.authService.userToken$.pipe(take(1)).subscribe(res => {
      result =  res.roles.includes(role);
    });
    return result;
  }

  private getLoggedUser(): void {
    this.authService
      .getUser()
      .pipe(take(1))
      .subscribe((user: User) => {
        if (user.providerId != 0) {
          this.userRegistration.providerId = user.providerId;
          this.filterProviderAdminRoles();
        }
        else this.filterAdminRoles();
      });
  }

  private registerUser(user: Register): void {
    this.authService.signup(user).subscribe(
      () => (this.isLoading = false),
      (err) => (this.error = err.error.message)
    );
  }

  private filterAdminRoles() {
    this.roles$ = this.userRolesService.getRoles();
    // .pipe(
    //   map(roles => roles.filter(r => r.name === Roles.ProviderAdmin || r.name === Roles.CMCDoctor))
    //   );
  }

  private filterProviderAdminRoles() {
    this.roles$ = this.userRolesService.getRoles().pipe(
      map(roles => roles.filter(r => r.name === Roles.Doctor || r.name === Roles.Receptionist)));
  }

  //#region >> Provider Admin Registration Logic
  public addOrRemoveRoles(roleName: string, $event: any) {
    if ($event.target.checked) this.userRegistration.roles.push(roleName);
    else {
      const index = this.userRegistration.roles.indexOf(roleName);
      this.userRegistration.roles.splice(index, 1);
    }
  }

  public fetchProviders(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;
    this.ngLoading = true;
    // this.providers$ = this.lookupService.getProviders(this.queryObj);
    this.providers$ = this.onLinelookupService
      .getProviders(this.queryObj)
      .pipe(tap(() => (this.ngLoading = false)));
  }

  public selectedProvider(item: KeyValue) {
    this.userRegistration.providerId = item.id;
  }
  //#endregion

  //#region >> Provider User Registration Logic

  public OnBranchChange() {
    console.log(this.branch);
  }

  private providerUserRegistration(providerAdmin: User): void {
    this.userRegistration.providerId = providerAdmin.providerId;
    //this.userRegistration.roles.push(Roles.ProviderUser);
    //this.provider$ = this.viewlookupService.getProviderById(providerAdmin.providerId);
    //this.branches$ = this.viewlookupService.getBranches(providerAdmin.providerId);
  }
  //#endregion
}
