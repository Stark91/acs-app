import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable, delay, map, tap } from 'rxjs';
import { PolicyEvent } from '../models/policy-event.model';
import { environment } from 'src/app/core/environment/environment';

@Injectable()
export class PolicyEventsService {

    private _loading$ = new BehaviorSubject<boolean>(false);
    private _events$ = new BehaviorSubject<PolicyEvent[]>([]);
    private lastEventsLoad = 0;

    constructor(private http: HttpClient) {}

    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    get events$(): Observable<PolicyEvent[]> {
        return this._events$.asObservable();
    }

    private setLoadingStatus(loading: boolean) {
        this._loading$.next(loading);
    }

    getEventsFromServer() {
        if(Date.now() - this.lastEventsLoad <= 300000) {
            return;
        }
        this.setLoadingStatus(true);
        this.http.get<PolicyEvent[]>(`${environment.apiUrl}/events`).pipe(
            tap(events => {
                this.lastEventsLoad = Date.now();
                this._events$.next(events);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    getEventById(id: number): Observable<PolicyEvent> {
        if(!this.lastEventsLoad) {
            this.getEventsFromServer();
        }
        return this.events$.pipe(
            map(events => events.filter(event => event.id === id)[0])
        );
    }
}