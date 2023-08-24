import { Component, Input, OnInit } from '@angular/core';
import { Law } from '../../models/law.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'acs-xiandao-law-match-form',
  templateUrl: './xiandao-law-match-form.component.html',
  styleUrls: ['./xiandao-law-match-form.component.scss']
})
export class XiandaoLawMatchFormComponent implements OnInit {

  //i18n
  cultivatorStatsTitle = $localize`:@@cultivatorStats:Cultivator stats`;
  charismaInputLabel = $localize`:@@charisma:Charisma`;
  constitutionInputLabel = $localize`:@@constitution:Constitution`;
  intelligenceInputLabel = $localize`:@@intelligence:Intelligence`;
  luckInputLabel = $localize`:@@luck:Luck`;
  perceptionInputLabel = $localize`:@@perception:Perception`;
  inputErrorMin = $localize`:@@inputErrorMin:Value must be greater than or equal to`;
  inputErrorMax = $localize`:@@inputErrorMax:Value must be lower than or equal to`;
  lawMatchButtonText = $localize`:@@lawMatch:Law match`;

  @Input() law!: Law;
  charismaCtrl!: FormControl;
  constitutionCtrl!: FormControl;
  intelligenceCtrl!: FormControl;
  luckCtrl!: FormControl;
  perceptionCtrl!: FormControl;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.charismaCtrl = this.formBuilder.control('0', [Validators.max(10), Validators.min(0)]);
    this.constitutionCtrl = this.formBuilder.control('0', [Validators.max(10), Validators.min(0)]);
    this.intelligenceCtrl = this.formBuilder.control('0', [Validators.max(10), Validators.min(0)]);
    this.luckCtrl = this.formBuilder.control('0', [Validators.max(10), Validators.min(0)]);
    this.perceptionCtrl = this.formBuilder.control('0', [Validators.max(10), Validators.min(0)]);
    if(this.law.stats.charisma === 0) {
      this.charismaCtrl.disable();
    }
    if(this.law.stats.constitution === 0) {
      this.constitutionCtrl.disable();
    }
    if(this.law.stats.intelligence === 0) {
      this.intelligenceCtrl.disable();
    }
    if(this.law.stats.luck === 0) {
      this.luckCtrl.disable();
    }
    if(this.law.stats.perception === 0) {
      this.perceptionCtrl.disable();
    }
  }

  getLawMatch(): number {
    let lawMatch = 1;
    let charismaMatch = false;
    let constitutionMatch = false;
    let intelligenceMatch = false;
    let luckMatch = false;
    let perceptionMatch = false;
    this.charismaCtrl.valueChanges.pipe(
      startWith(this.charismaCtrl.value),
      map(value => {
        lawMatch += this.getLawMatchAttributeComparison(this.law.stats.charisma, value);
        charismaMatch = this.getLawMatchRequirement(this.law.stats.charisma, value);
      })
    ).subscribe();
    this.constitutionCtrl.valueChanges.pipe(
      startWith(this.constitutionCtrl.value),
      map(value => {
        lawMatch += this.getLawMatchAttributeComparison(this.law.stats.constitution, value);
        constitutionMatch = this.getLawMatchRequirement(this.law.stats.constitution, value);
      })
    ).subscribe();
    this.intelligenceCtrl.valueChanges.pipe(
      startWith(this.intelligenceCtrl.value),
      map(value => {
        lawMatch += this.getLawMatchAttributeComparison(this.law.stats.intelligence, value);
        intelligenceMatch = this.getLawMatchRequirement(this.law.stats.intelligence, value);
      })
    ).subscribe();
    this.luckCtrl.valueChanges.pipe(
      startWith(this.luckCtrl.value),
      map(value => {
        lawMatch += this.getLawMatchAttributeComparison(this.law.stats.luck, value);
        luckMatch = this.getLawMatchRequirement(this.law.stats.luck, value);
      })
    ).subscribe();
    this.perceptionCtrl.valueChanges.pipe(
      startWith(this.perceptionCtrl.value),
      map(value => {
        lawMatch += this.getLawMatchAttributeComparison(this.law.stats.perception, value);
        perceptionMatch = this.getLawMatchRequirement(this.law.stats.perception, value);
      })
    ).subscribe();
    if(charismaMatch && constitutionMatch && intelligenceMatch && luckMatch && perceptionMatch) {
      lawMatch += 0.25;
    }
    if(lawMatch < 0.5) {
      lawMatch = 0.5;
    }
    return lawMatch;
  }

  getLawMatchAttributeComparison(lawStat: number, cultivatorStat: number): number {
    let requirement = 0;
    if(cultivatorStat < lawStat) {
      requirement = -0.2 * (lawStat - cultivatorStat);
    }
    if(cultivatorStat > lawStat) {
      requirement = 0.04 * (cultivatorStat - lawStat);
    }
    return requirement;
  }

  getLawMatchRequirement(lawStat: number, cultivatorStat: number): boolean {
    return cultivatorStat >= lawStat;
  }
}
