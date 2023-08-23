import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, tap } from 'rxjs';
import { Outcome } from '../models/outcome.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/core/environment/environment';

@Injectable()
export class OutcomesService {

    private _loading$ = new BehaviorSubject<boolean>(false);
    private _outcomes$ = new BehaviorSubject<Outcome[]>([]);
    private lastOutcomesLoad = 0;

    constructor(private http: HttpClient) {}

    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    get outcomes$(): Observable<Outcome[]> {
        return this._outcomes$.asObservable();
    }

    private setLoadingStatus(loading: boolean) {
        this._loading$.next(loading);
    }

    getOutcomesFromServer() {
        if(Date.now() - this.lastOutcomesLoad <= 300000) {
            return;
        }
        this.setLoadingStatus(true);
        this.http.get<Outcome[]>(`${environment.apiUrl}/outcomes`).pipe(
            tap(outcomes => {
                this.lastOutcomesLoad = Date.now();
                this._outcomes$.next(outcomes);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    getOutcomeByEvent(eventId: Number): Observable<Outcome[]> {
        if(!this.lastOutcomesLoad) {
            this.getOutcomesFromServer();
        }
        return this.outcomes$.pipe(
            map(outcomes => outcomes.filter(outcome => outcome.event === eventId))
        )
    }
}