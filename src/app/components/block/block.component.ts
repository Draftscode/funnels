import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { IBlock } from 'src/app/editor/block';
import * as fromBlock from './block.reducer';
import * as blockActions from './block.actions';
import { IWidget } from 'src/app/model/widget';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit, OnChanges {
  @Input('item') item: IBlock | null = null;
  @Input() zoom: number = 1;
  @Output() selected: EventEmitter<IBlock> = new EventEmitter<IBlock>();
  // blocks: Observable<IBlock | null> | null = null;
  // constructor(private store: Store<fromBlock.BlockState>) {
  // }

  ngOnInit(): void {
    // this.blocks = this.store.select(fromBlock.getItemById(this.itemId));
    // if (!this.blocks) { return; }

    // this.blocks.subscribe((a: IBlock | null) => {
    //   this.item = a;
    // });
  }


  activateBlock(item: IBlock): void {
    if (!item) { return; }

    item.activated = true;
    this.selected.emit(item);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  get height(): number {
    if (!this.item) { return 0; }
    return this.item.height * this.zoom + (this.item.curDragHeight || 0) * this.zoom;
  }


  storeIt(widget: IWidget, value: any): void {
    widget.text = value;
    widget.editable = false;
  }

  onDoubleClick(event: MouseEvent, widget: IWidget): void {
    widget.editable = true;
  }
}
