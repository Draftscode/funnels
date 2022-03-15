import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TWidgetType } from 'src/app/model/widget.interface';
import { IPage } from '../page/page.interface';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent {
  @Input() widget: TWidgetType | undefined;
  @Output() afterClicked: EventEmitter<void> = new EventEmitter<void>();
  @Input() activated: boolean = false;
  @Output('afterChanges') afterChanges: EventEmitter<Record<string, any>> = new EventEmitter<Record<string, any>>();
  @Input() pages: Record<string, IPage> = {};
  @Input() mode: 'viewer' | 'editor' = 'editor';

  constructor() {
  }

  afterChanged(event: Record<string, any>): void {
    this.afterChanges.emit(event);
  }

  storeIt(widget: TWidgetType, value: any): void {
    widget.text = value;
  }

  onClick(event: MouseEvent): void {
    this.afterClicked.emit();
  }
}
