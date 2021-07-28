import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IWidget } from 'src/app/model/widget.interface';



@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {
  widget: IWidget;

  constructor(private dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { widget: IWidget },
  ) {
    this.widget = this.data.widget;
  }

  ngOnInit(): void {
  }

  close(widget: IWidget | undefined = undefined): void {
    if (!widget) {
      this.dialogRef.close();
      return;
    }

    this.dialogRef.close(widget);
  }
}
