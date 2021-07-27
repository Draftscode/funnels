import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CreateDialogComponent } from './create-dialog.component';



@NgModule({
  declarations: [
    CreateDialogComponent
  ],
  exports: [CreateDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class CreateDialogModule { }
