import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { IconModule } from '@visurel/iconify-angular';

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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { FuseAlertModule } from '@fuse/components/alert';
import { LiquidarNuevaPlanillaComponent } from './liquidar-nueva-planilla.component';
import { LiquidarNuevaPlanillaRoutingModule } from './liquidar-nueva-planilla-routing.module';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
//    declarations: [LiquidarNuevaPlanillaComponent],
    declarations: [LiquidarNuevaPlanillaComponent],
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
        // PageLayoutModule,
        // SecondaryToolbarModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatButtonModule,
        MatMenuModule,
        // KeyboardShortcutsModule.forRoot(),
        LiquidarNuevaPlanillaRoutingModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCardModule,
        MatTabsModule,
        MatStepperModule,
        CdkStepperModule,
        FuseAlertModule,
    ],
    providers: [
    ]
})
export class LiquidarNuevaPlanillaModule { }
