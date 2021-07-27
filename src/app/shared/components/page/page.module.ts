import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlockModule } from '../block/block.module';
import { WidgetModule } from '../widget/widget.module';
import { PageComponent } from './page.component';
import { pageReducer } from './page.reducer';

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
    NgScrollbarModule,
    BlockModule,
    StoreModule.forFeature('page', pageReducer),
  ]
})
export class PageModule { }
