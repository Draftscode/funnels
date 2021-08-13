import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ISubscriptionForm } from 'src/app/model/widget.interface';
import { GlobalUtils } from 'src/app/utils/global.utils';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, OnChanges {
  @Input() widget: ISubscriptionForm | undefined;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges): void {
  }
}
