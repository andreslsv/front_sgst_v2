import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AfiliaicionesComponent } from './afiliaciones.component';

const routes: Routes = [
    {
        path: '',
        component: AfiliaicionesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AfiliaicionesRoutingModule { }