import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  AsesoriasComponent } from './asesorias.component';

const routes: Routes = [
    {
        path: '',
        component: AsesoriasComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AsesoriasRoutingModule { }