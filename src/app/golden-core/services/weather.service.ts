import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map, tap } from "rxjs";
import { Weather } from "../models/weather.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/app/core/environment/environment";

@Injectable()
export class WeathersService {

    private _loading$ = new BehaviorSubject<boolean>(false);
    private _weathers$ = new BehaviorSubject<Weather[]>([]);
    private lastWeathersLoad = 0;

    constructor(private http: HttpClient) {}

    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    get weathers$(): Observable<Weather[]> {
        return this._weathers$.asObservable();
    }

    private setLoadingStatus(loading: boolean) {
        this._loading$.next(loading);
    }

    getWeathersFromServer() {
        if(Date.now() - this.lastWeathersLoad <= 300000) {
            return;
        }
        this.setLoadingStatus(true);
        this.http.get<Weather[]>(`${environment.apiUrl}/weathers`).pipe(
            tap(weathers => {
                this.lastWeathersLoad = Date.now();
                this._weathers$.next(weathers);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    getWeatherById(id: number): Observable<Weather> {
        if(!this.lastWeathersLoad) {
            this.getWeathersFromServer();
        }
        return this.weathers$.pipe(
            map(weathers => weathers.filter(weather => weather.id === id)[0])
        );
    }
}