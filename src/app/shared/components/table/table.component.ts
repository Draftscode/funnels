import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { concat } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { BlockService } from 'src/app/services/block.service';
import { FunnelService } from 'src/app/services/funnel.service';
import { PageService } from 'src/app/services/page.service';
import { GlobalUtils } from 'src/app/utils/global.utils';
import { IBlock } from '../editor/block.interface';
import { IPage } from '../page/page.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['position', 'pages', 'actions'];
  private alive: boolean = true;
  funnels: IFunnel[] = [];
  constructor(
    private router: Router,
    private funnelApi: FunnelService,
    private pageApi: PageService,
    private blockApi: BlockService,
  ) {
    this.funnelApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((f: Record<string, IFunnel>) => {
      this.funnels = Object.keys(f || {}).map((key: string) => f[key]);
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
    const block: IBlock = {
      id: GlobalUtils.uuidv4(),
      height: 300,
      index: 0,
      widgets: {},
    };

    const defaultPage: IPage = {
      id: GlobalUtils.uuidv4(),
      index: 0,
      name: 'Neue Seite',
      blocks: {},
      blockIds: [block.id],
    };

    const f: IFunnel = {
      id: GlobalUtils.uuidv4(),
      name: 'Neuer Funnel',
      pages: {},
      websites: {},
      pageIds: [defaultPage.id]
    };

    f.pages[defaultPage.id] = defaultPage;

    concat(
      this.blockApi.create(block.id, block),
      this.pageApi.create(defaultPage.id, defaultPage),
      this.funnelApi.create(f.id, f),
    ).subscribe(() => {
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
