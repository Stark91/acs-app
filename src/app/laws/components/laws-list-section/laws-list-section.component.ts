import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/app/core/environment/environment';
import { Law } from 'src/app/laws/models/law.model';

@Component({
  selector: 'acs-laws-list-section',
  templateUrl: './laws-list-section.component.html',
  styleUrls: ['./laws-list-section.component.scss']
})
export class LawsListSectionComponent implements OnInit {

  //i18n
  lawTypeAmount!: string;

  @Input() laws!: Law[];
  @Input() lawType!: string;
  imgSrcUrl = `${environment.imageUrl}/elements`;

  ngOnInit() {
    this.initI18n();
  }

  initI18n() {
    this.lawTypeAmount = $localize`:@@lawTypeAmount:${this.lawType} laws`;
  }
}
