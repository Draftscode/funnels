import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipeModule } from '../../pipes/pipe.module';
import { ImgModule } from '../images/img/img.module';
import { WidgetModule } from '../widget/widget.module';
import { BlockComponent } from './block.component';



@NgModule({
  declarations: [
    BlockComponent,
  ],
  exports: [
    BlockComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ImgModule,
    WidgetModule,
    PipeModule,
  ]
})
export class BlockModule { }
