import { Component } from '@angular/core';

@Component({
  selector: 'acs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  cultivationRoomLink = $localize`:@@cultivationRoom:Cultivation room`;
  goldenCoreLink = $localize`:@@goldenCore:Golden core`;
  lawsLink = $localize`:@@laws:Laws`;
  agencyEventsLink = $localize`:@@agencyEvents:Agency events`;
}
