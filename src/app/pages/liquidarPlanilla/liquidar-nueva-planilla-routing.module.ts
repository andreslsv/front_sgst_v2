import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiquidarNuevaPlanillaComponent } from './liquidar-nueva-planilla.component';

const routes: Routes = [
    {
        path: '',
        component: LiquidarNuevaPlanillaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LiquidarNuevaPlanillaRoutingModule { }
 