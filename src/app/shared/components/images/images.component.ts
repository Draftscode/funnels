import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { finalize, map, shareReplay } from 'rxjs/operators';
import { ImageService } from 'src/app/services/image.service';
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

  constructor(
    private breakpointObserver: BreakpointObserver,
    private imgApi: ImageService) {
    this.formGroup = new FormGroup({
      term: new FormControl(''),
    });
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
        console.log(r);
        this.slices = Math.ceil(r.total / 3);
        this.images = r.hits;
      });
  }
}
