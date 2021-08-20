import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewComponent } from './preview.component';
import { PageModule } from '../../page/page.module';
import { BlockModule } from '../../block/block.module';
import { WidgetModule } from '../../widget/widget.module';



@NgModule({
  declarations: [
    PreviewComponent
  ],
  imports: [
    CommonModule,
    PageModule,
    BlockModule,
    WidgetModule,
  ],
  exports: [PreviewComponent],
})
export class PreviewModule { }
