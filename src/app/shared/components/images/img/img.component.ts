import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IImage } from '../image.interface';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})
export class ImgComponent implements OnInit, AfterViewInit {
  @Input() image: IImage | undefined;
  @Input() preview: boolean = false;
  @Input() format: string | undefined = 'original';
  @Output() imageSelected: EventEmitter<IImage> = new EventEmitter<IImage>();
  @ViewChild('ima') img: ElementRef | undefined;
  private loaded: boolean = false;
  private imageObserver: IntersectionObserver;

  constructor(public elementRef: ElementRef) {
    this.imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const image: HTMLImageElement = entry.target as HTMLImageElement;
          image.src = image.dataset.src || '';
          image.classList.remove("lazy");
          observer.unobserve(image);
        }
      });
    });
  }

  ngAfterViewInit(): void {
    console.log(this.img);


  }

  inter(visibility: boolean, el: HTMLImageElement): void {
    if (this.loaded) { return; }
    if (visibility) {
      el.src = this.image?.webformatURL || '';
      this.loaded = true;
      this.imageObserver.unobserve(el);
    }

  }

  register(): void {
    if (!this.img) { return; }
    this.imageObserver.unobserve(this.img?.nativeElement);
    this.imageObserver.observe(this.img?.nativeElement);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
    if (changes.image) {
      this.register();
      if (this.img && this.loaded) {
        this.img.nativeElement.src = this.image?.webformatURL || '';
      }
    }

    if (changes.format) {
      // console.log(changes.format.currentValue);
    }
  }

  click(): void {
    this.imageSelected.emit(this.image);
  }
}
