import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
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
    SharedModule,
    CommonModule,
    PipeModule,
    NgScrollbarModule,
    BlockModule,
  ]
})
export class PageModule { }
