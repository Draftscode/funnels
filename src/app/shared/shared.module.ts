import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatMomentDateModule, MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    ScrollingModule,
    DragDropModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatStepperModule,
    MatListModule,
    ScrollingModule,
    DragDropModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [{
    provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE],
  }],
  declarations: [],
})
export class SharedModule { }
