import { BehaviorSubject, Observable, of } from "rxjs";

export class ModelService<T> {
  public items: BehaviorSubject<Record<string, T>> = new BehaviorSubject<Record<string, T>>({});
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

  public create(id: string, item: T): Observable<void> {
    const list: Record<string, T> = this.items.getValue();
    list[id] = item;
    this.updateItems(list);
    return of(void 0);
  }


  public itemsChanged(): Observable<Record<string, T>> {
    return this.items.asObservable();
  }

  public updateItems(items: Record<string, T>): Observable<Record<string, T>> {
    this.items.next(items);
    return this.store(items);
  }

  public updateProperty(id: string, changes: Record<string, any>): Observable<Record<string, T>> {
    const items: Record<string, T> = this.items.getValue();
    const item: T = items[id];

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
