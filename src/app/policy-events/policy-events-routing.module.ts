import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyEventsListComponent } from './components/policy-events-list/policy-events-list.component';
import { PolicyEventComponent } from './components/policy-event/policy-event.component';

const routes: Routes = [
  {path: '', component: PolicyEventsListComponent},
  {path: ':id', component: PolicyEventComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyEventsRoutingModule { }
