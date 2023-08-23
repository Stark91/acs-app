import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CultivationRoomRoutingModule } from './cultivation-room-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CultivationRoomComponent } from './components/cultivation-room/cultivation-room.component';
import { GatherQiItemsService } from './services/gatherQiItem.service';


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
    GatherQiItemsService
  ]
})
export class CultivationRoomModule { }