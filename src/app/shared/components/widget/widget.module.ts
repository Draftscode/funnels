import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ImgModule } from '../images/img/img.module';
import { WidgetComponent } from './widget.component';

@NgModule({
  declarations: [
    WidgetComponent,
  ],
  exports: [
    WidgetComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    MatIconModule,
    ImgModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    MatDatepickerModule,
  ],
  providers: [

  ],
})
export class WidgetModule { }
