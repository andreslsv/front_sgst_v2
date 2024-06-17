import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanillaGeneradasComponent } from './planilla-generadas.component';

const routes: Routes = [
    {
        path: '',
        component: PlanillaGeneradasComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlanillaGeneradasRoutingModule { }
 