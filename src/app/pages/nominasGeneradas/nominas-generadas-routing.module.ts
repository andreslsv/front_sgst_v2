import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NominasGeneradasComponent } from './nominas-generadas.component';

const routes: Routes = [
    {
        path: '',
        component: NominasGeneradasComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NominasGeneradasRoutingModule { }
 