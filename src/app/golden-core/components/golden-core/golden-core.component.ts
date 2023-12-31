import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { environment } from 'src/app/core/environment/environment';
import { WeathersService } from '../../services/weather.service';
import { Weather } from '../../models/weather.model';

@Component({
  selector: 'acs-golden-core',
  templateUrl: './golden-core.component.html',
  styleUrls: ['./golden-core.component.scss']
})
export class GoldenCoreComponent implements OnInit {

  //i18n
  goldenCoreTitle = $localize`:@@goldenCore:Golden core`;
  goldenCoreDescription = $localize`:@@goldenCoreDescription:Enter factors to get an estimated total golden core score.`;
  inputErrorMin = $localize`:@@inputErrorMin:Value must be greater than or equal to`;
  inputErrorMax = $localize`:@@inputErrorMax:Value must be lower than or equal to`;
  tileQiInputLabel = $localize`:@@tileQi:Tile Qi`;
  tileQiInputTooltip = $localize`:@@tileQiInputTooltip:You can calculate your tile qi on the Cultivation Room page.`;
  lawMatchInputLabel = $localize`:@@lawMatch:Law match`;
  lawMatchInputTooltip = $localize`:@@lawMatchInputTooltip:You can calculate your law match after choosing a law on the Laws page.`;
  luckInputLabel = $localize`:@@luck:Luck`;
  luckInputTooltip = $localize`:@@luckInputTooltip:Your cultivator luck stat.`;
  mentalStateInputLabel = $localize`:@@mentalState:Mental state`;
  mentalStateInputTooltip = $localize`:@@mentalStateInputTooltip:Your cultivator mental state.`;
  yinYangInputLabel = $localize`:@@yinYang:Yin yang`;
  yinYangInputTooltip = $localize`:@@yinYangInputTooltip:Average is near 1, it depends on day of the year, hour of the day, weather (ambiant light).`;
  weatherInputLabel = $localize`:@@weather:Weather`;
  weatherInputTooltip = $localize`:@@weatherInputTooltip:Select the weathers that contribute to your law element. Air of Cultivation contributes to any element.`;
  seasonInputLabel = $localize`:@@season:Season`;
  seasonInputTooltip = $localize`:@@seasonInputTooltip:You can estimate season factor at ACS Fandom Wiki > Golden Core Breakthrough > Season.`;
  tileElementInputLabel = $localize`:@@tileElement:Tile element`;
  tileElementInputTooltip = $localize`:@@tileElementInputTooltip:Max bonus is 1.85+ and is equivalent to +++++ in game (depends on ground, flooring, element emitters and weather).`;
  maxQiInputLabel = $localize`:@@maxQi:Max Qi`;
  maxQiInputTooltip = $localize`:@@maxQiInputTooltip:Your cultivator Max Qi. Max Qi determines the breakthrough duration.`;
  weatherContributeForText = $localize`:@@contributeFor:contribute for`;
  weatheratTheLevelOfText = $localize`:@@atTheLevelOf:at the level of`;
  scorePerSecondButtonText = $localize`:@@scorePerSecond:Score per second`;
  durationButtonText = $localize`:@@duration:Duration`;
  durationButtonTooltip = $localize`:@@durationButtonTooltip:An in-game day is 600s.`;
  totalScoreButtonText = $localize`:@@totalScore:Total score`;
  tierButtonText = $localize`:@@tier:Tier`;
  
  //form
  tileQiCtrl!: FormControl;
  lawMatchCtrl!: FormControl;
  luckCtrl!: FormControl;
  mentalStateCtrl!: FormControl;
  yinYangCtrl!: FormControl;
  weatherCtrl!: FormControl;
  seasonCtrl!: FormControl;
  tileElementCtrl!: FormControl;
  maxQiCtrl!: FormControl;

  //factors
  scorePerSecond = 0;
  totalScore = 0;
  tier = 9;
  duration = 0;
  tileQi = 0;
  lawMatch = 0;
  luck = 0;
  mentalState = 0;
  yinYang = 1;
  weather: number[] = [];
  season = 0;
  tileElement = 0;

  //observables
  weathers$!: Observable<Weather[]>;

  //image url
  goldenCoreImgSrcUrl = `${environment.imageUrl}/golden-core`;
  elementImgSrcUrl = `${environment.imageUrl}/elements`;

  constructor(
    private formBuilder: FormBuilder,
    private weathersService: WeathersService
  ) {}

  ngOnInit() {
    this.initForm();
    this.initObservables();
    this.weathersService.getWeathersFromServer();
  }

  initForm() {
    this.tileQiCtrl = this.formBuilder.control(0, [Validators.min(0)]);
    this.lawMatchCtrl = this.formBuilder.control(50, [Validators.min(50)]);
    this.luckCtrl = this.formBuilder.control(0, [Validators.min(0), Validators.max(10)]);
    this.mentalStateCtrl = this.formBuilder.control(0, [Validators.min(0)]);
    this.yinYangCtrl = this.formBuilder.control(1, [Validators.min(0)]);
    this.weatherCtrl = this.formBuilder.control('');
    this.seasonCtrl = this.formBuilder.control(1, [Validators.min(1), Validators.max(1.3)])
    this.tileElementCtrl = this.formBuilder.control(0);
    this.maxQiCtrl = this.formBuilder.control(0, [Validators.min(0)]);

    this.yinYangCtrl.disable(); //average is near 1, too many factors : day of the year, hour of the day, weather
  }

