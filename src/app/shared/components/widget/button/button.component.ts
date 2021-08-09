import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IWidget } from 'src/app/model/widget.interface';

export type TDisplayType = 'icon' | 'original';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() widget: IWidget | undefined;
  @Output() afterClicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  @Input() badge: string | undefined;
  @Input() type: TDisplayType = 'original';

  constructor() { }

  ngOnInit(): void {
  }

  onClick(event: MouseEvent): void {
    if (!this.widget?.linkedTo) { return; }
    this.afterClicked.emit(event);
  }
}
