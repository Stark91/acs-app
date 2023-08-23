import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoldenCoreComponent } from './components/golden-core/golden-core.component';
import { CultivationRoomComponent } from '../cultivation-room/components/cultivation-room/cultivation-room.component';

const routes: Routes = [
  {path: '', component: GoldenCoreComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoldenCoreRoutingModule { }
