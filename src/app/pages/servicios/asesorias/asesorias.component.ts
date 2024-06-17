import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
// import { ReciboEmpleadoModalComponent } from 'app/modals/reciboempleadoModal/recibo-empleado-modal.component';
import { MatDialog } from '@angular/material/dialog';

import { MatTableDataSource } from '@angular/material/table';
import { empleado } from 'app/models/empleado';
import { ApiService } from 'app/core/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import moment from 'moment';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
// import { ObsModalEmpleadoComponent } from 'app/modals/obsModalEmpleado/obs-modalEmpleado.component';
// import { CambiarEstadoServicioComponent } from 'app/modals/cambiarEstadoServicio/cambiarEstadoServicio.component';
// import { selectPeriodoMesComponent } from 'app/modals/selectPeriodoMes/selectPeriodoMes.component';
import { empresa } from 'app/models/empresa';
// import { CambiarLiquidacionComponent } from 'app/modals/cambiarLiquidacion/cambiarLiquidacion.component';
// import { ObsModalServicioComponent } from 'app/modals/obsModalServicio/obs-modal.component';
import { servicio } from 'app/models/servicios';
import { RecordsService } from 'app/pages/records.service';
import { CredentialsService } from 'app/core/credentials.service';
import { UserService } from 'app/core/user/user.service';
import { ObsModalServicioComponent } from 'app/modals/obsModalServicio/obs-modal.component';
export interface PeriodicElement {
    nombre: string;
    n_doc: string;
    tel: string;
    empresa: string;
    cargo: string;
    salario: string;
    estado: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { nombre: "CARLOS  ANDRES GONZALES", n_doc: "135687412", tel: "3185754711", empresa: "ALUMINIOS EL TREBOL", cargo: "AUX. CONTABLE", salario: "$ 1´200.000", estado: "Activo" },
    { nombre: "SADFSDF  SFSFSDF SDFSDSDF", n_doc: "2358996589", tel: "2153668745", empresa: "CASSDFFDS", cargo: "AUX. CONTABLE", salario: "$ 3.000.000", estado: "Activo" },
    { nombre: "SDFSAFSA  SDFSD SDFSDF", n_doc: "3543643541", tel: "564465456", empresa: "SFDFGDSGDS", cargo: "AUX. CONTABLE", salario: "$ 3.000.000", estado: "Activo" }
];

@Component({
    selector: 'vex-asesorias',
    templateUrl: './asesorias.component.html',
    styleUrls: ['./asesorias.component.scss']
})
export class AsesoriasComponent implements OnInit {
    id = '';
    resultsLength = 0;
    pageSize = 10;
    pageSizeOptions: number[] = [10, 50, 100];
    orderBy = 'created_at';
    order = 'desc';
    limit = 10;
    offset = 0;
    total: number;
    dataSource: MatTableDataSource<empresa> | null;
    data: empresa[] = [];
    dataEmpresa: MatTableDataSource<empresa> | null;

    empleado = new FormGroup({
        razon_social: new FormControl('', []),
        contacto: new FormControl('', []),
        telefono: new FormControl('', []),
        email: new FormControl('', []),
        color_asignado: new FormControl('', [])
    });
    searchKeyUp($event: KeyboardEvent): void {
        // console.log($event);
        if ($event.code === 'KeyN' && $event.shiftKey) {
            this.filters.controls.search.setValue('');
            return;
        }

        this.keyUp.next($event);
    }
    dateChange(event: any) {
        this.loadEmpresaPaginator();
    }

