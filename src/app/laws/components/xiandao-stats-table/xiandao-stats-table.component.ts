import { Component, Input, OnInit } from '@angular/core';
import { Law } from '../../models/law.model';
import { Stats } from '../../../shared/models/stats.model';

@Component({
  selector: 'acs-xiandao-stats-table',
  templateUrl: './xiandao-stats-table.component.html',
  styleUrls: ['./xiandao-stats-table.component.scss']
})
export class XiandaoStatsTableComponent implements OnInit {

  //i18n
  lawStatsTitle = $localize`:@@lawStats:Law stats`;
  charismaTableHeader = $localize`:@@charisma:Charisma`;
  constitutionTableHeader = $localize`:@@constitution:Constitution`;
  intelligenceTableHeader = $localize`:@@intelligence:Intelligence`;
  luckTableHeader = $localize`:@@luck:Luck`;
  perceptionTableHeader = $localize`:@@perception:Perception`;

  @Input() law!: Law;
  data!: Stats[];
  displayedColumns: string[] = ['charisma', 'constitution', 'intelligence', 'luck', 'perception'];

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource() {
    this.data = [];
    this.data.push(this.law.stats);
  }
}
