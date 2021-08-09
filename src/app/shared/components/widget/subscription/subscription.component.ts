import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IWidget } from 'src/app/model/widget.interface';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, OnChanges {
  @Input() widget: IWidget | undefined;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges): void { }

  addAlpha(color: string | undefined, opacity: number): string | undefined {
    if (!color) { return color; }
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }
}
