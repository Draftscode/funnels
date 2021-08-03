import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { ImageDialog } from './image.dialog';
import { ImagesRoutingModule } from '../images-routing.module';
import { ImagesModule } from '../component/images.module';



@NgModule({
  declarations: [
    ImageDialog,
  ],
  exports: [ImageDialog],
  imports: [
    CommonModule,
    TranslateModule,
    CommonModule,
    ImagesRoutingModule,
    MatGridListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ImagesModule,
  ]
})
export class ImageDialogModule { }
