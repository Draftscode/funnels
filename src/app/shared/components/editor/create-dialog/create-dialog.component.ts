import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EWidgetType } from 'src/app/model/widget-type.enum';
import { IWidget } from 'src/app/model/widget.interface';
import { GlobalUtils } from 'src/app/utils/global.utils';

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
  }];

  constructor(private dialogRef: MatDialogRef<CreateDialogComponent>) { }

  ngOnInit(): void {
  }

  close(btn: IButton): void {
    const widget: IWidget = {
      id: GlobalUtils.uuidv4(),
      type: btn.type,
      text: '',
    };
    this.dialogRef.close({
      widget,
    });
  }
}
