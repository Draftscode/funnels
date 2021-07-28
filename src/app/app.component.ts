import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeWhile } from 'rxjs/operators';
import { Funnel2Service } from './services/funnel2.service';
import { IMainNavLink } from './shared/components/main-nav/main-nav-links';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  lockSideNav: boolean = false;
  private alive: boolean = true;
  links: IMainNavLink[] = [
    {
      icon: 'dashboard',
      name: 'Dashbooard',
      link: ['statistics'],
    },
    {
      icon: 'remember_me',
      name: 'Funneleditor',
      link: ['editor', 'funnel-001'],
    },
    {
      icon: 'auto_stories',
      name: 'Vorlagen',
      link: ['statistics'],
    },
    {
      icon: 'folder_open',
      name: 'Meine Dateien',
      link: ['images'],
    }, {
      icon: 'eye',
      name: 'Ansehen',
      link: ['viewer', 'funnel-001'],
    }];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private funnel2Service: Funnel2Service,
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    console.log(this.translate.instant('BUTTON1'));

    this.router.events.pipe(takeWhile(() => this.alive)).subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.lockSideNav = e.url.includes('viewer') ? true : false;
      }
    })
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
