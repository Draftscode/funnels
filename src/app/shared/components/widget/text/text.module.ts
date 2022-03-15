import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextComponent } from './text.component';
import { PipeModule } from 'src/app/shared/pipes/pipe.module';



@NgModule({
  declarations: [TextComponent],
  imports: [
    CommonModule,
    PipeModule,
  ],
  exports: [TextComponent],
})
export class TextModule { }
