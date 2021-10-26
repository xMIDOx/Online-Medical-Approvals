import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approval-print-template',
  templateUrl: './approval-print-template.component.html',
  styleUrls: ['./approval-print-template.component.css'],
})
export class ApprovalPrintTemplateComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // this.print();
    // this.router.navigate([{ outlets: { print: null } }]);
  }

  private print(): void {
    window.print();
  }

  isLoaded(event: any) {
    if (event && event.target) this.print();
    this.router.navigate([{ outlets: { print: null } }]);
  }
}
