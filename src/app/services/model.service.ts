import { BehaviorSubject, Observable, of } from "rxjs";
import { map } from "rxjs/operators";

export class ModelService<T> {
  protected items: BehaviorSubject<Record<string, T>> = new BehaviorSubject<Record<string, T>>({});
  protected STORAGE_NAME = '';

  protected load(): Observable<Record<string, T>> {

    const itemString: string | null = localStorage.getItem(this.STORAGE_NAME);
    if (!itemString) { return of({}); }

    const items: Record<string, T> = JSON.parse(itemString);
    return of(items);
  }

  public getItemById(id: string | undefined): T | undefined {
    if (!id) { return undefined; }
    const items: Record<string, any> = this.items.getValue() || {};
    return items[id];
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
  public itemsChanged(): Observable<Record<string, T>> {
    return this.items.asObservable().pipe(map((d: Record<string, T>) => Object.assign({}, d)));
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


    return this.updateItems(items);
  }

  public deleteItem(itemId: string): Observable<Record<string, T>> {
    const items: Record<string, T> = this.items.getValue();
    delete items[itemId];
    return this.updateItems(items);
  }
}
