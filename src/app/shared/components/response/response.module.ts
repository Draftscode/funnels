import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { ResponseDialogComponent } from './response.component';



@NgModule({
  declarations: [
    ResponseDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    TranslateModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatDividerModule,
  ],
  exports: [ResponseDialogComponent],
})
export class ResponseModule { }
