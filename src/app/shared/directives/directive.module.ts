import { NgModule } from "@angular/core";
import { AutofocusDirective } from "./autofocus.pipe";

@NgModule({
  declarations: [
    AutofocusDirective,
  ],
  exports: [
    AutofocusDirective,
  ],
})
export class DirectivesModule { }
