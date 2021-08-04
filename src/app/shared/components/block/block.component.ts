import { Component, ContentChild, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FunnelService } from 'src/app/services/funnel.service';
import { IBlock } from 'src/app/shared/components/editor/block.interface';
import { WidgetComponent } from '../widget/widget.component';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit, OnChanges, OnDestroy {
  @Input('item') item: IBlock | null = null;
  @Input() zoom: number = 1;
  @Output() selected: EventEmitter<IBlock> = new EventEmitter<IBlock>();
  @Input() height: number = 0;
  @ContentChild('widgetTemplate') template: TemplateRef<WidgetComponent> | undefined;

  constructor(private funnelApi: FunnelService, public elementRef: ElementRef) {
    // this.el.nativeElement.style.height = '300px';
  }

  get itemHeight(): string {
    return `${(this.height || 0) + (this.item?.height || 0)}px`;
  }

  myHeight = 300;

  activateBlock(item: IBlock): void {
    if (!item) { return; }
    this.selected.emit(item);
  }

  ngOnInit(): void {
    this.myHeight = this.height + (this.item?.height || 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.height) {
      this.myHeight = this.height + (this.item?.height || 0);
    }
  }


  ngOnDestroy(): void {
    // this.funnelApi.activateWidget(this.widget.id)
  }

}
