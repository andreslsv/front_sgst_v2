import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
// import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { IconModule } from '@visurel/iconify-angular';
// import { SecondaryToolbarModule } from 'src/@vex/components/secondary-toolbar/secondary-toolbar.module';
// import { PageLayoutModule } from 'src/@vex/components/page-layout/page-layout.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { IndependienteDetalleComponent } from './independienteDetalle.component';
import {  IndependienteDetalleRoutingModule } from './independienteDetalle-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { FileUploadModule } from 'ng2-file-upload';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
    /*declarations: [IndependienteDetalleComponent],*/
    declarations: [
        IndependienteDetalleComponent
    ],
    imports: [
        CommonModule,
        // TranslateModule,
        FlexLayoutModule,
        FormsModule, 
        ReactiveFormsModule,
        MatIconModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        IconModule,

        MatProgressSpinnerModule,
        MatInputModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatButtonModule,
        MatMenuModule,
        FileUploadModule,
        MatStepperModule,
        MatSelectModule,
        MatOptionModule,
        IndependienteDetalleRoutingModule,
        MatTabsModule,
        MatGridListModule,
        MatCardModule,
        MatRadioModule
    ],
    providers: [
    ]
})
export class IndependienteDetalleModule { }