    sortRecords(event: MatSort): void {
        this.orderBy = event.active;
        this.order = event.direction;
        this.loadEmpresaPaginator();
    }
    selectDetails(empresa: any) {
        this.router.navigate(['/app/empresainfo', empresa]);
    }
    pageChange(event: PageEvent) {
        this.limit = event.pageSize;
        this.offset = event.pageSize * event.pageIndex;
        this.loadEmpresaPaginator();
    }
    changeDateTimeFormat(date: string) {
        return moment(date).format('DD/MM/YYYY');
    }
    // displayedColumns: string[] = ['nombre', 'n_doc', 'tel', 'cargo', 'salario', 'estado', 'acciones'];
    displayedColumns: string[] = ['nombre', 'nit', 'fecha', 'n_emp', 'estado2', 'estado',];
    public keyUp = new Subject<any>();
    filters = new FormGroup({
        search: new FormControl('', []),
        date: new FormControl('', []),
        date2: new FormControl('', []),
        seleccion: new FormControl('', [])
    });
    @ViewChild('search', { static: false }) searchEl: ElementRef;
    total1: number;
    loadingRecords: boolean;
    constructor(
        private _formBuilder: FormBuilder,
        public dialog: MatDialog,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute,
        private recordsService: RecordsService,
        private fb: FormBuilder,
        private credentialsService: CredentialsService,
        private _userService: UserService,

    ) {
        const codeSearchSubscription = this.keyUp
            .pipe(
                map((event: any) => event.target.value),
                debounceTime(300),
                distinctUntilChanged(),
                flatMap(search => of(search).pipe(delay(300)))
            )
            .subscribe(result => {
                this.filters.controls.search.setValue(this.searchEl.nativeElement.value);
                //this.loadPropect();
                this.loadEmpresaPaginator();
            });
        }
    user() {
        return 1 
        // this.coreService.currentUser.role_id;
    }
    userName() {
        return 1 
        // this.coreService.currentUser.name;
    }
    eliminar() {
        return 1 
        // this.coreService.currentUser.roles.eliminar
    }
    modificar() {
        return 1 
        // this.coreService.currentUser.roles.modificar
    }
    openObsEmpleadoModal(datos: any = null) {
        const dialogRef = this.dialog.open(ObsModalServicioComponent, {
            width: '1000px',
            height: '600px',
            maxHeight: '850px',

            data: {
                datos
            }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) return;
            this.loadEmpresaPaginator();

        });
    }

    openEmpresaModal() {
        // const dialogRef = this.dialog.open(CambiarLiquidacionComponent, {
        //     width: '750px',
        //     height: 'auto',
        //     maxHeight: '850px',
        //     panelClass: 'custom-dialog-container',

        //     data: {
        //         servicio: 'ASESORIAS'
        //     }
        // });

        // dialogRef.afterClosed().subscribe((result: any) => {
        //     if (!result) return;
        //     this.loadEmpresaPaginator();

        // });
    }
    getEstadoClass(estado) {
        var text;

        switch (estado) {
            case "Activo":
                text = "tag_verde";
                break;

            case "Al dia":
                text = "tag_verde";
                break;

            /*
            #Clases disponibles disponibles en style.css
            */
        }

        return text;
    }

    empleadoEdit(solicitud: any) {
        this.router.navigate(['/app/empleadoinfo', solicitud]);
    }
    openStatusModal(creacion: any = null) {
        // const dialogRef = this.dialog.open(CambiarEstadoServicioComponent, {
        //     width: '1000px',
        //     height: '600px',
        //     maxHeight: '850px',

        //     data: {
        //         creacion
        //     }
        // });

        // dialogRef.afterClosed().subscribe((result: any) => {
        //     if (!result) return;
        //     this.loadEmpresaPaginator();

        // });
    }
    delete(income: any) {

        // const r = confirm('¿DESEAS ELIMINAR EL EMPLEADO?');
        // if (r === true) {
        //     this.loadingRecords = true;

        //     // const id = income ? `id: ${income.id},` : '';
        //     const queryParams = `id:${income.id}, delete: 1 `;
        //     const queryProps = 'id ';

        //     this.apiService.crearEmpleado(queryParams, queryProps).subscribe(
        //         (response: any) => {
        //             this.loadingRecords = false;

        //             this.loadEmpresaPaginator();

        //             this._snackBar.open('Eliminado', null, {
        //                 duration: 4000
        //             });
        //         },
        //         error => {
        //             this.loadingRecords = false;
        //             this._snackBar.open('Error.', null, {
        //                 duration: 4000
        //             });

        //             console.log(error);
        //         }
        //     );
        // }
    }
    // selectDetails(empresa: any) {
    //     this.router.navigate(['/app/liquidarnuevanomina', empresa.id, empresa.afiliacion_id]);
    // }
    openSelectPeriodo(empresa: any) {
        // const dialogRef = this.dialog.open(selectPeriodoMesComponent, {
        //     width: 'auto',
        //     height: 'auto',
        //     maxHeight: '850px',
        //     data: {
        //         empresa: empresa
        //     }
        // });
        // dialogRef.afterClosed().subscribe((result: any) => {
        //     if (result) {
        //         this.router.navigate(['/app/liquidarnuevanomina', result.id, result.afiliacion_id]);
        //     }
        //     this.loadEmpresaPaginator();
        // });
    }
    afiliacionFilter= null;
    filterAfiliacion(status) {
        if (status == null) {
            this.afiliacionFilter = null;
            return;
        }
        if (status == '0') {
            this.afiliacionFilter = this.dataEmpresa;
            return;
        }
     
        // this.afiliacionFilter = this.dataEmpresa.filter((data: any) => data.status == status);
    }
    dataEmpresaAny: any[] = [];
    totalAfiliados: any;
    afiliacionId = this._userService?.currentUser?.empresa?.afiliacion_id != null ? this._userService?.currentUser?.empresa?.afiliacion_id : this._userService?.currentUser?.persona?.afiliacion_id;
    loadEmpresaPaginator() {
        this.loadingRecords = true;
        const date =
            this.filters.value.date !== '' && this.filters.value.date !== null
                ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
                : '';
        const date2 =
            this.filters.value.date2 !== '' && this.filters.value.date2 !== null
                ? `date2: "${moment(this.filters.value.date2).format('YYYY-MM-DD')}",`
                : '';
        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const status = this.filters.value.seleccion !== '' ? `status: ${this.filters.value.seleccion},` : `status: 1`;
        const queryParams = ` id_afiliacion: ${this.afiliacionId}  ${status}, search2: "ASESORIAS", limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date} ${date2}`;
        const queryProps =
            'data{ id, date, persona{id, primer_nombre, primer_apellido, tipoDocumento, numDocumento}, empresaServicio{id, razon_social, numDocumento, numDocumento}, id_afiliacion, id_servicio, cantidad, valor, nombre, paquete, unidad,  numero_empleados, obs, status, status_pago }, total';
        const nombreQuery = 'getDetalleServicioPagination';
        this.apiService.getData(queryProps, queryParams, nombreQuery).subscribe(
            (response: any) => {
                this.total = response.data.getDetalleServicioPagination.total;
                this.data = response.data.getDetalleServicioPagination.data;
                this.dataEmpresaAny = response.data.getDetalleServicioPagination.data;
                this.resultsLength = response.data.getDetalleServicioPagination.total;
                this.afiliacionFilter = response.data.getDetalleServicioPagination.data;
                this.dataEmpresa.data = this.data;
           
                // this.totalAfiliados = this.dataEmpresaAny.reduce((
                //     acc,
                //     obj,
                // ) => acc + (obj.empleados.length++), 0
                // );
                this.loadingRecords = false;
                console.log('estos son los datos para la empresa ', this.dataEmpresa)

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

    openEmpleadosModal() {
        // const dialogRef = this.dialog.open(ReciboEmpleadoModalComponent, {
        //     width: '1500px',
        //     height: '800px',
        //     maxHeight: '850px',
        //     data: {
        //     }
        // });
        // dialogRef.afterClosed().subscribe((result: any) => {
        //     if (!result) return;
        //     //this.loadRecords();
        //     console.log(result);

        // });
    }




    ngOnInit(): void {

        // this.loadEmpresaPaginator()
        this.loadEmpresaPaginator()
        this.dataEmpresa = new MatTableDataSource();

    }

}
