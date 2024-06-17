import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';

import { CurrencyPipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuillModule } from 'ngx-quill';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { SharedModule } from 'app/shared/shared.module';

import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AfiliaicionesComponent } from './pages/servicios/afiliaciones/afiliaciones.component';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { AsesoriasComponent } from './pages/servicios/asesorias/asesorias.component';
import { ContratosComponent } from './pages/servicios/contratos/contratos.component';
import { ExamenesComponent } from './pages/servicios/examenes/examenes.component';
import { IncapacidadesComponent } from './pages/servicios/incapacidades/incapacidades.component';
import { PlanillasComponent } from './pages/servicios/planillas/planillas.component';
import { AgregarSucursalModalComponent } from './modals/agregarsucursalModal/agregar-sucursal-modal.component';
import { CargarIconoComponent } from './modals/cargarIcono/cargarIcono.component';
import { FileUploadModule } from 'ng2-file-upload';
import { InfoBeneficiarioModalComponent } from './modals/infoBeneficiarioModal/info-beneficiario-modal.component';
import { CargarDocumentosComponent } from './modals/cargarDocumentos/cargarDocumentos.component';
import { MultimediaModalComponent } from './modals/multimediaModal/multimedia-modal.component';
import { HbModalComponent } from './modals/hbModal/hb-modal.component';
import { htoModalComponent } from './modals/htoModal/hto-modal.component';
import { DiasLaboradosComponent } from './modals/diasLaborados/diasLaborados-modal.component';
import { ingresoNocComponent } from './modals/ingreso-noc/ingreso-noc.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { DeduccionesModal } from './modals/deduccionesModal/deduccionesModal.component';
import { selectPeriodoMesComponent } from './modals/selectPeriodoMes/selectPeriodoMes.component';
import { ObsModalEmpleadoComponent } from './modals/obsModalEmpleado/obs-modalEmpleado.component';
import { ObsModalServicioComponent } from './modals/obsModalServicio/obs-modal.component';
import { CrearEmpleadoComponent } from './modals/crearEmpleado/crear-empleado.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CrearCargoModalComponent } from './modals/crearCargo/crearCargo.component';
import { SuccessModalComponent } from './modals/successModal/success-modal.component';
import { SgsstComponent } from './modules/admin/sgsst/sgsst.component';
import { FormatoComponent } from './modules/admin/sgsst/ui/formato/formato.component';

const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
        AfiliaicionesComponent,
        AsesoriasComponent,
        ContratosComponent,
        ExamenesComponent,
        IncapacidadesComponent,
        PlanillasComponent,
        AgregarSucursalModalComponent,
        CargarIconoComponent,
        InfoBeneficiarioModalComponent,
        CargarDocumentosComponent,
        MultimediaModalComponent,
        HbModalComponent,
        htoModalComponent,
        DiasLaboradosComponent,
        ingresoNocComponent,
        DeduccionesModal,
        selectPeriodoMesComponent,
        ObsModalEmpleadoComponent,
        ObsModalServicioComponent,
        CrearEmpleadoComponent,
        CrearCargoModalComponent,
        SuccessModalComponent,
        SgsstComponent,

    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        HttpClientModule,
        MatSidenavModule,
        MatIconModule,
        MatPaginatorModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatDatepickerModule,
        FormsModule,
        MatMomentDateModule,
        FileUploadModule,
        // IconModule,

        MatProgressSpinnerModule,
        MatListModule,
        MatSelectModule,
        MatCheckboxModule,
        // NgxMatSelectSearchModule,
        MatFormFieldModule,
        MatTabsModule,
        MatInputModule,

        FuseAlertModule,
        FuseCardModule,
        FuseDrawerModule,
        FuseHighlightModule,
        FuseLoadingBarModule,
        FuseMasonryModule,
        FuseNavigationModule,
        FuseScrollResetModule,

        FlexLayoutModule,
        // AdministrationModule,

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        MatDividerModule,
        MatMenuModule,
        MatProgressBarModule,
        QuillModule,
        FuseFindByKeyPipeModule,
        FuseNavigationModule,
        FuseScrollbarModule,
        FuseScrollResetModule,
        SharedModule,

        MatButtonToggleModule,
        NgApexchartsModule,
        MatSnackBarModule,
        MatStepperModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatMenuModule,
        MatCardModule,
        MatTabsModule,
        MatStepperModule,
        CdkStepperModule,
        NgxMatSelectSearchModule
    ],
    // entryComponents: [
    //     EditarCuentaModalComponent,
    //     TerceroModalComponent,
    //     PlanCuentaModalComponent,
    //     TipoComprobantesModalComponent,
    // ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-in' },
        CurrencyPipe,
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
