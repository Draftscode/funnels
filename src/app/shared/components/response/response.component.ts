import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { IFunnel } from 'src/app/model/funnel.interface';
import { ViewerService } from '../viewer/viewer.service';

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.scss'],
  providers: [DatePipe],
})
export class ResponseDialogComponent implements OnInit {
  responses: Observable<Record<string, any>[]>;
  datasource: Record<string, any>[] = [];
  displayedColumns: string[] = [];
  constructor(
    private viewApi: ViewerService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: IFunnel,
  ) {
    this.responses = this.viewApi.loadResponseForFunnel(data.id);
    this.responses.subscribe((r: Record<string, any>[]) => {
      this.datasource = r;
      const keys: string[] = [];
      this.datasource.forEach((record: Record<string, any>, index: number) => {
        Object.keys(record).forEach((k: string) => {
          if (keys.indexOf(k) === -1) { keys.push(k); }
          record[k] = this.parseEntry(record, k);

        });
        record.rowNumber = index + 1;
      });

      this.displayedColumns = ['rowNumber'].concat(keys);
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
