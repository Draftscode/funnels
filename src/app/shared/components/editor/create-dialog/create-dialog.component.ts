import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EWidgetType } from 'src/app/model/widget-type.enum';
import { IWidget } from 'src/app/model/widget.interface';
import { GlobalUtils } from 'src/app/utils/global.utils';
import { IBlock } from '../block.interface';

interface IButton {
  name: string;
  icon: string;
  type: EWidgetType;
}

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {
  buttons: IButton[] = [{
    name: 'Text',
    icon: 'font_download',
    type: EWidgetType.TEXT,
  }, {
    icon: 'smart_button',
    type: EWidgetType.BUTTON,
    name: 'Button'
  }, {
    type: EWidgetType.CALENDAR,
    icon: 'event',
    name: 'Kalender'
  },{
    type: EWidgetType.SUBSRIPTION_FORM,
    icon: 'view_agenda',
    name: 'Subscription Form'
  }];

  constructor(
    private dialogRef: MatDialogRef<CreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { block: IBlock },
  ) { }

  ngOnInit(): void {
  }

  close(btn: IButton | undefined = undefined): void {
    if (!btn) { this.dialogRef.close(); return; }

    const index: number = Object.keys(this.data?.block?.widgets || {}).length;

    const widget: IWidget = {
      id: GlobalUtils.uuidv4(),
      type: btn.type,
      text: this.getDefaultText(btn.type),
      index,
    };

    this.dialogRef.close({
      widget,
    });
  }

  private getDefaultText(type: EWidgetType): string {
    switch (type) {
      case EWidgetType.TEXT:
        return 'Neuer Text';
      case EWidgetType.BUTTON:
        return 'Neuer Button';
    }
    return '';
  }
}
