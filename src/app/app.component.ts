import { Component } from '@angular/core';
import { IMainNavLink } from './shared/components/main-nav/main-nav-links';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  links: IMainNavLink[] = [
    //   {
    //   icon: 'home',
    //   name: 'Hauptseite',
    //   link: ['home'],
    // },
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
      link: ['statistics'],
    }];
}
