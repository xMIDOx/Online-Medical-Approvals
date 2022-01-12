import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { KeyValue } from 'src/app/models/key-value.model';

@Component({
  selector: 'app-ng-select',
  templateUrl: './ng-select.component.html',
  styleUrls: ['./ng-select.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
})
export class NgSelectComponent implements OnInit, OnChanges {
  @Input() id!: string;
  @Input() name!: string;
  @Input() items: any;
  @Input() isLoading = false;
  public selectedItem: any;

  @Output() searching = new EventEmitter<string>();
  @Output() onSelecting = new EventEmitter<any>();
  @ViewChild('ngSelectControl') ngSelectControl: any;

  public itemsBuffer: KeyValue[] = [];
  private bufferSize = 50;
  private fetchMoreAfter = 10;

  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // changes.items.currentValue && changes.items.currentValue.length > 0
    if (this.items) {
      this.itemsBuffer = this.items.slice(0, this.bufferSize);
    }
  }

  public onScroll(event: any) {
    if (
      !this.items ||
      this.isLoading ||
      this.items.length <= this.itemsBuffer.length
    )
      return;
    if (event.end + this.fetchMoreAfter >= this.itemsBuffer.length)
      this.fetchMore();
  }

  public onScrollToEnd() {
    this.fetchMore();
  }

  public onSearch(event: any) {
    event.term.length == 3
      ? this.searching.emit(event.term as string)
      : this.fetchMore();
  }

  public onChange(selection: any) {
    this.onSelecting.emit(selection);
  }

  private fetchMore() {
    if (this.items == null) return;

    const length = this.itemsBuffer.length;
    const more = this.items.slice(length, this.bufferSize + length);
    this.isLoading = true;
    this.itemsBuffer = this.itemsBuffer.concat(more);
    this.isLoading = false;
  }

  public clear() {
    this.ngSelectControl.handleClearClick();
  }

  public compareFn(item: any, selected: any): boolean {
    return item.value === selected.value;
  }
}
