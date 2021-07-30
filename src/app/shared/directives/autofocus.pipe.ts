import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Directive({
  selector: '[autofocus]',
})

export class AutofocusDirective implements AfterViewInit {
  @Input('autofocus') autofocus = true;
  constructor(private el: ElementRef) {
  }

  ngAfterViewInit(): void {
    if (!this.autofocus) { return; }

    // Otherwise Angular throws error: Expression has changed after it was checked.
    setTimeout(() => {
      this.el.nativeElement.focus();
    });
  }
}
