import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'OnlinePortal-WebUI';

  constructor(private authService: AuthService, private location: Location){}

  ngOnInit(): void {
    this.authService.autoLogin();
  }

  goBack() {
    this.location.back();
  }
}
