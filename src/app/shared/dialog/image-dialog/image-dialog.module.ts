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
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ImagesModule } from '../../components/images/component/images.module';
import { ImagesRoutingModule } from '../../components/images/images-routing.module';
import { ImgModule } from '../../components/images/img/img.module';
import { ImageDialog } from './image.dialog';



@NgModule({
  declarations: [
    ImageDialog,
  ],
  exports: [ImageDialog],
  imports: [
    CommonModule,
    TranslateModule,
    CommonModule,
    NgScrollbarModule,
    ImagesRoutingModule,
    MatGridListModule,
    ImgModule,
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
