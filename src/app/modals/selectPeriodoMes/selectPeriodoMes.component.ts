import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import moment from 'moment';
import { filter, tap, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { ApiService } from 'app/core/api/api.service';
import { UserService } from 'app/core/user/user.service';




@Component({
    selector: 'vex-selectPeriodoMes',
    templateUrl: './selectPeriodoMes.component.html',

})
export class selectPeriodoMesComponent implements OnInit {

    displayedColumns: string[] = ['cedula', 'fecha', 'acciones'];
;
    sending = false;
    showOnlyName = false;
    editing = false;
    dataAfiliacion: any[] = [];
    empresa = false;
    independiente = false; 
    procFilterCtrl: FormControl = new FormControl();

    protected _onDestroy = new Subject<void>();

    public searchingProcedures = false;

    public filtereddataProcedure: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    loadingRecords = false;
    dataCaja: any[] = [];
    dataPension: any[] = [];
    dataEps: any[] = [];
    dataSucursal: any[] = [];
    dataId: any [] = [];
    ngOnInit(): void {
        // this.dataAfiliacion = this.data?.empresa;
        // console.log(this.dataAfiliacion);
        if (this.data.afiliacion) {
          console.log(this.data.afiliacion)
        }

        if (this.data?.empresa){
            this.empresa = true;
        }

        if (this.data?.independiente) {
            this.independiente = true;
        }

        // this.procFilterCtrl.valueChanges.pipe(
        //     filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 3),
        //     tap(() => this.searchingProcedures = true),
        //     takeUntil(this._onDestroy),
        //     debounceTime(500),
        //     distinctUntilChanged(),
        //     switchMap(term => this.apiService.getCajaCF(`search: "${term}"`, 'id,codigo,nombre'))
        // ).subscribe((results: any) => {
        //     console.log(results);
        //     this.searchingProcedures = false;
        //     this.filtereddataProcedure.next(results.data.cajaCompensacion);
        // }, error => {
        //     this.searchingProcedures = false;
        // });
        this.dataCaja;
        this.loadPeriodos();
    }

    loadPeriodos() {
        console.log('loading records...');

        this.loadingRecords = true;
        // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `search: "" `;
        // const queryParams = `search: "", tipo: ${this.data?.empresa.periodo} `;
        const queryProps =
            ' id, rango, tipo, consecutivo';
        this.apiService.getData(queryProps, queryParams, 'periodos').subscribe(
       
            (response: any) => {

                this.dataCaja = response.data.periodos;

            },
            error => {
                this.loadingRecords = false;
                this._snackBar.open('Error.', null, {
                    duration: 4000
                });
                console.log(error);
            }
        );
    }
   
    solicitud = new FormGroup({
        id: new FormControl ('', []),
        nombre_periodo: new FormControl('', []),
    });

    constructor(
        public dialogRef: MatDialogRef<selectPeriodoMesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private coreService: UserService,
        private router: Router,
        private _snackBar: MatSnackBar,
    ) {

    }
    close(params: any = null) {
        this.dialogRef.close(params);
    }
    save() {
        const data = this.solicitud.value;
        // const id = data.id ? `id: ${data.id},` : '';
        const nombre_periodo = data.nombre_periodo !== '' && data.nombre_periodo !== null ? `nombre_periodo: "${data.nombre_periodo}",` : `nombre_periodo: ".",`;
        // const queryParams = `empresa_id: ${this.data?.empresa.id}, afiliacion_id: ${this.data?.empresa.afiliacion_id},  periodo:${this.data?.empresa.periodo}, numEmpleado: ${this.data?.empresa.empleados.length - 1}, ${id} ${nombre_periodo} `;
        const queryParams = `empresa_id: ${this.data?.empresa}, afiliacion_id: ${this.data.afiliacion},  ${nombre_periodo} `;
        const queryProps = 'id, afiliacion_id';
        this.apiService.setData(queryProps, queryParams, 'SaveNomina').subscribe(
            (response: any) => {
                this.sending = false;
                this.dataId = response.data.SaveNomina;
                this._snackBar.open('Guardado', null, {
                    duration: 4000
                });
                console.log(this.dataId)
                this.close(this.dataId);
                // this.close(response.data.saveObs);
                // this.loadObservacion();
            },
            (error: any) => {
                this.sending = false;
                this._snackBar.open('Error.', null, {
                    duration: 4000
                });

                console.log(error);
            }
        );
    }
    savePersona() {
        const data = this.solicitud.value;
        // const id = data.id ? `id: ${data.id},` : '';
        const nombre_periodo = data.nombre_periodo !== '' && data.nombre_periodo !== null ? `nombre_periodo: "${data.nombre_periodo}",` : `nombre_periodo: ".",`;
        // const queryParams = `empresa_id: ${this.data?.empresa.id}, afiliacion_id: ${this.data?.empresa.afiliacion_id},  periodo:${this.data?.empresa.periodo}, numEmpleado: ${this.data?.empresa.empleados.length - 1}, ${id} ${nombre_periodo} `;
        const queryParams = `persona_id: ${this.data?.independiente}, afiliacion_id: ${this.data.afiliacion},  ${nombre_periodo} `;
        const queryProps = 'id, afiliacion_id';
        this.apiService.setData(queryProps, queryParams, 'SaveNomina').subscribe(
        
            (response: any) => {
                this.sending = false;
                this.dataId = response.data.SaveNomina;
                this._snackBar.open('Guardado', null, {
                    duration: 4000
                });
                console.log(this.dataId)
                this.close(this.dataId);
                // this.close(response.data.saveObs);
                // this.loadObservacion();
            },
            (error: any) => {
                this.sending = false;
                this._snackBar.open('Error.', null, {
                    duration: 4000
                });

                console.log(error);
            }
        );
    }
    // saveDetails() {
    //     this.sending = true;
    //     const data = this.solicitud.value;
    //     const id = data.id ? `id: ${data.id},` : '';
    //     const status = data.status !== '' && data.status !== null ? `status: ${data.status},` : `status: 1,`;
    //     const queryParams = ` id: ${this.data.afiliacion.afiliacion_id}, ${status}`;
    //     const queryProps = 'id, primer_nombre';

    //     this.apiService.crearEmpleado(queryParams, queryProps).subscribe(
    //         (response: any) => {
    //             this.sending = false;

    //             this._snackBar.open('Guardado', null, {
    //                 duration: 4000
    //             });
    //             console.log(queryParams)
    //             this.close(data);
    //             // this.close(response.data.saveObs);
    //             // this.loadObservacion();
    //         },
    //         (error: any) => {
    //             this.sending = false;
    //             this._snackBar.open('Error.', null, {
    //                 duration: 4000
    //             });

    //             console.log(error);
    //         }
    //     );
    // }

}
