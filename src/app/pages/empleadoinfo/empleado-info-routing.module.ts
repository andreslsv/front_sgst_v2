import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpleadoInfoComponent } from './empleado-info.component';

const routes: Routes = [
    {
        path: '',
        component: EmpleadoInfoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmpleadoInfoRoutingModule { }
 