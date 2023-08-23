import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoldenCoreRoutingModule } from './golden-core-routing.module';
import { GoldenCoreComponent } from './components/golden-core/golden-core.component';
import { SharedModule } from '../shared/shared.module';
import { WeathersService } from './services/weather.service';


@NgModule({
  declarations: [
    GoldenCoreComponent
  ],
  imports: [
    CommonModule,
    GoldenCoreRoutingModule,
    SharedModule
  ],
  providers: [
    WeathersService
  ]
})
export class GoldenCoreModule { }
