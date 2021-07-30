import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { IWidget } from "src/app/model/widget.interface";
import { CreateWidget, GetAllWidgets } from "./widget.actions";

export const WIDGET_STORAGE_NAME = 'widget';

export interface IWidgetStateModel {
  ids: string[];
  entities: Record<string, IWidget>;
}

@State<IWidgetStateModel>({
  name: WIDGET_STORAGE_NAME,
  defaults: {
    ids: [],
    entities: {},
  },
})
@Injectable()
export class WidgetState {
  constructor(private http: HttpClient) {
  }

  @Selector()
  static getItemsByIdFn(state: IWidgetStateModel) {
    return (ids: string[]) => {
      return ids.map((id: string) => state.entities[id]);
    };
  }

  @Action(GetAllWidgets)
  getAllPages({ patchState, getState }: StateContext<IWidgetStateModel>) {
    return this.load().pipe(tap((f: IWidget[]) => {
      const entities: Record<string, IWidget> = {};

      f.forEach((f: IWidget) => {
        entities[f.id] = f;
      });

      patchState({
        ids: [...f.map((f: IWidget) => f.id)],
        entities,
      });
    }));
  }

  @Action(CreateWidget)
  createWidget({ patchState, getState }: StateContext<IWidgetStateModel>, { payload }: CreateWidget) {
    const state = getState();
    const entities: Record<string, IWidget> = {
      ...state.entities,
      [payload.id]: payload,
    };

    console.log(entities, payload);

    return this.store(Object.keys(entities).map((key: string) => entities[key])).pipe(tap(() => {
      patchState({
        ids: [...state.ids, payload.id],
        entities,
      });
    }));
  }

  /**
   * stores data locally
   * @param {IWidget[]} widgets widgets to store
   * @returns Observable<IWidget[]>
   */
  private store(widgets: IWidget[]): Observable<IWidget[]> {
    const s: string = JSON.stringify(widgets);
    localStorage.setItem(WIDGET_STORAGE_NAME, s);
    return of(widgets);
  }

  /**
   * load all widgets
   * @returns Observable<IWidget[]>
   */
  private load(): Observable<IWidget[]> {
    const itemString: string | null = localStorage.getItem(WIDGET_STORAGE_NAME);
    if (!itemString) { return of([]) };

    const items: IWidget[] = JSON.parse(itemString);
    return of(items);
  }
}
