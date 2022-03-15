import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { PipeModule } from '../../pipes/pipe.module';
import { BlockModule } from '../block/block.module';
import { WidgetModule } from '../widget/widget.module';
import { PageComponent } from './page.component';

@NgModule({
  declarations: [PageComponent],
  exports: [
    PageComponent,
    BlockModule,
    WidgetModule,
  ],
  imports: [
    CommonModule,
    PipeModule,
    NgScrollbarModule,
    BlockModule,
  ]
})
export class PageModule { }
