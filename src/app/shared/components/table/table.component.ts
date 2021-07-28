import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IFunnel } from 'src/app/model/funnel.interface';
import { Funnel2Service } from 'src/app/services/funnel2.service';
import { GlobalUtils } from 'src/app/utils/global.utils';
import { IPage } from '../page/page.interface';
import * as funnelActions from './../funnel/funnel.actions';
import * as fromFunnel from './../funnel/funnel.reducer';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'template', 'pages', 'weight', 'symbol', 'actions'];
  dataSource: ExampleDataSource | undefined;
  funnels$: Observable<IFunnel[]> = this.funnelStore.select(fromFunnel.selectAll);

  constructor(
    private router: Router,
    private funnel2Api: Funnel2Service,
    private funnelStore: Store<fromFunnel.FunnelState>,
  ) {
    this.dataSource = new ExampleDataSource(this.funnelStore);
  }
  ngOnInit(): void {
  }

  editFunnel(funnel: IFunnel): void {
    this.router.navigate(['/', 'editor', funnel.id]);
  }

  deleteFunnel(funnel: IFunnel): void {
    this.funnel2Api.delete(funnel.id).subscribe(() => {
      this.funnelStore.dispatch(new funnelActions.Delete(funnel.id));
    });
  }

  createFunnel(): void {
    const f: IFunnel = {
      id: GlobalUtils.uuidv4(),
      name: '',
      pages: {},
      websites: {},
    };
    const defaultPage: IPage = {
      id: GlobalUtils.uuidv4(),
      index: 0,
      blocks: {},
    };

    f.pages[defaultPage.id] = defaultPage;

    this.funnel2Api.create(f).subscribe(() => {
      this.funnelStore.dispatch(new funnelActions.Create(f));
    });
  }
}

class ExampleDataSource extends DataSource<IFunnel> {
  private _dataStream: Observable<IFunnel[]> = this.funnelStore.select(fromFunnel.selectAll);

  constructor(
    private funnelStore: Store<fromFunnel.FunnelState>,
  ) {
    super();
  }


  connect(): Observable<IFunnel[]> {
    return this._dataStream;
  }

  disconnect() { }
}
