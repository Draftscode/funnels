import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ResizeEvent } from 'src/app/model/resize-event';
import { EResizeType } from 'src/app/model/resize-type.enum';
import { ResizeService } from 'src/app/services/resize.service';
import { GlobalUtils } from 'src/app/utils/global.utils';
import { IImage } from '../image.interface';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})
export class ImgComponent implements OnInit, AfterViewInit, OnDestroy {
  private id: string = GlobalUtils.uuidv4();
  @Input() image: IImage | undefined;
  @Input() preview: boolean = false;
  @Input() format: string | undefined = 'original';
  @Output() imageSelected: EventEmitter<IImage> = new EventEmitter<IImage>();

  private resizeIds: string[] = ['', ''];
  @ViewChild('ima') img: ElementRef | undefined;

  resize(): void {
    // setTimeout(() => {
    if (!this.img) { return; }
    const imgX: number = this.img.nativeElement.clientWidth;
    const imgY: number = this.img.nativeElement.clientHeight;
    const x = this.elementRef.nativeElement.clientWidth;
    const y = this.elementRef.nativeElement.clientHeight;
    const diffX = imgX - x;
    const diffY = imgY - y;
    console.log(diffX, diffY);
    if (diffX < 0) {
      console.log(this.id, '1');
      this.img.nativeElement.style.width = '100%';
      this.img.nativeElement.style.height = 'unset';
    } else if (diffY < 0) {
      console.log(this.id, '2');
      this.img.nativeElement.style.height = '100%';
      this.img.nativeElement.style.width = 'unset';
    } else {
      console.log(this.id, '3');
    }

    this.cd.detectChanges();

    // setTimeout(() => {
    // this.img!.nativeElement.style.marginLeft = `${-((this.img!.nativeElement.clientWidth || 2) / 2)}px`;
    // }, 0);
    // },0);
  }

  resizeImage(): void {
    if (!this.img) { return; }
    this.img.nativeElement.style.marginLeft = `${-((this.img!.nativeElement.clientWidth || 2) / 2)}px`;
  }

  private loaded: boolean = false;
  private imageObserver: IntersectionObserver;

  constructor(
    public elementRef: ElementRef,
    private rs: ResizeService,
    private cd: ChangeDetectorRef,
  ) {
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

  ngOnDestroy(): void {
    this.rs.complete(...this.resizeIds);
  }

  ngAfterViewInit(): void {
    if (!this.img) { return; }
    this.resizeIds[0] = this.rs.create(this.elementRef.nativeElement, (e: ResizeEvent) => {
      setTimeout(() => { this.resize(); });
    }, { types: [EResizeType.WIDTH, EResizeType.HEIGHT] });

    this.resizeIds[1] = this.rs.create(this.img.nativeElement, (e: ResizeEvent) => {
      setTimeout(() => { this.resizeImage(); });
    }, { types: [EResizeType.WIDTH, EResizeType.HEIGHT] });
  }

  inter(visibility: boolean, el: HTMLImageElement): void {
    if (this.loaded) { return; }
    if (visibility) {
      el.src = this.preview ? this.image?.previewURL || '' : this.image?.webformatURL || '';
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
        this.img.nativeElement.src = this.preview ? this.image?.previewURL || '' : this.image?.webformatURL || '';
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
