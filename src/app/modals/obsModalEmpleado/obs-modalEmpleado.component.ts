import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { ApiService } from 'app/core/api/api.service';



export interface PeriodicElement {
    descripcion: string;
    fecha: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { descripcion: 'Hydrogen', fecha: "20/08/2020 10:30" },
    { descripcion: 'Diseño', fecha: "08/01/2019 10:30" },
    { descripcion: 'Bancolombia Diego', fecha: "08/01/2019 10:30" },
    { descripcion: 'Bancolombia Andrés', fecha: "08/01/2019 10:30" },
    { descripcion: 'Bancolombia Ivan', fecha: "08/01/2019 10:30" },
    { descripcion: 'AV Villas Carlos', fecha: "08/01/2019 10:30" },
    { descripcion: 'Producto instalado. Soporte Cesar', fecha: "08/01/2019 10:30" },
    { descripcion: 'Producto instalado. Soporte Andrés', fecha: "08/01/2019 10:30" },
];

moment.locale('es');

@Component({
    selector: 'app-obs-modal',
    templateUrl: './obs-modalEmpleado.component.html',
    styleUrls: ['./obs-modalEmpleado.component.scss']
})
export class ObsModalEmpleadoComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;
    displayedColumns: string[] = ['descripcion', 'fecha'];
    dataSource: any[] = [];

    obs = new FormGroup({
        id: new FormControl('', []),
        description: new FormControl(null, [])
    });

    items: any[] = [];
    tableData: any[] = [];
    loadingRecords: boolean;

    constructor(
        public dialogRef: MatDialogRef<ObsModalEmpleadoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private router: Router,
        private coreService: UserService,
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }
    loadRecords() {
        this.tableData.push(this.data.datos);

    }
    ngOnInit() {
        
        console.log(this.data.datos);
       
        this.loadObservacion();
       
        this.tableData.push(this.data.datos);
       
        this.dataSource;

    }

    ngAfterViewInit() { }

    save() {
        this.sending = true;
        const data = this.obs.value;

        const id = data.id ? `id: ${data.id},` : '';
        const afiliacionId = `empleado_id: ${this.data.datos.id}`
        const description = `description: "${data.description}",`;
        const queryParams = `${id} ${afiliacionId}  ${description}`;
        const queryProps = 'id, description';
        this.apiService.setData(queryProps, queryParams, 'saveObs').subscribe(

            (response: any) => {
                this.sending = false;

                this.snackBar.open('Guardado', null, {
                    duration: 4000
                });

                // this.close(response.data.saveObs);
                this.loadObservacion();
            },
            (error: any) => {
                this.sending = false;
                this.snackBar.open('Error.', null, {
                    duration: 4000
                });

                console.log(error);
            }
        );
    }
    loadObservacion() {
        console.log('loading records...');

        this.loadingRecords = true;
        const dataId = this.data.datos.id;
        const queryParams = `empleado_id: ${dataId}`;
        const queryProps =
            'id, user_id, empleado_id, description, created_at';
        this.apiService.getData(queryProps, queryParams, 'getObs').subscribe(
       
            (response: any) => {

                this.dataSource = response.data.getObs;
                console.log('observacion', this.dataSource)
            },
            error => {
                this.loadingRecords = false;
                this.snackBar.open('Error.', null, {
                    duration: 4000
                });
                console.log(error);
            }
        );
    }

    close(params: any = null) {
        this.dialogRef.close(params);
    }

    ngOnDestroy(): void { }
}
