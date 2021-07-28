import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateDialogComponent } from './create-dialog.component';



@NgModule({
  declarations: [CreateDialogComponent],
  exports: [CreateDialogComponent],
  imports: [
    SharedModule,
    CommonModule,
  ]
})
export class CreateDialogModule { }
