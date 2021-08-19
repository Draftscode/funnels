import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { IImage } from '../image.interface';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})
export class ImgComponent implements OnInit, OnDestroy {
  @Input() image: IImage | undefined;
  @Input() preview: boolean = false;
  @Input() format: string | undefined = 'original';
  @Output() imageSelected: EventEmitter<IImage> = new EventEmitter<IImage>();
  src: string | undefined;
  private loaded: boolean = false;

  constructor(public elementRef: ElementRef) {
  }

  ngOnDestroy(): void {
  }

  inter(visibility: boolean): void {
    if (this.loaded) { return; }
    if (visibility) {
      this.src = this.preview ? this.image?.previewURL || '' : this.image?.webformatURL || '';
      this.loaded = true;
    }

  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.image) {
      if (this.image && this.loaded) {
        this.src = this.preview ? this.image?.previewURL || '' : this.image?.webformatURL || '';
      }
    }
  }

  click(): void {
    this.imageSelected.emit(this.image);
  }
}
