import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { TWidgetType } from 'src/app/model/widget.interface';
import { PageService } from 'src/app/services/page.service';
import { IPage } from '../page/page.interface';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnDestroy {
  @Input() widget: TWidgetType | undefined;
  @Output() afterClicked: EventEmitter<void> = new EventEmitter<void>();
  @Input() activated: boolean = false;
  @Output('afterChanges') afterChanges: EventEmitter<Record<string, any>> = new EventEmitter<Record<string, any>>();
  private alive: boolean = true;
  pages: Record<string, IPage> = {};
  @Input() mode: 'viewer' | 'editor' = 'editor';

  constructor(private pageApi: PageService) {
    this.pageApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IPage>) => this.pages = items);
  }

  afterChanged(event: Record<string, any>): void {
    this.afterChanges.emit(event);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  storeIt(widget: TWidgetType, value: any): void {
    widget.text = value;
  }

  onClick(event: MouseEvent): void {
    this.afterClicked.emit();
  }
}
