import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IFunnel } from 'src/app/model/funnel.interface';
import { GlobalUtils } from 'src/app/utils/global.utils';
import { CreateFunnel } from '../../state/funnel/funnel.actions';
import { FunnelState, IFunnelStateModel } from '../../state/funnel/funnel.state';
import { CreatePage } from '../../state/page/page.actions';
import { IPage } from '../page/page.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['position','pages','actions'];

  // @Select((state: any) => state.funnel) funnelState$!: Observable<IFunnelStateModel>;
  funnels$: Observable<IFunnel[]>;
  constructor(
    private router: Router,
    private store: Store,
  ) {
    this.funnels$ = this.store.select(state => {
      return Object.keys(state.funnel.entities).map((key: string) => state.funnel.entities[key]) || [];
    });
  }

  ngOnInit(): void {
  }

  editFunnel(funnel: IFunnel): void {
    this.router.navigate(['/', 'editor', funnel.id]);
  }

  deleteFunnel(funnel: IFunnel): void {

  }

  createFunnel(): void {
    const defaultPage: IPage = {
      id: GlobalUtils.uuidv4(),
      index: 0,
      name: 'Neue Seite',
      blocks: {},
    };

    const f: IFunnel = {
      id: GlobalUtils.uuidv4(),
      name: 'Neuer Funnel',
      pages: {},
      websites: {},
      pageIds: [defaultPage.id]
    };

    f.pages[defaultPage.id] = defaultPage;

    this.store.dispatch([
      new CreateFunnel(f),
      new CreatePage(defaultPage),
    ]);
  }
}
