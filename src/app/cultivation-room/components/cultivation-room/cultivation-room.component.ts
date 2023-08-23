import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Observable, map, startWith } from 'rxjs';
import { GatherQiItemsService } from '../../services/gatherQiItem.service';
import { GatherQiItem } from '../../models/gatherQiItem.model';
import { environment } from 'src/app/core/environment/environment';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'acs-cultivation-room',
  templateUrl: './cultivation-room.component.html',
  styleUrls: ['./cultivation-room.component.scss']
})
export class CultivationRoomComponent implements OnInit {

  step = -1;

  size = 7;
  sizeCtrl!: FormControl;
  cushionTile = Math.trunc((this.size**2 - 1) / 2);
  gridWidth = this.size * 30;
  tiles!: {
    id: number,
    item: GatherQiItem,
    coordinates: {
      x: number,
      y: number
    } 
  }[];
  totalGatherQiOnCushion!: number;
  currentItem!: GatherQiItem;

  loadingGatherQiItems$!: Observable<boolean>;
  earthGatherQiItems$!: Observable<GatherQiItem[]>;
  fireGatherQiItems$!: Observable<GatherQiItem[]>;
  metalGatherQiItems$!: Observable<GatherQiItem[]>;
  noneGatherQiItems$!: Observable<GatherQiItem[]>;
  waterGatherQiItems$!: Observable<GatherQiItem[]>;
  woodGatherQiItems$!: Observable<GatherQiItem[]>;

  gatherQiImgSrcUrl = `${environment.imageUrl}/gather-qi-items`;
  gatherQiButtonImgSrc = `${this.gatherQiImgSrcUrl}/none.webp`
  elementImgSrcUrl = `${environment.imageUrl}/elements`;
  
  isSpiritSoil!: boolean;
  isQiCushion!: boolean;
  spiritSoilCtrl!: FormControl;
  qiCushionCtrl!: FormControl;

  constructor(
    private gatherQiItemsService: GatherQiItemsService,
    private renderer: Renderer2,
    private el: ElementRef,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.initTiles();
    this.initObservables();
    this.gatherQiItemsService.getGatherQiItemsFromServer();
    this.totalGatherQiOnCushion = this.getTotalGatherQiOnCushion();
  }

  initForm() {
    this.sizeCtrl = this.formBuilder.control('7');
    this.spiritSoilCtrl = this.formBuilder.control(false);
    this.qiCushionCtrl = this.formBuilder.control(false);

    this.sizeCtrl.valueChanges.pipe(
      startWith(this.sizeCtrl.value),
      map(value => {
        this.size = value;
        this.cushionTile = Math.trunc((value**2 - 1) / 2);
        this.gridWidth = 30*value;
        this.initTiles();
      })
    ).subscribe();
    this.spiritSoilCtrl.valueChanges.pipe(
      startWith(this.spiritSoilCtrl.value),
      map(value => {
        this.isSpiritSoil = value;
        this.totalGatherQiOnCushion = this.getTotalGatherQiOnCushion();
      })
    ).subscribe();
    this.qiCushionCtrl.valueChanges.pipe(
      startWith(this.qiCushionCtrl.value),
      map(value => {
        this.isQiCushion = value;
        this.totalGatherQiOnCushion = this.getTotalGatherQiOnCushion();
      })
    ).subscribe();
  }

  initObservables() {
    this.loadingGatherQiItems$ = this.gatherQiItemsService.loading$;

    this.earthGatherQiItems$ = this.gatherQiItemsService.gatherQiItems$.pipe(
      map(items => items.filter(item => item.element.name.toLowerCase() === 'earth'))
    );
    
    this.fireGatherQiItems$ = this.gatherQiItemsService.gatherQiItems$.pipe(
      map(items => items.filter(item => item.element.name.toLowerCase() === 'fire'))
    );
    
    this.metalGatherQiItems$ = this.gatherQiItemsService.gatherQiItems$.pipe(
      map(items => items.filter(item => item.element.name.toLowerCase() === 'metal'))
    );
    
    this.noneGatherQiItems$ = this.gatherQiItemsService.gatherQiItems$.pipe(
      map(items => items.filter(item => item.element.name.toLowerCase() === 'none'))
    );
    
    this.waterGatherQiItems$ = this.gatherQiItemsService.gatherQiItems$.pipe(
      map(items => items.filter(item => item.element.name.toLowerCase() === 'water'))
    );
    
    this.woodGatherQiItems$ = this.gatherQiItemsService.gatherQiItems$.pipe(
      map(items => items.filter(item => item.element.name.toLowerCase() === 'wood'))
    );
  }

  initTiles() {
    this.tiles = Array.from(Array(this.size**2), (x, i) => {
      return {
        id: i,
        item: new GatherQiItem,
        coordinates: {
          x: (i % this.size) - Math.trunc(this.size / 2),
          y: Math.trunc(i / this.size) - Math.trunc(this.size / 2)
        }
      }
    });
  }

  getTotalGatherQiOnCushion(): number {
    let gatherQi = 0;
    gatherQi += this.isSpiritSoil ? 40 : 0;
    gatherQi += this.isQiCushion ? 60 : 0;
    if(this.tiles) {
      this.tiles.forEach(tile => {
        const x = tile.coordinates.x;
        const y = tile.coordinates.y;
        const distance = this.getDistanceFromCushion(x, y);
        if(tile.item.id) {
          gatherQi += this.getGatherQiOnCushion(distance, tile.item);
        }
      })
    }
    return gatherQi;
  }

  getGatherQiOnCushion(distance: number, item: GatherQiItem): number {
    let gatherQi = 0;
    if(distance <= item.gatherQi.range - 1) {
      gatherQi = item.gatherQi.power * item.gatherQi.decay**(Math.max(0, distance - item.gatherQi.startDecay))
    }
    return gatherQi;
  }

  getDistanceFromCushion(x: number, y: number): number {
    return Math.sqrt(x**2 + y**2);
  }

  setCurrentItem(item: GatherQiItem) {
    this.currentItem = item;
  }

  setTileCurrentItem(tileId: number) {
    if(this.currentItem) {
      this.tiles[tileId].item = this.currentItem;
      const btnElement = (<HTMLElement>this.el.nativeElement).querySelector(`.tile-${tileId}`);
      this.renderer.setStyle(btnElement, 'background-image', `url("${this.gatherQiImgSrcUrl}/${this.currentItem.image}")`);
      this.totalGatherQiOnCushion = this.getTotalGatherQiOnCushion();
    }
  }

  clearGrid() {
    this.tiles.forEach(tile => {
      if(tile.id !== this.cushionTile) {
        tile.item = new GatherQiItem;
        const btnElement = (<HTMLElement>this.el.nativeElement).querySelector(`.tile-${tile.id}`);
        this.renderer.setStyle(btnElement, 'background-image', `url("${this.gatherQiButtonImgSrc}")`);
      }
    });
    this.totalGatherQiOnCushion = this.getTotalGatherQiOnCushion();
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}

