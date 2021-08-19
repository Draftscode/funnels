import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ICalendar } from 'src/app/model/widget.interface';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() widget: ICalendar | undefined;
  calendarRef: ElementRef | undefined;
  @ViewChild(MatCalendar, { read: ElementRef }) set ref(calendarRef: ElementRef) {
    this.calendarRef = calendarRef;
    this.update();
  }
  @Output('afterChanges') afterChanges: EventEmitter<Record<string, any>> = new EventEmitter<Record<string, any>>();

  update(): void {
    if (!this.calendarRef || !this.widget) { return; }

    const c: HTMLCollectionOf<HTMLElement> = this.calendarRef.nativeElement.getElementsByClassName('mat-calendar-body-cell-content');

    const lables: HTMLElement[] = [
      this.calendarRef.nativeElement.getElementsByClassName('mat-calendar-table-header')[0],
      this.calendarRef.nativeElement.getElementsByClassName('mat-calendar-body-label')[0],
      this.calendarRef.nativeElement.getElementsByClassName('mat-calendar-period-button')[0],
      this.calendarRef.nativeElement.getElementsByClassName('mat-calendar-previous-button')[0],
      this.calendarRef.nativeElement.getElementsByClassName('mat-calendar-next-button')[0],
    ];

    const today: HTMLElement | undefined = this.calendarRef.nativeElement.getElementsByClassName('mat-calendar-body-today')[0];
    if (today) { today.style.borderColor = this.widget.textColor || 'black'; }

    const arrow: HTMLElement | undefined = this.calendarRef.nativeElement.getElementsByClassName('mat-calendar-arrow')[0];
    if (arrow) { arrow.style.borderTopColor = this.widget.textColor || 'black'; }

    for (let i = 0; i < c.length; i++) {
      const item: HTMLElement | null = c.item(i);
      if (item) { item.style.color = this.widget.textColor || 'black'; }
    }

    lables?.filter((l: HTMLElement) => l !== undefined).forEach((l: HTMLElement) => {
      l.style.color = this.widget?.textColor || 'black';
    });
  }

  onChange(ev: Moment) {
    if (!this.widget) { return; }
    this.widget.selected = ev.toDate().getTime();
    this.afterChanges.emit({ selectedDate: new Date(this.widget.selected) });
  }

  get selected(): Moment | undefined {
    return this.widget?.selected ? moment(this.widget.selected) : undefined;
  }

  constructor() { }

  ngOnInit(): void {
    this.update();
  }

}
