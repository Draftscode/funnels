import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  lockSideNav: boolean = false;
  private alive: boolean = true;


  constructor(
    // private router: Router,
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('de');
    // this.router.events.pipe(takeWhile(() => this.alive)).subscribe((e) => {
    //   if (e instanceof NavigationEnd) {
    //     this.lockSideNav = e.url.includes('viewer') ? true : false;
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
