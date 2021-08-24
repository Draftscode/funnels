import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";

export class ModelService<T> {
  protected items: BehaviorSubject<Record<string, T>> = new BehaviorSubject<Record<string, T>>({});
  protected STORAGE_NAME = '';
  protected updated: Subject<T> = new Subject<T>();

  public afterItemUpdated(): Observable<T> {
    return this.updated.asObservable().pipe(map((r: T) =>
      JSON.parse(JSON.stringify(r))));
  }

  protected load(): Observable<Record<string, T>> {

    const itemString: string | null = localStorage.getItem(this.STORAGE_NAME);
    if (!itemString) { return of({}); }

    const items: Record<string, T> = JSON.parse(itemString);
    return of(items);
  }

  public getItemById(id: string | undefined): Observable<T | undefined> {
    if (!id) { return of(undefined); }
    const items: Record<string, any> = this.items.getValue() || {};
    return of(items[id]);
  }

  /**
   * get items by ids
   * @param {string[]} ids list of ids
   * @returns Observable<Record<string, T>>
   */
  public getItemsById(ids: string[] | undefined): Observable<Record<string, T>> {
    if (!ids || ids.length === 0) { return of({}); }
    const items: Record<string, T> = JSON.parse(JSON.stringify(this.items.getValue()));
    Object.keys(items || []).forEach((key: string) => {
      if (ids.includes(key)) { return; }
      delete items[key];
    });
    return of(items);

  }

  private store(items: Record<string, T>): Observable<Record<string, T>> {
    const saveString: string = JSON.stringify(items);
    localStorage.setItem(this.STORAGE_NAME, saveString);

    return of(items);
  }

  public create(id: string, item: T): Observable<T> {
    const list: Record<string, T> = this.items.getValue();
    list[id] = item;
    this.updateItems(list);
    return of(item);
  }

  /**
   * gets a copy of the current items
   * @returns Observable<Record<string, T>>
   */
  public itemsChanged(ids: string[] | undefined = undefined): Observable<Record<string, T>> {
    return this.items.asObservable().pipe(map((d: Record<string, T>) => {
      const r: Record<string, T> = Object.assign({}, d);
      (ids || []).forEach((id: string) => delete r[id]);
      return r;
    }));
  }

  public updateItems(items: Record<string, T>): Observable<Record<string, T>> {
    this.items.next(items);
    return this.store(items);
  }

  public updateProperty(id: string, changes: Record<string, any>): Observable<Record<string, T>> {
    const items: Record<string, T> = this.items.getValue();
    const item: T = items[id];
    console.warn(`[update property]`, changes, item);
    const newItem: T = Object.assign(item, changes);
    items[id] = newItem;
    return this.updateItems(items).pipe(tap(() => {
      this.updated.next(items[id]);
    }));
  }

  public deleteItem(itemId: string): Observable<Record<string, T>> {
    const items: Record<string, T> = this.items.getValue();
    delete items[itemId];
    return this.updateItems(items);
  }
}
