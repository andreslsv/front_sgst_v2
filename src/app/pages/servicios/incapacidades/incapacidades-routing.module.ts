import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IncapacidadesComponent } from './incapacidades.component';

const routes: Routes = [
    {
        path: '',
        component: IncapacidadesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IncapacidadesRoutingModule { }