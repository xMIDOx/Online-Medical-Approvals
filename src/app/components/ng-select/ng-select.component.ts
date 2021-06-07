import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { KeyValue } from 'src/app/models/key-value.model';

@Component({
  selector: 'app-ng-select',
  templateUrl: './ng-select.component.html',
  styleUrls: ['./ng-select.component.css'],
})
export class NgSelectComponent implements OnInit, OnChanges {
  @Input() items: KeyValue[] = [];
  @Output() searching = new EventEmitter<string>();
  @Output() selectedItem = new EventEmitter<KeyValue>();

  public itemsBuffer: KeyValue[] = [];
  public loading = false;

  private bufferSize = 50;
  private fetchMoreAfter = 10;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.itemsBuffer = this.items.slice(0, this.bufferSize);
  }

  public onScroll(event: any) {
    if (this.loading || this.items.length <= this.itemsBuffer.length) return;
    if (event.end + this.fetchMoreAfter >= this.itemsBuffer.length)
      this.fetchMore();
  }

  public onScrollToEnd() {
    this.fetchMore();
  }

  public onSearch(event: any) {
    if (event.term.length == 3) this.searching.emit(event.term as string);
    if (event.term.length > 3) this.fetchMore();
  }

  public onChange(item: KeyValue) {
    this.selectedItem.emit(item);
  }

  private fetchMore() {
    const length = this.itemsBuffer.length;
    const more = this.items.slice(length, this.bufferSize + length);
    this.loading = true;
    this.itemsBuffer = this.itemsBuffer.concat(more);
    this.loading = false;
  }
}
