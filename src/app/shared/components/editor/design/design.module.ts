import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { PipeModule } from 'src/app/shared/pipes/pipe.module';
import { DesignRoutingModule } from './design-routing.module';
import { DesignComponent } from './design.component';

@NgModule({
  declarations: [DesignComponent],
  exports: [DesignComponent],
  imports: [
    TranslateModule,
    MatCardModule,
    CommonModule,
    DesignRoutingModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatExpansionModule,
    PipeModule,
    MatSliderModule,
    MatMenuModule,
    MatTooltipModule,
    NgScrollbarModule,
  ]
})
export class DesignModule { }
