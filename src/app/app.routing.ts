import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'sign-in' },

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'home' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },

            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [

            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            // { path: 'home', loadChildren: () => import('app/pages/project/project.module').then(m => m.ProjectModule)},
            // { path: 'project', loadChildren: () => import('app/modules/admin/dashboards/project/project.module').then(m => m.ProjectModule) },

        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'home', loadChildren: () => import('app/pages/project/project.module').then(m => m.ProjectModule)
            },
            {
                path: 'empresa',
                loadChildren: () => import('app/pages/empresaInfo/empresa-info.module').then(m => m.EmpresaInfoModule)
            },
            {
                path: 'empleados',
                loadChildren: () => import('app/pages/empleados/empleados.module').then(m => m.EmpleadosModule)
            },
            {
                path: 'empleadoinfo/:id',
                loadChildren: () => import('./pages/empleadoinfo/empleado-info.module').then(m => m.EmpleadoInfoModule)
            },
            {
                path: 'liquidarnuevanomina/:id',
                loadChildren: () => import('./pages/liquidarNuevaNomina/liquidar-nueva-nomina.module').then(m => m.LiquidarNuevaNominaModule)
            },
            {
                path: 'nominasgeneradas',
                loadChildren: () => import('./pages/nominasGeneradas/nominas-generadas.module').then(m => m.NominasGeneradasModule)
            },
            {
                path: 'afiliaciones',
                loadChildren: () => import('./pages/servicios/afiliaciones/afiliaciones.module').then(m => m.AfiliacionesModule)
            },
            {
                path: 'planillas',
                loadChildren: () => import('./pages/servicios/planillas/planillas.module').then(m => m.PlanillasModule)
            },
            {
                path: 'contratos',
                loadChildren: () => import('./pages/servicios/contratos/contratos.module').then(m => m.ContratosModule)
            },
            {
                path: 'incapacidades',
                loadChildren: () => import('./pages/servicios/incapacidades/incapacidades.module').then(m => m.IncapacidadesModule)
            },
            {
                path: 'examenes',
                loadChildren: () => import('./pages/servicios/examenes/examenes.module').then(m => m.ExamenesModule)
            },

            {
                path: 'asesorias',
                loadChildren: () => import('./pages/servicios/asesorias/asesorias.module').then(m => m.AsesoriasModule)
            },
            {
                path: 'pagos',
                loadChildren: () => import('./pages/administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'independiente',
                loadChildren: () => import('./pages/independienteDetalle/independienteDetalle.module').then(m => m.IndependienteDetalleModule)
            },
            {
                path: 'archivos', loadChildren: () => import('./pages/file-manager/file-manager.module').then(m => m.FileManagerModule)
            },

            {
                path: 'liquidarnuevaplanilla/:id',
                loadChildren: () => import('./pages/liquidarPlanilla/liquidar-nueva-planilla.module').then(m => m.LiquidarNuevaPlanillaModule)
            },
            {
                path: 'planillagenerados',
                loadChildren: () => import('./pages/planilla-generadas/planilla-generadas.module').then(m => m.PlanillaGeneradasModule)
            },


            { path: 'sgsst', loadChildren: () => import('app/modules/admin/sgsst/sgsst.module').then(m => m.SgsstModule) },

        ]
    }

];
