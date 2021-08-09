import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IWidget } from 'src/app/model/widget.interface';
import { BlockService } from 'src/app/services/block.service';
import { WidgetService } from 'src/app/services/widget.service';
import { ImageDialog } from '../../images/dialog/image.dialog';
import { IBlock } from '../block.interface';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnInit, OnChanges {
  @Input() widget: IWidget | undefined;
  @Input() block: IBlock | undefined;

  constructor(
    private dialog: MatDialog,
    private widgetApi: WidgetService,
    private blockApi: BlockService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.block);
  }

  updateImage(type: 'widget' | 'block'): void {
    if (!this.widget) { return; }
    this.dialog.open(ImageDialog, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '90%',
      width: '90%',
      panelClass: 'lightbox',
      data: { image: this.widget?.image },
    }).afterClosed().subscribe((r) => {
      if (r?.type !== 'confirm') { return; }

      if (type === 'widget') { this.changeWidget({ image: r.image }); }
      else if (type === 'block') { this.changeBlock({ image: r.image }); }

    });
  }


  /**
   * changes properties of a widget
   * @param {Record<string,any>} changes map of the properties changed
   * @returns void
   */
  changeWidget(changes: Record<string, any>): void {
    if (!this.widget) { return; }
    this.widgetApi.updateProperty(this.widget.id, changes).subscribe();
  }

  /**
   * changes properties of a block
   * @param {Record<string,any>} changes map of the properties changed
   * @returns void
   */
  changeBlock(changes: Record<string, any>): void {
    if (!this.block) { return; }
    this.blockApi.updateProperty(this.block.id, changes).subscribe();
  }

  change(a: any): void {
    console.log(a);
  }
}
