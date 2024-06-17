import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamenesComponent } from './examenes.component';

const routes: Routes = [
    {
        path: '',
        component: ExamenesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamenesRoutingModule { }