import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { KeyValue } from 'src/app/models/key-value.model';
import { Provider } from 'src/app/models/provider.model';

import { Branch } from './../../../models/branch.model';
import { Register } from './../../../models/register.model';
import { Roles } from './../../../models/user-roles.enum';
import { User } from './../../../models/user.model';
import { AuthService } from './../../../services/auth.service';
import { LookupsService } from './../../../services/lookups.service';
import { NotificationService } from './../../../services/notification.service';
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
  public branch = <Branch>{};
  public rolesEnum = Roles;
  public isLoading = false;
  public error: string = '';
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
    private lookupService: LookupsService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.getLoggedUser();
  }

  public signUp(form: NgForm) {
    this.userRegistration.email = form.value.email;
    this.userRegistration.password = form.value.password;
    this.userRegistration.confirmPassword = form.value.password;

    this.isLoading = true;
    if (this.userRegistration.providerId == 0)
      this.notification.showError('The user has no assigned provider.');
    else this.registerUser(this.userRegistration);
    this.isLoading = false;

    form.reset();
    this.userRegistration.roles = [];
  }

  private getLoggedUser(): void {
    this.authService
      .getUser()
      .pipe(take(1))
      .subscribe((user: User) => {
        if (user.providerId != 0) this.providerUserRegistration(user);
        else this.roles$ = this.userRolesService.getRoles();
      });
  }

  private registerUser(user: Register): void {
    this.authService.signup(user).subscribe(
      () => (this.isLoading = false),
      (err) => (this.error = err.error.message)
    );
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
    this.providers$ = this.lookupService.getProviders(this.queryObj);
  }

  public selectedProvider(item: KeyValue) {
    this.userRegistration.providerId = item.id;
  }

  public isProviderSelected(): boolean {
    return this.userRegistration.roles.includes(this.rolesEnum.ProviderAdmin);
  }
  //#endregion

  //#region >> Provider User Registration Logic
  public OnBranchChange() {
    console.log(this.branch);
  }

  private providerUserRegistration(providerAdmin: User): void {
    this.userRegistration.providerId = providerAdmin.providerId;
    this.userRegistration.roles.push(Roles.ProviderUser);
    this.provider$ = this.lookupService.getProviderById(
      providerAdmin.providerId
    );
    this.branches$ = this.lookupService.getBranches(providerAdmin.providerId);
  }
  //#endregion
}
