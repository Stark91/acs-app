import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'cultivation-room', loadChildren: () => import('./cultivation-room/cultivation-room.module').then(m => m.CultivationRoomModule)},
  {path: 'golden-core', loadChildren: () => import('./golden-core/golden-core.module').then(m => m.GoldenCoreModule)},
  {path: 'laws', loadChildren: () => import('./laws/laws.module').then(m => m.LawsModule)},
  {path: 'policy-events', loadChildren: () => import('./policy-events/policy-events.module').then(m => m.PolicyEventsModule)},
  {path: '**', redirectTo: 'cultivation-room'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
