import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NameEditorComponent } from './name-editor.component';



@NgModule({
  declarations: [NameEditorComponent],
  exports: [NameEditorComponent],
  imports: [
    SharedModule,
    CommonModule,
  ]
})
export class NameEditorModule { }
