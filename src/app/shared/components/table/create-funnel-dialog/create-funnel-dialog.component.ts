import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { FunnelService } from 'src/app/services/funnel.service';
import { DialogResultType } from 'src/app/shared/dialog/dialog-result.interface';

@Component({
  selector: 'app-create-funnel-dialog',
  templateUrl: './create-funnel-dialog.component.html',
  styleUrls: ['./create-funnel-dialog.component.scss']
})
export class CreateFunnelDialogComponent implements OnInit, OnDestroy {
  selected: 'blank' | 'template' = 'blank';
  private alive: boolean = true;
  items: Record<string, IFunnel> = {};

  constructor(
    private dialog: MatDialogRef<CreateFunnelDialogComponent>,
    private funnelApi: FunnelService,
  ) {
    this.funnelApi.itemsChanged().pipe(takeWhile(() => this.alive), map((funnels: Record<string, IFunnel>) => {
      Object.keys(funnels).forEach((key: string) => {
        if (!funnels[key].isTemplate) {
          delete funnels[key];
        }
      });
      return funnels;
    })).subscribe((items: Record<string, IFunnel>) => {
      this.items = items;
    });
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialog.close({ type: DialogResultType.CANCEL });
  }

  confirm(funnelId: string | undefined = undefined): void {
    this.dialog.close({ type: DialogResultType.CONFIRM, data: { selected: this.selected, funnelId } });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

}
