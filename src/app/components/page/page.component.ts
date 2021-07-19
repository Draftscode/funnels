import { CdkDrag, CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { IBlock } from "src/app/editor/block";
import * as pageActions from './page.actions';
import { IPage } from "./page.interface";
import * as fromPage from './page.reducer';

@Component({
  selector: 'app-page',
  templateUrl: 'page.component.html',
  styleUrls: ['page.component.scss'],
})
export class PageComponent implements OnChanges, OnInit {
  @Input() page: IPage | null = null;
  @Input() zoom: number = 1;
  width: number = 592;
  height: number = 288;
  fontSize: number = 14;
  @ViewChild('textEditor') set editor(textEditor: ElementRef) {
    if (!textEditor) { return; }
    textEditor.nativeElement.focus();
  }

  // constructor(private store: Store<fromPage.PageState>) { }

  activateBlock(item: IBlock): void {
    if (!this.page) { return; }
    this.page.blocks.forEach((b: IBlock) => b.activated = false);
    item.activated = true;
    // this.store.dispatch(new pageActions.Update(this.page.id, this.page));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.zoom) { this.scale(); }
    console.log(changes);
  }

  ngOnInit(): void {
    this.scale();
  }

  scale(): void {
    const zoom = this.zoom || 1;
    this.height = 592 * zoom;
    this.width = 288 * zoom;
    this.fontSize = 14 * zoom;
  }

  /** Predicate function that only allows even numbers to be dropped into a list. */
  enterPredicate(index: number, item: CdkDrag<IBlock>): boolean {
    if (!item.data) { return false; }
    return true;
  }

  drop(event: CdkDragDrop<IBlock[]>): void {
    if (!this.page) { return; }
    const blocks = this.page.blocks;
    moveItemInArray(blocks, event.previousIndex, event.currentIndex);
    // this.page.blocks = blocks;
  }

  onResize(e: { distance: { x: number; y: number; } }, block: IBlock): void {
    block.curDragHeight = (e?.distance?.y || 0);
  }

  resize(e: { distance: { x: number; y: number; } }, block: IBlock): void {
    block.curDragHeight = 0;
    block.height = (block.height + e.distance.y);

  }
}
