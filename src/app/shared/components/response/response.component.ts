import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { IFunnel } from 'src/app/model/funnel.interface';
import { FunnelService } from 'src/app/services/funnel.service';
import { DataStorage, ViewerService } from '../viewer/viewer.service';

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.scss'],
  providers: [DatePipe],
})
export class ResponseDialogComponent implements OnInit {
  responses: Observable<DataStorage[]>;
  datasource: Record<string, any>[] = [];
  displayedColumns: string[] = [];

  constructor(
    private viewApi: ViewerService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private funnelApi: FunnelService,
    @Inject(MAT_DIALOG_DATA) public data: IFunnel,
  ) {
    this.responses = this.viewApi.loadResponseForFunnel(data.id);

    this.responses.subscribe((r: DataStorage[]) => {
      const keys: string[] = [];
      this.datasource = r.map((item: DataStorage, index: number) => {
        const record: Record<string, any> = item.record;
        Object.keys(record).forEach((k: string) => {
          if (keys.indexOf(k) === -1) { keys.push(k); }
          // record[k] = this.parseEntry(record, k);
        });
        record.created = this.datePipe.transform(item.created, this.translate.instant('DATE.datetime'));
        record.rowNumber = index + 1;
        record.unchecked = item.unchecked;
        return record;
      });

      this.displayedColumns = ['rowNumber', 'created', 'unchecked'].concat(keys);
    });
  }

  parseEntry(record: Record<string, any>, key: string) {
    if (!isNaN(record[key])) {
      return record[key];
    } else if (this.isDate(new Date(record[key]))) {
      return this.datePipe.transform(new Date(record[key]), 'dd.MM.YYYY HH:mm');
    } else {
      if (typeof record[key] === 'boolean') {
        return this.translate.instant(`LABEL.${record[key]}`);
      } else {
        return this.hasTranslation(`LABEL.${record[key]}`) || record[key];
      }
    }
  }

  isDate(date: any): boolean {
    return (date !== "Invalid Date") && !isNaN(date);
  }

  hasTranslation(key: string): string | null {
    const translation: string = this.translate.instant(key);
    return translation !== key && translation !== '' ? translation : null;
  }

  ngOnInit(): void {
  }
}
