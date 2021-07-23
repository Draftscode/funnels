import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ChartComponent } from "./chart.component";

@NgModule({
  imports: [
    CommonModule,
    NgxChartsModule,
  ],
  exports: [ChartComponent],
  declarations: [ChartComponent],
})
export class ChartModule { }
