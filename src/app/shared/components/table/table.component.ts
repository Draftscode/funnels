import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { concat } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { BlockService } from 'src/app/services/block.service';
import { FunnelService } from 'src/app/services/funnel.service';
import { PageService } from 'src/app/services/page.service';
import { IBlock } from '../editor/block.interface';
import { IPage } from '../page/page.interface';
import { ResponseDialogComponent } from '../response/response.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['position', 'pages', 'totalResponses', 'uncheckedResponses', 'actions'];
  private alive: boolean = true;
  funnels: IFunnel[] = [];
  constructor(
    private router: Router,
    private funnelApi: FunnelService,
    private pageApi: PageService,
    private blockApi: BlockService,
    private dialog: MatDialog,
  ) {
    this.funnelApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((f: Record<string, IFunnel>) => {
      this.funnels = Object.keys(f || {}).map((key: string) => f[key]);
    });
  }

  ngOnInit(): void {
  }

  openResponses(element: IFunnel): void {
    this.dialog.open(ResponseDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '90%',
      width: '90%',
      panelClass: 'lightbox',
      data: element
    });
  }

  editFunnel(funnel: IFunnel): void {
    this.router.navigate(['/', 'editor', funnel.id]);
  }

  deleteFunnel(funnel: IFunnel): void {

  }

  createFunnel(): void {
    const block: IBlock = this.blockApi.createBlock();
    const defaultPage: IPage = this.pageApi.createPage([block.id]);
    const f: IFunnel = this.funnelApi.createFunnel([defaultPage.id]);

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
