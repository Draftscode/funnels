import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ImportService } from 'src/app/services/import.service';
import { TableModule } from '../table/table.module';
import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';


@NgModule({
  declarations: [
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    MatGridListModule,
    NgScrollbarModule,
    TableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    StatisticsRoutingModule,
    MatButtonModule,
  ],
  providers: [ImportService]
})
export class StatisticsModule { }
