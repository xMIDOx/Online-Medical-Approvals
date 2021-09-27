import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-bs-modal',
  templateUrl: './bs-modal.component.html',
  styleUrls: ['./bs-modal.component.css'],
})
export class BsModalComponent implements OnInit {
  @Input() title: string = '';
  @Input() id: string = '';
  @Input() cssClass: string = '';
  @Input() fullScreen = false;
  @ViewChild('closeBtn') closeBtn!: ElementRef;
  public modalSize!: 'modal-lg' | 'modal-fullscreen';


  constructor() {}

  ngOnInit(): void {
    this.fullScreen
      ? (this.modalSize = 'modal-fullscreen')
      : (this.modalSize = 'modal-lg');
  }
}
