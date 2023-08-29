import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CultivationRoomRoutingModule } from './cultivation-room-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CultivationRoomComponent } from './components/cultivation-room/cultivation-room.component';
import { GatherQiItemsService } from './services/gatherQiItem.service';
import { TerrainsService } from './services/terrain.service';


@NgModule({
  declarations: [
    CultivationRoomComponent
  ],
  imports: [
    CommonModule,
    CultivationRoomRoutingModule,
    SharedModule
  ],
  providers: [
    GatherQiItemsService,
    TerrainsService
  ]
})
export class CultivationRoomModule { }
