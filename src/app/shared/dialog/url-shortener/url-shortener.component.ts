import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogResultType } from '../dialog-result.interface';

@Component({
  selector: 'app-url-shortener',
  templateUrl: './url-shortener.component.html',
  styleUrls: ['./url-shortener.component.scss']
})
export class UrlShortenerComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private dialog: MatDialogRef<UrlShortenerComponent>) {
    this.formGroup = new FormGroup({
      url: new FormControl('URL', Validators.required),
    });
  }

  confirm(): void {
    this.dialog.close({ type: DialogResultType.CONFIRM });
  }

  ngOnInit(): void {
  }

}
