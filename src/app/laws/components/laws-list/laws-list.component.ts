import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { Law } from '../../models/law.model';
import { FormBuilder, FormControl } from '@angular/forms';
import { LawType } from '../../enums/law-type.enum';
import { LawsService } from '../../services/law.service';

@Component({
  selector: 'acs-laws-list',
  templateUrl: './laws-list.component.html',
  styleUrls: ['./laws-list.component.scss']
})
export class LawsListComponent implements OnInit {
  
  loading$!: Observable<boolean>;
  earthLaws$!: Observable<Law[]>;
  fireLaws$!: Observable<Law[]>;
  metalLaws$!: Observable<Law[]>;
  noneLaws$!: Observable<Law[]>;
  waterLaws$!: Observable<Law[]>;
  woodLaws$!: Observable<Law[]>;
  lawTypeCtrl!: FormControl;
  lawTypeCtrlOptions!: {
    value: LawType,
    label: string
  }[];
  
  constructor(
    private formBuilder: FormBuilder,
    private lawsService: LawsService
  ) {}

  ngOnInit() {
    this.initForm();
    this.initObservables();
    this.lawsService.getLawsFromServer();
  }

  initForm() {
    this.lawTypeCtrl = this.formBuilder.control(LawType.XIANDAO);
    this.lawTypeCtrlOptions = [
      {value: LawType.XIANDAO, label: 'Xiandao'},
      {value: LawType.SHENDAO, label: 'Shendao'},
      {value: LawType.PHYSICAL, label: 'Physical'}
    ]
  }

  initObservables() {
    this.loading$ = this.lawsService.loading$;

    this.earthLaws$ = this.lawsService.laws$.pipe(
      map(laws => laws.filter(law => law.element.name.toLowerCase() === 'earth'))
    );

    this.fireLaws$ = this.lawsService.laws$.pipe(
      map(laws => laws.filter(law => law.element.name.toLowerCase() === 'fire'))
    );

    this.metalLaws$ = this.lawsService.laws$.pipe(
      map(laws => laws.filter(law => law.element.name.toLowerCase() === 'metal'))
    );

    this.noneLaws$ = this.lawsService.laws$.pipe(
      map(laws => laws.filter(law => law.element.name.toLowerCase() === 'none'))
    );

    this.waterLaws$ = this.lawsService.laws$.pipe(
      map(laws => laws.filter(law => law.element.name.toLowerCase() === 'water'))
    );

    this.woodLaws$ = this.lawsService.laws$.pipe(
      map(laws => laws.filter(law => law.element.name.toLowerCase() === 'wood'))
    );

    const lawType$: Observable<LawType> = this.lawTypeCtrl.valueChanges.pipe(
      startWith(this.lawTypeCtrl.value),
      map(value => value.toLowerCase())
    );

    this.earthLaws$ = combineLatest([
      lawType$,
      this.lawsService.laws$
    ]).pipe(
      map(([lawType, laws]) => laws.filter(law => law['type'].toLowerCase() === (lawType as string) && law.element.name.toLowerCase() === 'earth'))
    );

    this.fireLaws$ = combineLatest([
      lawType$,
      this.lawsService.laws$
    ]).pipe(
      map(([lawType, laws]) => laws.filter(law => law['type'].toLowerCase() === (lawType as string) && law.element.name.toLowerCase() === 'fire'))
    );

    this.metalLaws$ = combineLatest([
      lawType$,
      this.lawsService.laws$
    ]).pipe(
      map(([lawType, laws]) => laws.filter(law => law['type'].toLowerCase() === (lawType as string) && law.element.name.toLowerCase() === 'metal'))
    );

    this.noneLaws$ = combineLatest([
      lawType$,
      this.lawsService.laws$
    ]).pipe(
      map(([lawType, laws]) => laws.filter(law => law['type'].toLowerCase() === (lawType as string) && law.element.name.toLowerCase() === 'none'))
    );

    this.waterLaws$ = combineLatest([
      lawType$,
      this.lawsService.laws$
    ]).pipe(
      map(([lawType, laws]) => laws.filter(law => law['type'].toLowerCase() === (lawType as string) && law.element.name.toLowerCase() === 'water'))
    );

    this.woodLaws$ = combineLatest([
      lawType$,
      this.lawsService.laws$
    ]).pipe(
      map(([lawType, laws]) => laws.filter(law => law['type'].toLowerCase() === (lawType as string) && law.element.name.toLowerCase() === 'wood'))
    );
  }
}
