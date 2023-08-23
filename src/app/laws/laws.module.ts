import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LawsRoutingModule } from './laws-routing.module';
import { LawsListComponent } from './components/laws-list/laws-list.component';
import { SharedModule } from '../shared/shared.module';
import { LawsService } from './services/law.service';
import { LawComponent } from './components/law/law.component';
import { XiandaoStatsTableComponent } from './components/xiandao-stats-table/xiandao-stats-table.component';
import { XiandaoLawMatchFormComponent } from './components/xiandao-law-match-form/xiandao-law-match-form.component';
import { LawsListSectionComponent } from './components/laws-list-section/laws-list-section.component';


@NgModule({
  declarations: [
    LawsListComponent,
    LawComponent,
    XiandaoStatsTableComponent,
    XiandaoLawMatchFormComponent,
    LawsListSectionComponent
  ],
  imports: [
    CommonModule,
    LawsRoutingModule,
    SharedModule
  ],
  providers: [
    LawsService
  ]
})
export class LawsModule { }
