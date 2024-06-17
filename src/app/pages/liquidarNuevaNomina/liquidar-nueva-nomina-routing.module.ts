import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiquidarNuevaNominaComponent } from './liquidar-nueva-nomina.component';

const routes: Routes = [
    {
        path: '',
        component: LiquidarNuevaNominaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LiquidarNuevaNominaRoutingModule { }
 