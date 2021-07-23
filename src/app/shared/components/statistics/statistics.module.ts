import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChartModule } from '../chart/chart.module';
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
    ChartModule,
    NgScrollbarModule,
    TableModule,
    MatToolbarModule,
    StatisticsRoutingModule,
  ]
})
export class StatisticsModule { }
