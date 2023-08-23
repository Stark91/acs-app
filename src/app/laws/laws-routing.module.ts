import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LawsListComponent } from './components/laws-list/laws-list.component';
import { LawComponent } from './components/law/law.component';

const routes: Routes = [
  {path: '', component: LawsListComponent},
  {path: ':id', component: LawComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LawsRoutingModule { }
