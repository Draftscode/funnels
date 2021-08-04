import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { DateAdapter, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';



@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
  ],
  exports: [
    CalendarComponent,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  ]
})
export class CalendarModule { }
