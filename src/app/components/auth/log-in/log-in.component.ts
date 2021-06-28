import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
})
export class LogInComponent implements OnInit {
  public isLoading = false;
  public error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.authService.login(form.value)
      .subscribe(
        (res) => {
          console.log(res);
          this.isLoading = false;
          this.router.navigate(['/create-approval']);
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
