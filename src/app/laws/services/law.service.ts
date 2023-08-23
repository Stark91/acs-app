import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map, tap } from "rxjs";
import { Law } from "../models/law.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/app/core/environment/environment";

@Injectable()
export class LawsService {

    private _loading$ = new BehaviorSubject<boolean>(false);
    private _laws$ = new BehaviorSubject<Law[]>([]);
    private lastLawsLoad = 0;

    constructor(private http: HttpClient) {}

    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    get laws$(): Observable<Law[]> {
        return this._laws$.asObservable();
    }

    private setLoadingStatus(loading: boolean) {
        this._loading$.next(loading);
    }

    getLawsFromServer() {
        if(Date.now() - this.lastLawsLoad <= 300000) {
            return;
        }
        this.setLoadingStatus(true);
        this.http.get<Law[]>(`${environment.apiUrl}/laws`).pipe(
            tap(laws => {
                this.lastLawsLoad = Date.now();
                this._laws$.next(laws);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    getLawById(id: number): Observable<Law> {
        if(!this.lastLawsLoad) {
            this.getLawsFromServer();
        }
        return this.laws$.pipe(
            map(laws => laws.filter(law => law.id === id)[0])
        );
    }
}