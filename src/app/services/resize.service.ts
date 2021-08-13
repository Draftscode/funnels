import { Injectable, NgZone } from '@angular/core';
import { ResizeObserver } from '@juggle/resize-observer';
import { ResizeEvent } from '../model/resize-event';
import { IResizeOptions } from '../model/resize-options.interface';
import { EResizeType } from '../model/resize-type.enum';
import { GlobalUtils } from '../utils/global.utils';

@Injectable({
  providedIn: 'root',
})
export class ResizeService {
  private _observers: { [key: string]: ResizeObserver } = {};

  constructor(private _zone: NgZone) { }

  /**
   * creates a new ResizeObserver
   * @param {HTMLElement[]} elements list of elements where the observer should listen to
   * @param {(entry:ResizeEvent)=>void}
   * @returns string
   */
  public create(element: HTMLElement, cb: (entry: ResizeEvent) => void, options: IResizeOptions = {
    types: [EResizeType.WIDTH, EResizeType.HEIGHT],
  }, debug = false): string {
    const id: string = GlobalUtils.uuidv4();
    const event: ResizeEvent = new ResizeEvent(element.clientWidth, element.clientHeight);
    // const subject: Subject<ResizeObserverEntry> = new Subject<ResizeObserverEntry>();
    const observer: ResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      entries.forEach((entry: ResizeObserverEntry) => {
        if (!this.$hasChanged(options.types, element, event, entry, debug)) { return; }
        event.setOldWidth(event.getNewWidth());
        event.setOldHeight(event.getNewHeight());
        event.setNewWidth(entry.contentRect.width);
        event.setNewHeight(entry.contentRect.height);
        cb(event);
      });
    });

    observer.observe(element);
    cb(event);
    this._observers[id] = observer;
    return id;
  }

  /**
   * check if change will notify its client based on the defined resize types
   * @param {EResizeType[]} types list of types to check for
   * @param {HTMLElement} elem element to check againts
   * @param {ResizeEvent} curEvent currently stored dimensions
   * @returns boolean
   */
  private $hasChanged(types: EResizeType[], elem: HTMLElement, curEvent: ResizeEvent, entry: ResizeObserverEntry, debug = false): boolean {
    const found: boolean = types.find((t: EResizeType) => {
      if (t === EResizeType.WIDTH) {
        return entry.contentRect.width !== curEvent.getNewWidth() ? true : false;
      } else if (t === EResizeType.HEIGHT) {
        return entry.contentRect.height !== curEvent.getNewHeight() ? true : false;
      }
      return false;
    }) ? true : false;

    return found;
  }

  /**
   * completes resize observer and disconnect all html elements
   * @param {string} id identifier of the ResizeObserver
   * @returns void
   */
  public complete(...ids: string[]): void {
    ids.forEach((id: string) => {
      if (!this._observers[id]) { return; }
      this._observers[id].disconnect();
      // this._observers[id].subject.complete();
      delete this._observers[id];
    });
  }
}
