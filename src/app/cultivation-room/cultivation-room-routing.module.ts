import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CultivationRoomComponent } from './components/cultivation-room/cultivation-room.component';

const routes: Routes = [
  {path: '', component: CultivationRoomComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CultivationRoomRoutingModule { }
