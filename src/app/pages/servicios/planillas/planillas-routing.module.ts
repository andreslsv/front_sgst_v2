import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanillasComponent } from './planillas.component';

const routes: Routes = [
    {
        path: '',
        component: PlanillasComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlanillasRoutingModule { }