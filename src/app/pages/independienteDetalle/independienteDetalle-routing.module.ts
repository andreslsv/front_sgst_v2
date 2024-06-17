import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndependienteDetalleComponent } from './independienteDetalle.component';

const routes: Routes = [
    {
        path: '',
        component: IndependienteDetalleComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IndependienteDetalleRoutingModule { }
 