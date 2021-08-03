import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { IWidget } from 'src/app/model/widget.interface';
import { PageService } from 'src/app/services/page.service';
import { IPage } from '../page/page.interface';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit, OnDestroy, OnChanges {
  @Input() widget: IWidget | undefined;
  @Output() afterClicked: EventEmitter<void> = new EventEmitter<void>();
  private alive: boolean = true;
  pages: Record<string, IPage> = {};

  constructor(private pageApi: PageService) {
    this.pageApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IPage>) => this.pages = items);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
  }

  onDoubleClick(event: MouseEvent, widget: IWidget): void {
    widget.editable = true;
  }

  storeIt(widget: IWidget, value: any): void {
    widget.text = value;
    widget.editable = false;
  }

  dragEnter(event: any): void {
  }

  onClick(event: MouseEvent): void {
    if (!this.widget?.linkedTo) { return; }
    this.afterClicked.emit();
  }
}
