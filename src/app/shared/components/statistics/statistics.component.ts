import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {
  layoutLarge$ = this.breakpointObserver.observe([Breakpoints.Large,Breakpoints.XLarge]).pipe(map(result => result.matches), shareReplay());
  layoutSmall$ = this.breakpointObserver.observe([Breakpoints.Small,Breakpoints.XSmall]).pipe(map(result => result.matches), shareReplay());

  constructor(private breakpointObserver: BreakpointObserver) {
  }


}
