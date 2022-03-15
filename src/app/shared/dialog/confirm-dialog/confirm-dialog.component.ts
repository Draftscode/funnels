import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogResultType } from '../dialog-result.interface';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    private dialog: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; text: { value: string, params: Record<string, any> }; },
  ) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialog.close({ type: DialogResultType.CANCEL });
  }

  confirm(): void {
    this.dialog.close({ type: DialogResultType.CONFIRM });
  }
}
