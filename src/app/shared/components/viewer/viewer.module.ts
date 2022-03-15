import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewerRoutingModule } from './viewer-routing.module';
import { ViewerComponent } from './viewer.component';
import { PageModule } from '../page/page.module';
import { ViewerService } from './viewer.service';


@NgModule({
  declarations: [
    ViewerComponent
  ],
  imports: [
    CommonModule,
    ViewerRoutingModule,
    PageModule,
  ],
  providers: [],
})
export class ViewerModule { }