  initObservables() {
    this.weathers$ = this.weathersService.weathers$;

    this.tileQiCtrl.valueChanges.pipe(
      startWith(this.tileQiCtrl.value),
      map(value => {
        this.tileQi = value;
        this.scorePerSecond = this.getScorePerSecond();
        this.getTotalScore();
        this.tier = this.getTier();
      })
    ).subscribe();
    this.lawMatchCtrl.valueChanges.pipe(
      startWith(this.lawMatchCtrl.value),
      map(value => {
        this.lawMatch = value;
        this.scorePerSecond = this.getScorePerSecond();
        this.getTotalScore();
        this.tier = this.getTier();
      })
    ).subscribe();
    this.luckCtrl.valueChanges.pipe(
      startWith(this.luckCtrl.value),
      map(value => {
        this.luck = value;
        this.scorePerSecond = this.getScorePerSecond();
        this.getTotalScore();
        this.tier = this.getTier();
      })
    ).subscribe();
    this.mentalStateCtrl.valueChanges.pipe(
      startWith(this.mentalStateCtrl.value),
      map(value => {
        this.mentalState = value;
        this.scorePerSecond = this.getScorePerSecond();
        this.getTotalScore();
        this.tier = this.getTier();
      })
    ).subscribe();
    this.weatherCtrl.valueChanges.pipe(
      startWith(this.weatherCtrl.value),
      map(value => {
        this.weather = value;
        this.scorePerSecond = this.getScorePerSecond();
        this.getTotalScore();
        this.tier = this.getTier();
      })
    ).subscribe();
    this.seasonCtrl.valueChanges.pipe(
      startWith(this.seasonCtrl.value),
      map(value => {
        this.season = value;
        this.scorePerSecond = this.getScorePerSecond();
        this.getTotalScore();
        this.tier = this.getTier();
      })
    ).subscribe();
    this.tileElementCtrl.valueChanges.pipe(
      startWith(this.tileElementCtrl.value),
      map(value => {
        this.tileElement = value;
        this.scorePerSecond = this.getScorePerSecond();
        this.getTotalScore();
        this.tier = this.getTier();
      })
    ).subscribe();
    this.maxQiCtrl.valueChanges.pipe(
      startWith(this.maxQiCtrl.value),
      map(value => {
        this.duration = this.getBreakthroughDuration(value);
        this.getTotalScore();
        this.tier = this.getTier();
      })
    ).subscribe();
  }

  getTier(): number {
    if(this.totalScore > 300000) {
      return 0;
    } else if(this.totalScore > 145000) {
      return 1;
    } else if(this.totalScore > 85000) {
      return 2;
    } else if(this.totalScore > 55000) {
      return 3;
    } else if(this.totalScore > 40000) {
      return 4;
    } else if(this.totalScore > 30000) {
      return 5;
    } else if(this.totalScore > 21000) {
      return 6;
    } else if(this.totalScore > 13000) {
      return 7;
    } else if(this.totalScore > 6000) {
      return 8;
    } else {
      return 9;
    }
  }

  getTotalScore() {
    this.totalScore = 0;
    for(let i = 0; i < this.duration; i++) {
      if(this.totalScore < 145000) {
        this.totalScore += this.getScorePerSecond();
      } else {
        this.totalScore += this.getScorePerSecondAfterT1();
      }
    }
  }

  getScorePerSecond(): number {
    return (30 + this.tileQi/50) * this.getLawMatchFactor() * this.getLuckFactor() * this.getMentalStateFactor() * this.yinYang * this.getWeatherFactor() * this.season * this.getTileElementFactor();
  }

  getScorePerSecondAfterT1(): number {
    return this.getScorePerSecond() * 100000 / this.totalScore;
  }

  getLawMatchFactor(): number {
    return this.lawMatch / 100;
  }

  getLuckFactor(): number {
    switch (this.luck) {
      default:
        return 0.8;
      case 1:
        return 0.875;
      case 2:
        return 0.95;
      case 3:
        return 1.025;
      case 4:
        return 1.1;
      case 5:
        return 1.175;
      case 6:
        return 1.25;
      case 7:
        return 1.325;
      case 8:
        return 1.4;
      case 9:
        return 1.475;
      case 10:
        return 1.55;
    }
  }

  getMentalStateFactor(): number {
    if(this.mentalState >= 95) {
      return 2;
    } else if(this.mentalState >= 85) {
      return 1.5;
    } else if(this.mentalState >= 70) {
      return 1.2;
    } else if(this.mentalState >= 50) {
      return 1;
    } else if(this.mentalState >= 30) {
      return 0.6;
    } else {
      return 0.3;
    }
  }

  getWeatherFactor(): number {
    let totalContribution = 0;
    for (let i = 0; i < this.weather.length; i++) {
      totalContribution += this.weather[i];
    };
    return Math.min(1 + 5 * totalContribution, 1.6);
  }

  getTileElementFactor(): number {
    if(this.tileElement >= 1.85) {
      return 1.5;
    } else if(this.tileElement >= 1) {
      return 1.25;
    } else if(this.tileElement >= 0) {
      return 1.1;
    } else if(this.tileElement >= -1) {
      return 0.9;
    } else if(this.tileElement >= -1.9) {
      return 0.75;
    } else {
      return 0.5;
    }
  }

  getBreakthroughDuration(maxQi: number): number {
    return maxQi/30;
  }
}
