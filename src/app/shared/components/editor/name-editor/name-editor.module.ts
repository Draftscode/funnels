import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DirectivesModule } from 'src/app/shared/directives/directive.module';
import { NameEditorComponent } from './name-editor.component';



@NgModule({
  declarations: [NameEditorComponent],
  exports: [NameEditorComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    DirectivesModule,
  ]
})
export class NameEditorModule { }
