import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { TranslateModule } from '@ngx-translate/core';
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
    ImgModule,
    TranslateModule,
    MatGridListModule,
    WidgetModule,
    PipeModule,
  ]
})
export class BlockModule { }
