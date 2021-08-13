import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { IBlock } from "src/app/shared/components/editor/block.interface";
import { GlobalUtils } from "src/app/utils/global.utils";
import { IPage } from "./page.interface";

@Component({
  selector: 'app-page',
  templateUrl: 'page.component.html',
  styleUrls: ['page.component.scss'],
})
export class PageComponent implements OnChanges, OnInit {
  @Input() editable: boolean = false;
  @Input() page: IPage | undefined;
  @Input() zoom: number = 1;
  width: number = 592;
  height: number = 288;
  fontSize: number = 14;

  get blockIds(): number[] {
    return [1, 2, 3, 4, 5, 6, 7];
  }

  @ViewChild('textEditor') set editor(textEditor: ElementRef) {
    if (!textEditor) { return; }
    textEditor.nativeElement.focus();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  onResize(e: { distance: { x: number; y: number; } }, block: IBlock): void {
    // block.curDragHeight = (e?.distance?.y || 0);
  }

  resize(e: { distance: { x: number; y: number; } }, block: IBlock): void {
    // block.curDragHeight = 0;
    block.height = (block.height + e.distance.y);

  }
}
