import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { IFunnel } from "../model/funnel.interface";

@Injectable({
    providedIn: 'root',
})
export class FunnelService {
    private funnels: BehaviorSubject<IFunnel[]> = new BehaviorSubject<IFunnel[]>([]);

    constructor(private http: HttpClient) {
        this.http.get<IFunnel[]>('./assets/pages.json').subscribe((a: IFunnel[]) => {
            this.funnels.next(a);
        });
    }

    getFunnels(): Observable<IFunnel[]> {
        return this.funnels.asObservable();
    }
}
