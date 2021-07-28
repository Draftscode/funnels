import { Component, ContentChild, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
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
  ngOnInit(): void { }
  @ContentChild('widgetTemplate') template: TemplateRef<WidgetComponent> | undefined;

  constructor(private funnelApi: FunnelService) { }

  get widgetCount(): number {
    if (!this.item) { return 0; }

    return Object.keys(this.item.widgets || {}).length;
  }


  activateBlock(item: IBlock): void {
    if (!item) { return; }
    this.selected.emit(item);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  get height(): number {
    if (!this.item) { return 0; }
    return this.item.height * this.zoom + (this.item.curDragHeight || 0) * this.zoom;
  }



  ngOnDestroy(): void {
    // this.funnelApi.activateWidget(this.widget.id)
  }

}
