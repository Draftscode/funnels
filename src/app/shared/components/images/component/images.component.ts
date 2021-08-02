import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { finalize, map, shareReplay } from 'rxjs/operators';
import { ImageService } from 'src/app/services/image.service';
import { ImageDialog } from './image.dialog';
import { IImage } from './image.interface';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  formGroup: FormGroup;
  loading: boolean = false;
  slices: number = 0;
  images: IImage[] = [];
  layoutLarge$ = this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge]).pipe(map(result => result.matches), shareReplay());
  layoutSmall$ = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(map(result => result.matches), shareReplay());
  @Output() imageSelected: EventEmitter<IImage> = new EventEmitter<IImage>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private imgApi: ImageService) {
    this.formGroup = new FormGroup({
      term: new FormControl(''),
    });
  }

  selectImage(img: IImage): void {
    this.imageSelected.emit(img);
  }

  ngOnInit(): void {
  }

  submit(): void {
    if (this.loading) { return; }
    this.loading = true;
    const term: string = this.formGroup?.get('term')?.value;
    this.imgApi.search(term, 100, 0)
      .pipe(finalize(() => this.loading = false))
      .subscribe((r) => {
        this.slices = Math.ceil(r.total / 3);
        this.images = r.hits;
      });
  }
}
