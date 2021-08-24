import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberComponent } from './number.component';



@NgModule({
  declarations: [
    NumberComponent,
  ],
  imports: [
    CommonModule,
  ], exports: [NumberComponent],
})
export class NumberModule { }
