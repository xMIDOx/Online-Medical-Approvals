import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from './../../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  public isLoading = false;
  public error: string = '';
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  signUp(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.authService.signup(form.value).subscribe(
        (res) => {
          console.log(res);
          this.isLoading = false;
        },
        (err) => {
          console.log(err);
          this.error = err.error.message;
          this.isLoading = false;
        }
      );
    }
    form.reset();
  }
}
