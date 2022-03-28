import { Component, OnInit } from '@angular/core';

import { PrintService } from './../../services/print.service';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.css'],
})
export class PrintLayoutComponent implements OnInit {
  public date = Date.now();

  constructor() {}

  ngOnInit(): void {}
}
