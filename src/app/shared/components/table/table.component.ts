import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { BlockService } from 'src/app/services/block.service';
import { FunnelService } from 'src/app/services/funnel.service';
import { PageService } from 'src/app/services/page.service';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { DialogResult, DialogResultType } from '../../dialog/dialog-result.interface';
import { ResponseDialogComponent } from '../response/response.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['position', 'published', 'pages', 'totalResponses', 'uncheckedResponses', 'actions'];
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
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'LABEL.confirm',
        text: {
          value: 'QUESTION.delete_value',
          params: 'LABEL.funnel'
        }
      }
    })
      .afterClosed().subscribe((r: DialogResult) => {
        if (r?.type === DialogResultType.CONFIRM) {
          this.funnelApi.deleteFunnel(funnel.id).subscribe();
        }
      });
  }

  createFunnel(): void {
    this.funnelApi.createFunnel().subscribe();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
