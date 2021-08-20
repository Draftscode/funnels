import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { IMainNavLink } from './main-nav-links';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  @Input() items: IMainNavLink[] = [];
  @ViewChild(MatSidenav) drawer: MatSidenav | undefined;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) { }

  public toggle(): void {
    this.drawer?.toggle();
  }
}
