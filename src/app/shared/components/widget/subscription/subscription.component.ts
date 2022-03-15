import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { ISubscriptionForm } from 'src/app/model/widget.interface';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, OnChanges {
  @Input() widget: ISubscriptionForm | undefined;
  private itemList: QueryList<ElementRef> | undefined;
  @ViewChildren(MatFormField, { read: ElementRef }) set children(list: QueryList<ElementRef>) {
    this.itemList = list;
    this.update();
  }
  @Input() activated: boolean = false;
  @Output('afterChanges') afterChanges: EventEmitter<Record<string, any>> = new EventEmitter<Record<string, any>>();

  update(): void {
    this.itemList?.toArray().forEach((el: ElementRef) => {
      const l: HTMLCollectionOf<HTMLElement> = el.nativeElement.getElementsByClassName('mat-form-field-outline');
      for (let i = 0; i < l.length; i++) {

        const item: HTMLElement | null = l.item(i);
        if (item) {
          item.style.color = this.widget?.textColor || 'black';
        }
      }
    });
  }

  afterChanged(event: Record<string, any>): void {
    this.afterChanges.emit(event);
  }

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.update();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.widget) {
      this.update();
    }
  }
}
