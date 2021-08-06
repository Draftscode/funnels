import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
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
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [
    MatSlideToggleModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatSelectModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatRippleModule,
    MatListModule,
    ScrollingModule,
    DragDropModule,
    MatSliderModule,
    MatGridListModule,
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
    MatButtonToggleModule,
    MatToolbarModule,
    MatTabsModule,
    MatRippleModule,
    MatIconModule,
    MatSidenavModule,
    MatStepperModule,
    MatListModule,
    ScrollingModule,
    DragDropModule,
    MatGridListModule,
    MatDialogModule,
    MatSliderModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    DirectivesModule,
  ],
  providers: [],
  declarations: [],
})
export class SharedModule { }
