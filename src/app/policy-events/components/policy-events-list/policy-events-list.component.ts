import { Component, OnInit } from '@angular/core';
import { Policy } from '../../enums/policy.enum';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { PolicyEventsService } from '../../services/policy-events.service';
import { PolicyEvent } from '../../models/policy-event.model';

@Component({
  selector: 'acs-policy-events-list',
  templateUrl: './policy-events-list.component.html',
  styleUrls: ['./policy-events-list.component.scss']
})
export class PolicyEventsListComponent implements OnInit {

  loading$!: Observable<boolean>;
  events$!: Observable<PolicyEvent[]>;
  policyCtrl!: FormControl;
  policyCtrlOptions!: {
    value: Policy,
    label: string
  }[];

  constructor(private formBuilder: FormBuilder, private policyEventsService: PolicyEventsService) {}

  ngOnInit() {
    this.initForm();
    this.initObservables();
    this.policyEventsService.getEventsFromServer();
  }

  initForm() {
    this.policyCtrl = this.formBuilder.control(Policy.SHARED_EVENTS);
    this.policyCtrlOptions = [
      {value: Policy.SHARED_EVENTS, label: 'Shared events'},
      {value: Policy.ABSTINENCE, label: 'Abstinence'},
      {value: Policy.CHARITY, label: 'Charity'},
      {value: Policy.PLOTTING, label: 'Plotting'},
      {value: Policy.PREACHING, label: 'Preaching'}
    ]
  }

  initObservables() {
    this.loading$ = this.policyEventsService.loading$;
    this.events$ = this.policyEventsService.events$;

    const policy$: Observable<Policy> = this.policyCtrl.valueChanges.pipe(
      startWith(this.policyCtrl.value),
      map(value => value.toLowerCase())
    );

    this.events$ = combineLatest([
      policy$,
      this.policyEventsService.events$
    ]).pipe(
      map(([policy, events]) => events.filter(event => event['policy'].toLowerCase() === (policy as string)))
    );
  }
}
