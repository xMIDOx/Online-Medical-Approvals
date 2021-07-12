import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { KeyValue } from 'src/app/models/key-value.model';

import { Register } from './../../../models/register.model';
import { Roles } from './../../../models/user-roles.enum';
import { AuthService } from './../../../services/auth.service';
import { LookupsService } from './../../../services/lookups.service';
import { UserRolesService } from './../../../services/user-roles.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  public roles$ = new Observable<KeyValue[]>();
  public providers$ = new Observable<Object>();
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
    private lookupService: LookupsService
  ) {}

  ngOnInit(): void {
    this.roles$ = this.userRolesService.getRoles();
  }

  signUp(form: NgForm) {
    if (form.valid) {
      this.userRegistration.email = form.value.email;
      this.userRegistration.password = form.value.password;
      this.userRegistration.confirmPassword = form.value.password;

      this.isLoading = true;
      this.authService.signup(this.userRegistration).subscribe(
        (res) => (this.isLoading = false),
        (err) => {
          console.log(err);
          this.error = err.error.message;
          this.isLoading = false;
        }
      );
    }
    form.reset();
    this.userRegistration.roles = [];
  }

  onRoleToggle(roleName: string, $event: any) {
    if ($event.target.checked) this.userRegistration.roles.push(roleName);
    else {
      const index = this.userRegistration.roles.indexOf(roleName);
      this.userRegistration.roles.splice(index, 1);
    }
  }

  fetchProviders(searchTerm: string) {
    this.queryObj.searchTerm = searchTerm;
    this.providers$ = this.lookupService.getProviders(this.queryObj);
  }

  selectedProvider(item: KeyValue) {
    this.userRegistration.providerId = item.id;
  }

  isProviderAdmin(): boolean {
    return this.userRegistration.roles.includes(this.rolesEnum.ProviderAdmin);
  }
}
