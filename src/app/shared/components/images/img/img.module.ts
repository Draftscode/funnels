import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from 'src/app/shared/directives/directive.module';
import { ImgComponent } from './img.component';



@NgModule({
  declarations: [
    ImgComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    DirectivesModule,
  ],
  exports: [ImgComponent],
})
export class ImgModule { }
