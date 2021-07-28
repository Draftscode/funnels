import { NgModule } from "@angular/core";
import { SortByIndexPipe } from "./sort-by-index.pipe";

@NgModule({
  declarations: [
    SortByIndexPipe,
  ],
  exports: [
    SortByIndexPipe,
  ],
})
export class PipeModule { }
