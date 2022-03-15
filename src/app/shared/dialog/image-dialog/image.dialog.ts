import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IImage } from "../../components/images/image.interface";
import { ImageDialogData } from "./image-dialog.service";

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image.dialog.html',
  styleUrls: ['./image.dialog.scss'],
})
export class ImageDialog {
  curImage: IImage | undefined;
  formGroup: FormGroup;
  term: string | undefined;
  formats = [{ name: 'Icon', id: 'icon' }, { name: 'Original', id: 'original' }];
  selectedFormat: string = 'original';
  opacity: number = 1;

  constructor(private dialog: MatDialogRef<ImageDialog>, @Inject(MAT_DIALOG_DATA) public data: ImageDialogData,) {
    this.curImage = this.data?.image;
    this.term = localStorage.getItem('search') || undefined;

    this.formGroup = new FormGroup({
      term: new FormControl(this.term),
      format: new FormControl('original'),
    });
  }

  ngOnInit(): void {
    if (this.term) { this.submit(); }
  }

  updateTerm(term: string): void {
    this.term = term;
    localStorage.setItem('search', term);
  }

  selectFormat(format: string): void {
    this.selectedFormat = format;
    if (this.curImage) {
      this.curImage.format = format;
    }
  }

  submit(): void {
    const term: string = this.formGroup?.get('term')?.value;
    this.updateTerm(term);
  }

  selectImage(img: IImage): void {
    img.format = this.selectedFormat;
    this.curImage = img;
  }

  back(): void {
    this.curImage = undefined;
  }

  close(data: Record<string, any>): void {
    this.dialog.close(data);
  }

  useImage(): void {
    this.dialog.close({ type: 'confirm', data: { image: this.curImage } });
  }
}
