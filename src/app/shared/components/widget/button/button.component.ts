import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IButton } from 'src/app/model/widget.interface';
import { GlobalUtils } from 'src/app/utils/global.utils';

export type TDisplayType = 'icon' | 'original';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() widget: IButton | undefined;
  @Output() afterClicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
  @Input() badge: string | undefined;
  @Input() type: TDisplayType = 'original';
  @Input() activated: boolean = false;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  test() {
    this.cd.detectChanges();
  }

  get backgroundColor(): string {
    const opac = Math.round((this.widget?.backgroundOpacity || 0) * 255).toString(16).toUpperCase();
    const c = this.widget?.background + opac;
    return c;
  }


  onClick(event: MouseEvent): void {
    if (!this.widget?.linkedTo) { return; }
    this.afterClicked.emit(event);
  }
}
