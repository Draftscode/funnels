import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewerRoutingModule } from './viewer-routing.module';
import { ViewerComponent } from './viewer.component';
import { PageModule } from '../page/page.module';


@NgModule({
  declarations: [
    ViewerComponent
  ],
  imports: [
    CommonModule,
    ViewerRoutingModule,
    PageModule,
  ]
})
export class ViewerModule { }
