import { Component, OnInit } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { PolicyEvent } from '../../models/policy-event.model';
import { PolicyEventsService } from '../../services/policy-events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OutcomesService } from '../../services/outcome.service';
import { Outcome } from '../../models/outcome.model';
import { Action } from '../../enums/action.enum';

@Component({
  selector: 'acs-policy-event',
  templateUrl: './policy-event.component.html',
  styleUrls: ['./policy-event.component.scss']
})
export class PolicyEventComponent implements OnInit {

  //i18n
  actionsTableHeader = $localize`:@@actions:Actions`;
  conditionsTableHeader = $localize`:@@conditions:Conditions`;
  outcomesTableHeader = $localize`:@@outcomes:Outcomes`;
  backButtonText = $localize`:@@back:Back`;
  battleRowText = $localize`:@@battle:Battle`;
  charismaRowText = $localize`:@@charisma:Charisma`;
  discipleRowText = $localize`:@@disciple:Disciple`;
  foodRowText = $localize`:@@food:Food`;
  intelligenceRowText = $localize`:@@intelligence:Intelligence`;
  noActionRowText = $localize`:@@noAction:No action`;
  socialRowText = $localize`:@@social:Social`;
  spiritStoneRowText = $localize`:@@spiritStone:Spirit stone`;
  stoneRowText = $localize`:@@stone:Stone`;
  woodRowText = $localize`:@@wood:Wood`;

  loadingEvent$!: Observable<boolean>;
  loadingOutcomes$!: Observable<boolean>;
  event$!: Observable<PolicyEvent>;
  outcomes$!: Observable<Outcome[]>;
  displayedColumns: string[] = ['action', 'condition', 'outcome'];
  actions!: {
    value: Action,
    label: string
  }[];

  constructor(
    private policyEventsService: PolicyEventsService, 
    private outcomesService: OutcomesService,
    private route: ActivatedRoute, 
    private router: Router
    ) {}

  ngOnInit() {
    this.initActionLabels();
    this.initObservables();
    this.outcomesService.getOutcomesFromServer();
  }

  initActionLabels() {
    this.actions = [
      {value: Action.BATTLE, label: this.battleRowText},
      {value: Action.CHARISMA, label: this.charismaRowText},
      {value: Action.DISCIPLE, label: this.discipleRowText},
      {value: Action.FOOD, label: this.foodRowText},
      {value: Action.INTELLIGENCE, label: this.intelligenceRowText},
      {value: Action.NO_ACTION, label: this.noActionRowText},
      {value: Action.SOCIAL, label: this.socialRowText},
      {value: Action.SPIRIT_STONE, label: this.spiritStoneRowText},
      {value: Action.STONE, label: this.stoneRowText},
      {value: Action.WOOD, label: this.woodRowText}
    ]
  }

  initObservables() {
    this.loadingEvent$ = this.policyEventsService.loading$;
    this.loadingOutcomes$ = this.outcomesService.loading$;
    this.event$ = this.route.params.pipe(
      switchMap(params => this.policyEventsService.getEventById(+params['id']))
    );
    this.outcomes$ = this.route.params.pipe(
      switchMap(params => this.outcomesService.getOutcomeByEvent(+params['id']))
    );
  }

  getActionLabel(action: Action): string {
    return this.actions.filter(element => element.value === action)[0].label;
  }

  onGoBack() {
    this.router.navigateByUrl('/policy-events');
  }
}
