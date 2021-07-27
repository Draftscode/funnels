import { ConnectionPositionPair, FlexibleConnectedPositionStrategy, GlobalPositionStrategy, Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { ComponentRef, ElementRef, Injectable, InjectionToken, Injector } from '@angular/core';
import { DefaultOverlayContainer } from './default-overlay';

export const CONTAINER_DATA = new InjectionToken<any>('CONTAINER_DATA');

export interface IOverlayData<T> {
  overlayRef: OverlayRef;
  componentRef: ComponentRef<T>;
}

export interface IOverlayOptions {
  clazz?: string;
  backdrop?: boolean;
  positionStrategy?: GlobalPositionStrategy | FlexibleConnectedPositionStrategy | PositionStrategy;
  disableCloseByBackdrop?: boolean;
  overlayOrigin?: 'bottom' | 'top' | 'right';
  postion?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

export interface IOverlayPosition {
  x: number;
  y: number;
}


@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  constructor(
    private injector: Injector,
    private overlay: Overlay,
  ) { }

  private instanceOfIOverlayPosition(pos: any): pos is IOverlayPosition {
    return 'x' in pos && 'y' in pos;
  }

  private getPosition(pos: ElementRef | PointerEvent | MouseEvent | IOverlayPosition | HTMLElement, option: IOverlayOptions) {
    if (!pos) {
      if (option.postion) {
        return this.overlay.position().global().bottom(option.postion.bottom).right(option.postion.right);
      } else {
        return this.overlay.position().global();
      }
    }

    const strat: FlexibleConnectedPositionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.getAnchor(pos))
      .withPositions(this.getPositions(option.overlayOrigin))
      .withPush(true)
      .withViewportMargin(10);

    return strat;

  }

  private getAnchor(pos: ElementRef | PointerEvent | MouseEvent | IOverlayPosition | HTMLElement) {
    if (pos instanceof ElementRef) {
      return (pos).nativeElement;
    } else if (pos instanceof MouseEvent || pos instanceof PointerEvent || this.instanceOfIOverlayPosition(pos)) {
      return { x: pos.x + 15, y: pos.y + 10 };
    } else if (pos instanceof HTMLElement) {
      return pos;
    }
  }

  /**
   * gets prefered positions for contextmenu
   * @returns ConnectionPositionPair[]
   */
  private getPositions(overlayOrigin: 'bottom' | 'top' | 'right' = 'top'): ConnectionPositionPair[] {
    if (overlayOrigin === 'top') {
      return [{
        originX: 'center',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      }, {
        originX: 'center',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
      }];
    } else if (overlayOrigin === 'right') {
      return [{
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
      }];
    }
    else {
      return [{
        originX: 'center',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'bottom',
      }, {
        originX: 'center',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
      }];
    }
  }

  public create<T extends DefaultOverlayContainer<any>>(
    popupCmp: ComponentType<T>,
    el: ElementRef | PointerEvent | MouseEvent | IOverlayPosition | HTMLElement,
    dataToPass: any, options: IOverlayOptions = {}): IOverlayData<T> {
    const positionStrategy = options?.positionStrategy ? options.positionStrategy : this.getPosition(el, options);

    const overlayRef: OverlayRef = this.overlay.create({
      hasBackdrop: options && typeof (options.backdrop) === 'boolean' ? options.backdrop : true,
      positionStrategy,
      backdropClass: 'custom-backdrop',
    });

    overlayRef.addPanelClass('saxms-system-message');
    overlayRef.backdropClick().subscribe(() => {
      if (options && options.disableCloseByBackdrop) {
        return;
      }
      overlayRef.dispose();
    });

    const overlayPortal: ComponentPortal<T> = new ComponentPortal(popupCmp, null, this.createInjector(dataToPass));
    const cmpRef: ComponentRef<T> = overlayRef.attach(overlayPortal);
    cmpRef.instance.setRef(overlayRef);

    return { overlayRef: overlayRef, componentRef: cmpRef };
  }

  private createInjector(dataToPass: any): Injector {
    return Injector.create({
      providers: [
        { provide: CONTAINER_DATA, useValue: dataToPass },
      ],
    });
  }
}

