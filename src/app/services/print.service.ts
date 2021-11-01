import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  public isPrinting = false;

  constructor(private router: Router) {}

  public printDocument(documentName: string, documentId: number): void {
    this.isPrinting = true;
    this.router.navigate([
      '/',
      { outlets: { print: ['print', documentName, documentId] } },
    ]);
  }

  public onDataReady(): void {
    window.print();
    this.isPrinting = false;
    this.router.navigate([{ outlets: { print: null } }]);
  }
}
