import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { finalize, map, shareReplay } from 'rxjs/operators';
import { ImageService } from 'src/app/services/image.service';
import { IImage } from '../image.interface';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit, OnChanges {
  formats = [{ name: 'Icon', id: 'icon' }, { name: 'Original', id: 'original' }];
  selectedFormat: string = 'original';
  formGroup: FormGroup;
  loading: boolean = false;
  slices: number = 0;
  images: IImage[] = [];
  layoutLarge$ = this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge]).pipe(map(result => result.matches), shareReplay());
  layoutSmall$ = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(map(result => result.matches), shareReplay());
  @Output() imageSelected: EventEmitter<IImage> = new EventEmitter<IImage>();
  term: string | null;
  selectedImage: IImage | undefined;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private imgApi: ImageService) {

    this.term = localStorage.getItem('search');


    this.formGroup = new FormGroup({
      term: new FormControl(this.term),
      format: new FormControl('original'),
    });
  }

  selectImage(img: IImage): void {
    this.selectedImage = img;
    img.format = this.selectedFormat;
    this.imageSelected.emit(img);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {
    if (this.term) { this.submit(); }
  }

  updateTerm(term: string): void {
    this.term = term;
    localStorage.setItem('search', term);
  }

  submit(): void {
    if (this.loading) { return; }
    this.loading = true;
    const term: string = this.formGroup?.get('term')?.value;
    this.updateTerm(term);
    this.imgApi.search(term, 100, 0)
      .pipe(finalize(() => this.loading = false))
      .subscribe((r) => {
        this.slices = Math.ceil(r.total / 3);
        this.images = r.hits;
      });
  }
}
