import { Component, OnInit } from '@angular/core';
import { Law } from '../../models/law.model';
import { Observable, map, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LawsService } from '../../services/law.service';
import { LawType } from '../../enums/law-type.enum';

@Component({
  selector: 'acs-law',
  templateUrl: './law.component.html',
  styleUrls: ['./law.component.scss']
})
export class LawComponent implements OnInit {

  loadingLaw$!: Observable<boolean>;
  law$!: Observable<Law>;
  isXiandao$!: Observable<boolean>;

  constructor(
    private lawsService: LawsService,
    private route: ActivatedRoute, 
    private router: Router
    ) {}

  ngOnInit() {
    this.initObservables();
    this.initXiandaoBoolean();
  }

  initObservables() {
    this.loadingLaw$ = this.lawsService.loading$;
    this.law$ = this.route.params.pipe(
      switchMap(params => this.lawsService.getLawById(+params['id']))
    );
  }

  initXiandaoBoolean() {
    this.isXiandao$ = this.law$.pipe(
      map(law => law.type === LawType.XIANDAO)
    )
  }

  onGoBack() {
    this.router.navigateByUrl('/laws');
  }
}
