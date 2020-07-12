import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MakersComponent } from './makers/makers.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: MainComponent,
    },
    {
        path: 'makers',
        component: MakersComponent,
    },
    {
        path: 'history',
        component: HistoryComponent,
    }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
