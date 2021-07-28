import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlockComponent } from './block.component';
import { WidgetModule } from '../widget/widget.module';
import { PipeModule } from '../../pipes/pipe.module';



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
    WidgetModule,
    PipeModule,
  ]
})
export class BlockModule { }
