import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { FunnelService } from 'src/app/services/funnel.service';
import { ConfirmDialogService } from '../../dialog/confirm-dialog/confirm-dialog.service';
import { CreateFunnelDialogService } from '../../dialog/create-funnel-dialog/create-funnel-dialog.service';
import { DialogResult, DialogResultType } from '../../dialog/dialog-result.interface';
import { ResponseDialogService } from '../../dialog/response/response-dialog.service';

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
    private dialog: MatDialog,
    private confirmDialogService: ConfirmDialogService,
    private responseDialogService: ResponseDialogService,
    private createFunnelDialogService: CreateFunnelDialogService,
  ) {
    this.funnelApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((f: Record<string, IFunnel>) => {
      this.funnels = Object.keys(f || {}).map((key: string) => f[key]);
    });
  }

  ngOnInit(): void {
  }

  openResponses(element: IFunnel): void {
    this.responseDialogService.open(element).subscribe();
  }

  editFunnel(funnel: IFunnel): void {
    this.router.navigate(['/', 'editor', funnel.id]);
  }

  deleteFunnel(funnel: IFunnel): void {
    this.confirmDialogService.open({
      title: 'LABEL.confirm',
      text: {
        value: 'QUESTION.delete_value',
        params: { value: 'LABEL.funnel' }
      }
    }).subscribe((r: DialogResult) => {
      if (r?.type === DialogResultType.CONFIRM) {
        this.funnelApi.deleteFunnel(funnel.id).subscribe();
      }
    });
  }

  createFunnel(): void {
    this.createFunnelDialogService.open().subscribe((r: DialogResult) => {
      if (r?.type !== DialogResultType.CONFIRM) { return; }
      if (r.data?.selected === 'blank') {
        this.funnelApi.createFunnel().subscribe();
      } else if (r.data?.funnelId) {
        this.funnelApi.copy(r.data.funnelId).subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  copyFunnel(funnel: IFunnel): void {
    this.funnelApi.copy(funnel.id).subscribe((f: IFunnel) => { });
  }
}
