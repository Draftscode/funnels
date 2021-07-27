import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IWidget } from 'src/app/model/widget.interface';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
  @Input() widget: IWidget | undefined;
  @Output() afterClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

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
