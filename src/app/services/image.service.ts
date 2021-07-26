import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class ImageService {
    constructor(private http: HttpClient) { }

    public search(term: string, limit: number = 100, offset: number = 0, order: 'popular' | 'latest' = 'popular'): Observable<any> {
        if (!term) { return of(null); }
        let p: HttpParams = new HttpParams();
        p = p.append('q', `${term}`);
        p = p.append('key', '22633755-7545d562ade03d470abc3cfe1');
        p = p.append('lang', 'en');
        p = p.append('page', offset + 1);
        p = p.append('per_page', limit);
        p = p.append('order', order);

        return this.http
            .get(`https://pixabay.com/api/`, { params: p, observe: 'response' })
            .pipe(map((r) => {
                return r.body;
            }));
    }
}
