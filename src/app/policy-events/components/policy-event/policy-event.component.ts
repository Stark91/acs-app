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
      {value: Action.BATTLE, label: 'Battle'},
      {value: Action.CHARISMA, label: 'Charisma'},
      {value: Action.DISCIPLE, label: 'Disciple'},
      {value: Action.FOOD, label: 'Food'},
      {value: Action.INTELLIGENCE, label: 'Intelligence'},
      {value: Action.NO_ACTION, label: 'No action'},
      {value: Action.SOCIAL, label: 'Social'},
      {value: Action.SPIRIT_STONE, label: 'Spirit stone'},
      {value: Action.STONE, label: 'Stone'},
      {value: Action.WOOD, label: 'Wood'}
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
    this.router.navigateByUrl('/events');
  }
}
