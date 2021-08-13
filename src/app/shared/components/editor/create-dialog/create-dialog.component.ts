import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EWidgetType } from 'src/app/model/widget-type.enum';
import { IButton, ICalendar, ISubscriptionForm, IText, IWidget, TWidgetType } from 'src/app/model/widget.interface';
import { GlobalUtils } from 'src/app/utils/global.utils';
import { IBlock } from '../block.interface';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<CreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { block: IBlock },
  ) { }

  ngOnInit(): void {
  }

  close(type: string | undefined = undefined): void {
    if (!type) { this.dialogRef.close(); return; }

    const index: number = Object.keys(this.data?.block?.widgets || {}).length;
    const w: IWidget = this.createtWidget(type, this.getDefaultText(type), index);

    this.dialogRef.close({ widget: w });
  }

  private createtWidget(type: string, text: string, index: number): TWidgetType | IWidget {
    const w: IWidget = {
      id: GlobalUtils.uuidv4(),
      type: EWidgetType.SUBSRIPTION_FORM,
      text: text,
      index: index,
      backgroundOpacity: 1,
      imageOpacity: 1,
    };

    switch (type) {
      case EWidgetType.SUBSRIPTION_FORM:
        const s: ISubscriptionForm = {
          ...w,
          kind: 'subscription',
          mail: true,
          phone: true,
          name: true,
        };
        return s;
      case EWidgetType.CALENDAR:
        const c: ICalendar = {
          ...w,
          kind: 'calendar',
        };
        return c;

      case EWidgetType.BUTTON:
        const b: IButton = {
          ...w,
          kind: 'button',
        };
        return b;

      case EWidgetType.TEXT:
        const t: IText = {
          ...w,
          kind: 'text',
        };
        return t;
    }

    return w;
  }

  private getDefaultText(type: string): string {
    switch (type) {
      case EWidgetType.TEXT:
        return 'Neuer Text';
      case EWidgetType.BUTTON:
        return 'Neuer Button';
    }
    return '';
  }
}
