import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map, tap } from "rxjs";
import { GatherQiItem } from "../models/gatherQiItem.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/app/core/environment/environment";

@Injectable()
export class GatherQiItemsService {

    private _loading$ = new BehaviorSubject<boolean>(false);
    private _gatherQiItems$ = new BehaviorSubject<GatherQiItem[]>([]);
    private lastGatherQiItemsLoad = 0;

    constructor(private http: HttpClient) {}

    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    get gatherQiItems$(): Observable<GatherQiItem[]> {
        return this._gatherQiItems$.asObservable();
    }

    private setLoadingStatus(loading: boolean) {
        this._loading$.next(loading);
    }

    getGatherQiItemsFromServer() {
        if(Date.now() - this.lastGatherQiItemsLoad <= 300000) {
            return;
        }
        this.setLoadingStatus(true);
        this.http.get<GatherQiItem[]>(`${environment.apiUrl}/gatherQiItems`).pipe(
            tap(gatherQiItems => {
                this.lastGatherQiItemsLoad = Date.now();
                this._gatherQiItems$.next(gatherQiItems);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    getGatherQiItemById(id: number): Observable<GatherQiItem> {
        if(!this.lastGatherQiItemsLoad) {
            this.getGatherQiItemsFromServer();
        }
        return this.gatherQiItems$.pipe(
            map(gatherQiItems => gatherQiItems.filter(gatherQiItem => gatherQiItem.id === id)[0])
        );
    }
}