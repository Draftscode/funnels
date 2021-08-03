import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatMomentDateModule, MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatNativeDateModule, MatRippleModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from './directives/directive.module';
import { PipeModule } from './pipes/pipe.module';

@NgModule({
  imports: [
    MatSlideToggleModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatIconModule,
    MatSidenavModule,
    MatRippleModule,
    MatListModule,
    ScrollingModule,
    DragDropModule,
    MatSliderModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    PipeModule,
    TranslateModule,
    DirectivesModule,
  ],
  exports: [
    TranslateModule,
    MatSelectModule,
    PipeModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatToolbarModule,
    MatRippleModule,
    MatIconModule,
    MatSidenavModule,
    MatStepperModule,
    MatListModule,
    ScrollingModule,
    DragDropModule,
    MatGridListModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSliderModule,
    MatNativeDateModule,
    MatMomentDateModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    DirectivesModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  ],
  declarations: [],
})
export class SharedModule { }
