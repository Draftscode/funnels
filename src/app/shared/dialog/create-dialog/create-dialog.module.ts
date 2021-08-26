import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CreateDialogComponent } from './create-dialog.component';



@NgModule({
  declarations: [CreateDialogComponent],
  exports: [CreateDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    MatGridListModule,
  ]
})
export class CreateDialogModule { }
