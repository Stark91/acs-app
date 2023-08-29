import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map, tap } from "rxjs";
import { Terrain } from "../models/terrain.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/app/core/environment/environment";

@Injectable()
export class TerrainsService {

    private _loading$ = new BehaviorSubject<boolean>(false);
    private _terrains$ = new BehaviorSubject<Terrain[]>([]);
    private lastTerrainsLoad = 0;

    constructor(private http: HttpClient) {}

    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    get terrains$(): Observable<Terrain[]> {
        return this._terrains$.asObservable();
    }

    private setLoadingStatus(loading: boolean) {
        this._loading$.next(loading);
    }

    getTerrainsFromServer() {
        if(Date.now() - this.lastTerrainsLoad <= 300000) {
            return;
        }
        this.setLoadingStatus(true);
        this.http.get<Terrain[]>(`${environment.apiUrl}/terrains`).pipe(
            tap(terrains => {
                this.lastTerrainsLoad = Date.now();
                this._terrains$.next(terrains);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    getTerrainByName(name: string): Observable<Terrain> {
        if(!this.lastTerrainsLoad) {
            this.getTerrainsFromServer();
        }
        return this.terrains$.pipe(
            map(terrains => terrains.filter(terrain => terrain.name.toLowerCase() === name.toLowerCase())[0])
        );
    }
}