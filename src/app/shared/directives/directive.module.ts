import { NgModule } from "@angular/core";
import { AutofocusDirective } from "./autofocus.directive";
import { IntersectionObserverDirective } from "./intersection.directive";

@NgModule({
  declarations: [
    AutofocusDirective,
    IntersectionObserverDirective,
  ],
  exports: [
    AutofocusDirective,
    IntersectionObserverDirective,
  ],
})
export class DirectivesModule { }
