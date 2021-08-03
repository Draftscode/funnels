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
import { SharedModule } from 'src/app/shared/shared.module';
import { ImagesModule } from '../component/images.module';
import { ImagesRoutingModule } from '../images-routing.module';
import { ImgModule } from '../img/img.module';
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
    SharedModule,
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
