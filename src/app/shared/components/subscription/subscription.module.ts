import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ImgModule } from '../images/img/img.module';
import { SubscriptionComponent } from './subscription.component';



@NgModule({
  declarations: [SubscriptionComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    ImgModule,
    MatIconModule,
  ],
  exports: [SubscriptionComponent],
})
export class SubscriptionModule { }
