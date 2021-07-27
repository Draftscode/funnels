import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
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
    private currentRoute: ActivatedRoute) {
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
