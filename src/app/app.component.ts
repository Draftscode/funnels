import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { takeWhile } from 'rxjs/operators';
import { IMainNavLink } from './shared/components/main-nav/main-nav-links';
import { GetAllBlocks } from './shared/state/block/block.actions';
import { GetAllFunnels } from './shared/state/funnel/funnel.actions';
import { GetAllPages } from './shared/state/page/page.actions';
import { GetAllWidgets } from './shared/state/widget/widget.actions';
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
    private store: Store,
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');

    this.router.events.pipe(takeWhile(() => this.alive)).subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.lockSideNav = e.url.includes('viewer') ? true : false;
      }
    });

    this.store.dispatch([
      new GetAllFunnels(),
      new GetAllPages(),
      new GetAllBlocks(),
      new GetAllWidgets(),
    ]);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
