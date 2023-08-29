import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map, tap } from "rxjs";
import { Flooring } from "../models/flooring.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/app/core/environment/environment";

@Injectable()
export class FlooringsService {

    private _loading$ = new BehaviorSubject<boolean>(false);
    private _floorings$ = new BehaviorSubject<Flooring[]>([]);
    private lastFlooringsLoad = 0;

    constructor(private http: HttpClient) {}

    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    get floorings$(): Observable<Flooring[]> {
        return this._floorings$.asObservable();
    }

    private setLoadingStatus(loading: boolean) {
        this._loading$.next(loading);
    }

    getFlooringsFromServer() {
        if(Date.now() - this.lastFlooringsLoad <= 300000) {
            return;
        }
        this.setLoadingStatus(true);
        this.http.get<Flooring[]>(`${environment.apiUrl}/floorings`).pipe(
            tap(floorings => {
                this.lastFlooringsLoad = Date.now();
                this._floorings$.next(floorings);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    getFlooringByName(name: string): Observable<Flooring> {
        if(!this.lastFlooringsLoad) {
            this.getFlooringsFromServer();
        }
        return this.floorings$.pipe(
            map(floorings => floorings.filter(flooring => flooring.name.toLowerCase() === name.toLowerCase())[0])
        );
    }
}