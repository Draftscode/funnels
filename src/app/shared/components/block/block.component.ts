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

  @ContentChild('widgetTemplate') template: TemplateRef<WidgetComponent> | undefined;

  height: number = 0;
  constructor(private funnelApi: FunnelService, private el: ElementRef) {
    // this.el.nativeElement.style.height = '300px';
   }

  activateBlock(item: IBlock): void {
    if (!item) { return; }
    this.selected.emit(item);
  }

  ngOnInit(): void {
    this.height = this.item?.height || 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }


  ngOnDestroy(): void {
    // this.funnelApi.activateWidget(this.widget.id)
  }

}
