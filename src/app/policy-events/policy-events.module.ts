import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyEventsRoutingModule } from './policy-events-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PolicyEventsListComponent } from './components/policy-events-list/policy-events-list.component';
import { PolicyEventsService } from './services/policy-events.service';
import { PolicyEventComponent } from './components/policy-event/policy-event.component';
import { OutcomesService } from './services/outcome.service';


@NgModule({
  declarations: [
    PolicyEventsListComponent,
    PolicyEventComponent
  ],
  imports: [
    CommonModule,
    PolicyEventsRoutingModule,
    SharedModule
  ],
  providers: [
    PolicyEventsService,
    OutcomesService
  ]
})
export class PolicyEventsModule { }
