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

  //i18n
  cultivationRoomTitle = $localize`:@@cultivationRoom:Cultivation room`;
  cultivationRoomDescription = $localize`:@@cultivationRoomDescription:Select Gather Qi items by clicking on tiles to simulate cultivation room and get Qi amount on the breakthrough tile (center).`
  spiritSoilCtrlTooltip = $localize`:@@spiritSoilCtrlTooltip:Spirit soil add 40 Qi on the tile`;
  spiritSoilCtrlLabel = $localize`:@@spiritSoilCtrlLabel:Cushion on spirit soil`;
  qiCushionCtrlTooltip = $localize`:@@qiCushionCtrlTooltip:Qi Cushion add 60 Qi on the tile`;
  qiCushionCtrlLabel = $localize`:@@qiCushionCtrlLabel:Cushion is Qi Cushion`;
  sizeCtrlLabel = $localize`:@@sizeCtrlLabel:Size`;
  clearGridButtonLabel = $localize`:@@clearGridButtonLabel:Clear grid`;
  totalGatherQiOnCushionButtonLabel = $localize`:@@totalGatherQiOnCushionButtonLabel:Gathered Qi on cushion`;
  earthLabel = $localize`:@@earth:Earth`;
  fireLabel = $localize`:@@fire:Fire`;
  metalLabel = $localize`:@@metal:Metal`;
  noneLabel = $localize`:@@none:None`;
  waterLabel = $localize`:@@water:Water`;
  woodLabel = $localize`:@@wood:Wood`;
  earthEmitButtonTooltip = $localize`:@@earthEmitButtonTooltip:Earth element strength`;
  fireEmitButtonTooltip = $localize`:@@fireEmitButtonTooltip:Fire element strength`;
  metalEmitButtonTooltip = $localize`:@@matelEmitButtonTooltip:Metal element strength`;
  waterEmitButtonTooltip = $localize`:@@waterEmitButtonTooltip:Water element strength`;
  woodEmitButtonTooltip = $localize`:@@woodEmitButtonTooltip:Wood element strength`;
  
  //expansion panels
  step = -1;

  //grid
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
  isSpiritSoil!: boolean;
  isQiCushion!: boolean;
  spiritSoilCtrl!: FormControl;
  qiCushionCtrl!: FormControl;
  elements!: {
    earthEmit: number,
    fireEmit: number,
    metalEmit: number,
    waterEmit: number,
    woodEmit: number
  };
  elementsStrength!: {
    earthStrength: number,
    fireStrength: number,
    metalStrength: number,
    waterStrength: number,
    woodStrength: number
  }

  //observables
  loadingGatherQiItems$!: Observable<boolean>;
  earthGatherQiItems$!: Observable<GatherQiItem[]>;
  fireGatherQiItems$!: Observable<GatherQiItem[]>;
  metalGatherQiItems$!: Observable<GatherQiItem[]>;
  noneGatherQiItems$!: Observable<GatherQiItem[]>;
  waterGatherQiItems$!: Observable<GatherQiItem[]>;
  woodGatherQiItems$!: Observable<GatherQiItem[]>;

  //image url
  gatherQiImgSrcUrl = `${environment.imageUrl}/gather-qi-items`;
  gatherQiButtonImgSrc = `${this.gatherQiImgSrcUrl}/none.webp`
  elementImgSrcUrl = `${environment.imageUrl}/elements`;

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
    this.elements = this.getElementsOnCushion();
    this.elementsStrength = this.getElementsStrengthOnCushion();
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

  getElementsOnCushion(): {earthEmit: number, fireEmit: number, metalEmit: number, waterEmit: number, woodEmit: number} {
    let elements = {earthEmit: 0, fireEmit: 0, metalEmit: 0, waterEmit: 0, woodEmit: 0};
    if(this.tiles) {
      this.tiles.forEach(tile => {
        const x = tile.coordinates.x;
        const y = tile.coordinates.y;
        const distance = this.getDistanceFromCushion(x, y);
        if(tile.item.id) {
          switch (tile.item.element.name.toLowerCase()) {
            case 'earth':
              elements.earthEmit += this.getElementEmitOnCushion(distance, tile.item);
              break;
            case 'fire':
              elements.fireEmit += this.getElementEmitOnCushion(distance, tile.item);
              break;
            case 'metal':
              elements.metalEmit += this.getElementEmitOnCushion(distance, tile.item);
              break;
            case 'water':
              elements.waterEmit += this.getElementEmitOnCushion(distance, tile.item);
              break;
            case 'wood':
              elements.woodEmit += this.getElementEmitOnCushion(distance, tile.item);
              break;
          }
        }
      })
    }
    return elements;
  }

  getElementEmitOnCushion(distance: number, item: GatherQiItem): number {
    let elementEmit = 0;
    if(distance <= item.elementEmit.range - 1) {
      elementEmit = item.elementEmit.power * item.elementEmit.decay**(Math.max(0, distance - item.elementEmit.startDecay))
    }
    return elementEmit;
  }

  getElementsStrengthOnCushion(): {earthStrength: number, fireStrength: number, metalStrength: number, waterStrength: number, woodStrength: number} {
    let elementsStrength = {earthStrength: 0, fireStrength: 0, metalStrength: 0, waterStrength: 0, woodStrength: 0};
    let totalElements = this.elements.earthEmit + this.elements.fireEmit + this.elements.metalEmit + this.elements.waterEmit + this.elements.woodEmit;
    if(totalElements > 0) {
      let earthEmitRatio = this.elements.earthEmit / totalElements;
      let fireEmitRatio = this.elements.fireEmit / totalElements;
      let metalEmitRatio = this.elements.metalEmit / totalElements;
      let waterEmitRatio = this.elements.waterEmit / totalElements;
      let woodEmitRatio = this.elements.woodEmit / totalElements;
      elementsStrength.earthStrength = 2 * (fireEmitRatio - woodEmitRatio) + earthEmitRatio;
      elementsStrength.fireStrength = 2 * (woodEmitRatio - waterEmitRatio) + fireEmitRatio;
      elementsStrength.metalStrength = 2 * (earthEmitRatio - fireEmitRatio) + metalEmitRatio;
      elementsStrength.waterStrength = 2 * (metalEmitRatio - earthEmitRatio) + waterEmitRatio;
      elementsStrength.woodStrength = 2 * (waterEmitRatio - metalEmitRatio) - woodEmitRatio;
    }
    return elementsStrength;
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
      this.elements = this.getElementsOnCushion();
      this.elementsStrength = this.getElementsStrengthOnCushion();
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
}

