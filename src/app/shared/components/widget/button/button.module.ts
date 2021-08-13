import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PipeModule } from 'src/app/shared/pipes/pipe.module';
import { ImgModule } from '../../images/img/img.module';
import { ButtonComponent } from './button.component';



@NgModule({
  declarations: [
    ButtonComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    PipeModule,
    ImgModule,
  ],
  exports: [
    ButtonComponent,
  ],
})
export class ButtonModule { }
