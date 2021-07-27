import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface OverlayCloseEvent<T> {
  type: 'backdropClick' | 'close';
  data: T;
}

@Component({
  selector: 'default-overlay',
  template: '',
})
export class DefaultOverlayContainer<T> implements OnInit, OnDestroy {
  private overlayRef: OverlayRef | undefined;
  public afterClosed$ = new Subject<OverlayCloseEvent<any>>();
  public data: T | undefined;

  getRef(): OverlayRef | undefined {
    return this.overlayRef;
  }

  setRef(ref: OverlayRef): this {
    this.overlayRef = ref; return this;
  }

  public get afterClosed(): Observable<OverlayCloseEvent<any>> {
    return this.afterClosed$.asObservable();
  }

  public close<T>(type: 'backdropClick' | 'close' = 'backdropClick', data: T | undefined = undefined): void {
    this.afterClosed$.next({ type, data });
    this.afterClosed$.complete();
    this.overlayRef?.dispose();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.close('backdropClick', this.data);
  }
}
