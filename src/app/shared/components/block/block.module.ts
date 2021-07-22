import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
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
    SharedModule,
  ]
})
export class BlockModule { }
