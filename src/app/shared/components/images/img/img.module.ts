import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgComponent } from './img.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ImgComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports:[ImgComponent],
})
export class ImgModule { }
