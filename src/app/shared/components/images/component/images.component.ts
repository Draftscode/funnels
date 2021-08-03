import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { ImageService } from 'src/app/services/image.service';
import { IImage } from '../image.interface';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit, OnChanges {

  slices: number = 0;
  images: IImage[] = [];
  layoutLarge$ = this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge]).pipe(map(result => result.matches), shareReplay());
  layoutSmall$ = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(map(result => result.matches), shareReplay());
  @Output() imageSelected: EventEmitter<IImage> = new EventEmitter<IImage>();
  @Input() term: string | undefined;
  @Input() format: string | undefined;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private imageApi: ImageService,
  ) {

  }

  selectImage(img: IImage): void {
    this.imageSelected.emit(img);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.term) {
      this.trigger();
    }
  }

  ngOnInit(): void {
    // this.trigger();
  }

  trigger(): void {
    this.imageApi.search(this.term || '', 100, 0)
      .subscribe((r) => {
        this.slices = Math.ceil(r.total / 3);
        this.images = r.hits;
      });
  }
}
