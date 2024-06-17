import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import moment from 'moment';
import { filter, tap, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
// import { MultimediaModalComponent } from '../multimediaModal/multimedia-modal.component';

import { FileUploader } from 'ng2-file-upload';
import { environment } from 'environments/environment';
import { ApiService } from 'app/core/api/api.service';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';


export interface PeriodicElement {
    cedula: string;
    fecha: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { cedula: '1090481240', fecha: '12/12/20' },
    { cedula: '1234589621', fecha: '12/12/20' },
    { cedula: '1586568448', fecha: '12/12/20' }
];


@Component({
    selector: 'vex-cargarDocumentos',
    templateUrl: './cargarDocumentos.component.html',
    styleUrls: ['./cargarDocumentos.component.scss']
})
export class CargarDocumentosComponent implements OnInit {
    displayedColumnsDocuments2: string[] = ['nombre_documento', 'fecha_guardado', 'acciones'];
    displayedColumnsDocuments: string[] = ['nombre_documento', 'fecha_guardado', 'imagen', 'descripcion'];
    displayedColumns: string[] = ['cedula', 'fecha', 'acciones'];
    dataSource = ELEMENT_DATA;
    
    public uploader: FileUploader = new FileUploader({
        isHTML5: true,
        // url: 'http://localhost:8000/v1/actions/recordMultimediaEmpleado'
        url: `${environment.serverUrl}/v1/actions/recordMultimediaEmpleado`
    });
    alertIsVisible = true;
 
    sending = false;
    contrato = false;
    editing = false;
    dataAfiliacion: any;
    procFilterCtrl: FormControl = new FormControl();
    uploadForm: FormGroup;

    protected _onDestroy = new Subject<void>();

    public searchingProcedures = false;

    public filtereddataProcedure: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    loadingRecords = false;
    dataCaja: any[] = [];
    dataPension: any[] = [];
    dataEps: any[] = [];
    dataSucursal: any[] = [];
    loading: boolean;
    imagen: any []=[];
    servicio_id: number;
    ss= false;
    general= false;
    Planilla= false;
    incapacidad = false;
    imagenPlanilla: any[] = [];
    ngOnInit(): void {
       
       
        console.log(this.data?.general);
        console.log(this.data?.nombre);
        if (this.data?.general) {
            this.uploader.setOptions({
                additionalParameter: {
                    record_id: this.data.general.id == null ? this.data.general : this.data.general.id,
                    servicio_id: 100,
                    nombre: this.data?.nombre
                },
                headers: [
                    {
                        name: 'authorization',
                        value: `Bearer ${this.credentialsService.accessToken}`
                    }
                ]
            });

            if (this.data?.general.id) {
                this.dataAfiliacion = this.data?.general.id
                console.log(this.dataAfiliacion);
                this.general = true;
                this.editing = true;
                this.servicio_id = 100
            } else {

                this.dataAfiliacion = this.data?.general
                console.log(this.dataAfiliacion);
                this.general = true;
                this.editing = true;
                this.servicio_id = 100
            }


        }
        if (this.data?.contrato) {
            this.uploader.setOptions({
                additionalParameter: {
                    record_id: this.data?.contrato.id == null ? this.data?.contrato : this.data?.contrato.id,
                    servicio_id: 5
                },
                headers: [
                    {
                        name: 'authorization',
                        value: `Bearer ${this.credentialsService.accessToken}`
                    }
                ]
            });

            if (this.data?.contrato.id) {
                this.dataAfiliacion = this.data?.contrato.id
                console.log(this.dataAfiliacion);
                this.contrato = true;
                this.editing = true;
                this.servicio_id = 5
            }else{

                this.dataAfiliacion = this.data?.contrato
                console.log(this.dataAfiliacion);
                this.contrato = true;
                this.editing = true;
                this.servicio_id = 5
            }
            
            
        }
        if (this.data?.ss) {
            this.uploader.setOptions({
                additionalParameter: {
                    record_id: this.data?.ss.id == null ? this.data?.ss : this.data?.ss.id,
                    servicio_id: 1
                },
                headers: [
                    {
                        name: 'authorization',
                        value: `Bearer ${this.credentialsService.accessToken}`
                    }
                ]
            });

            if (this.data?.ss.id) {
                this.dataAfiliacion = this.data?.ss.id
                console.log(this.dataAfiliacion);
                this.ss = true;
                this.editing = true;
                this.servicio_id = 1
            }else{
                this.dataAfiliacion = this.data?.ss
                console.log(this.dataAfiliacion);
                this.ss = true;
                this.editing = true;
                this.servicio_id = 1
            }
        }

        if (this.data?.planilla) {
            this.uploader.setOptions({
                additionalParameter: {
                    record_id: this.data?.planilla.id == null ? this.data?.planilla : this.data?.planilla.id,
                    planilla_id: 1
                },
                headers: [
                    {
                        name: 'authorization',
                        value: `Bearer ${this.credentialsService.accessToken}`
                    }
                ]
            });

            if (this.data?.planilla.id) {
                this.dataAfiliacion = this.data?.planilla.id
                console.log(this.dataAfiliacion);
                this.Planilla = true;
                this.editing = true;
                this.servicio_id = 1
            } else {
                this.dataAfiliacion = this.data?.planilla
                console.log(this.dataAfiliacion);
                this.Planilla = true;
                this.editing = true;
                this.servicio_id = 1
            }
        }

        console.log(this.data?.incapacidad);
        if (this.data?.incapacidad) {
            this.uploader.setOptions({
                additionalParameter: {
                    record_id: this.data.incapacidad.empleado_id == null ? this.data.incapacidad : this.data.incapacidad.empleado_id,
                    servicio_id: 6
                },
                headers: [
                    {
                        name: 'authorization',
                        value: `Bearer ${this.credentialsService.accessToken}`
                    }
                ]
            });

            if (this.data?.incapacidad.empleado_id) {
                this.dataAfiliacion = this.data?.incapacidad.empleado_id
                console.log(this.dataAfiliacion);
                this.incapacidad = true;
                this.editing = true;
                this.servicio_id = 6
            } else {

                this.dataAfiliacion = this.data?.incapacidad
                console.log(this.dataAfiliacion);
                this.incapacidad = true;
                this.editing = true;
                this.servicio_id = 0
            }


        }
      
        this.uploadForm = this.fb.group({
            document: [null, [Validators.required]],
        });

        this.dataCaja;

        // this.loadSucursal()
        this.getRecordPlanillaMultimedia()
        this.getRecordMultimedia();
        this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
        this.uploader.onCompleteItem = (file) => { this.getRecordMultimedia(), this.getRecordPlanillaMultimedia };
        
    }
    
    
   
    solicitud = new FormGroup({
        primer_nombre: new FormControl('', []),
        segundo_nombre: new FormControl('', []),
        primer_apellido: new FormControl('', []),
        segundo_apellido: new FormControl('', []),
        tipo_documento: new FormControl('', []),
        numero_documento: new FormControl('', []),
        ciudad: new FormControl('', []),
        departamento: new FormControl('', []),
        direccion: new FormControl('', []),
        movil: new FormControl('', []),
        eps: new FormControl('', []),
        arl: new FormControl('', []),
        f_de_pensiones: new FormControl('', []),
        caja_cf: new FormControl('', []),
        tipoContrato: new FormControl('', []),
        fecha_ingreso: new FormControl('', []),
        fecha_retiro: new FormControl('', []),
        salario_base: new FormControl('', [ Validators.min(1000000)]),
        cargo: new FormControl('', []),
        riesgo: new FormControl('', []),
        sucursal: new FormControl('', []),
        subsidio_transporte: new FormControl('', [Validators.min(117172)]),
        periodo_de_pago: new FormControl('', []),
        tipoVinculacion: new FormControl('', []),
        tipoAfiliacion: new FormControl('', []),
        email: new FormControl('', []),
        aporte_activacion: new FormControl('', []),
    });

    constructor(
        public dialogRef: MatDialogRef<CargarDocumentosComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private coreService: UserService,
        private router: Router,
        private _snackBar: MatSnackBar,
        private fb: FormBuilder,
        private credentialsService: AuthService,
    ) {

    }
    close(params: any = null) {
        this.dialogRef.close(params);
        this.imagen;
    }

    getErrorMessage() {
        return this.solicitud.controls.salario_base.hasError('required')
            ? 'El salario es requerido'
            : this.solicitud.controls.salario_base.hasError('min')
                ? 'El valor debe ser igual o mayor al salario minimo (1000000)'
                : '';
    }
    getErrorTransporte() {
        return this.solicitud.controls.subsidio_transporte.hasError('required')
            ? 'El subsidio es requerido'
            : this.solicitud.controls.subsidio_transporte.hasError('min')
                ? 'El valor debe ser igual o mayor(117172)'
                : '';
    }
  
    getRecordMultimedia() {
        this.loadingRecords = true;
        const queryParams = `empleado_id: ${this.dataAfiliacion}, servicio_id: ${this.servicio_id}`;
        const queryProps =
            'id,name,description,url,type,status, servicio_id,created_at';

        this.apiService.getData(queryProps, queryParams, 'multimedias').subscribe(
            (result: any) => {
                this.loadingRecords = false;
                this.imagen = result.data.multimedias;
                // this.currentRecord.multimedias = result.data.multimedias;
                // this.apiService.setEmpresa(result.data.record);
                // this.setCurrentRecord(result.data.record);

                console.log(result);
            },
            (error: any) => {
                this.loadingRecords = false;
                console.log(error);
            }
        );
    }
    getRecordPlanillaMultimedia() {
        this.loadingRecords = true;
        const queryParams = `planilla_id: ${this.dataAfiliacion}`;
        const queryProps =
            'id,name,description,url,type,status, servicio_id,created_at';
        this.apiService.getData(queryProps, queryParams, 'multimedias').subscribe(
       
            (result: any) => {
                this.loadingRecords = false;
                this.imagenPlanilla = result.data.multimedias;
                // this.currentRecord.multimedias = result.data.multimedias;
                // this.apiService.setEmpresa(result.data.record);
                // this.setCurrentRecord(result.data.record);

                console.log(result);
            },
            (error: any) => {
                this.loadingRecords = false;
                console.log(error);
            }
        );
    }
    openMultimediaModal(empleado: any) {
        // const dialogRef = this.dialog.open(MultimediaModalComponent, {
        //     width: '480px',
        //     height: '504px',
        //     maxHeight: '800px',
        //     data: {
        //         empleado: empleado
        //     }
        // });

        // dialogRef.afterClosed().subscribe((result: any) => {
        //     if (!result) { return; }

        //     this.getRecordMultimedia();
        // });
    }
    deleteMultimedia(multimedia: any) {
        var r = confirm('¿Seguro que desea eliminar el archivo?');
        if (r === true) {
            this.loading = true;

            const id = multimedia ? `id: ${multimedia.id},` : '';
            const queryParams = `${id} delete: 1`;
            const queryProps = 'id';
            this.apiService.setData(queryProps, queryParams, 'saveMultimedia').subscribe(
            
                (response: any) => {
                    this.loading = false;

                    
                    this._snackBar.open('Eliminado', null, {
                        duration: 4000
                    });
                    this.getRecordMultimedia();
                    this.getRecordPlanillaMultimedia()
                },
                error => {
                    this.loading = false;
                    this._snackBar.open('Error.', null, {
                        duration: 4000
                    });

                    console.log(error);
                }
            );
        }
    }
    saveDetails() {
        // if (this.solicitud.invalid) {
        //     return;
        // }
        this.sending = true;
        const data = this.solicitud.value;

        const id = data.id ? `id: ${data.id},` : '';
        // const afiliacion_id = this.id = this.route.snapshot.paramMap.get('id');
        const primer_nombre = data.primer_nombre !== '' && data.primer_nombre !== null ? `primer_nombre: "${data.primer_nombre}",` : `primer_nombre: " ",`;
        const segundo_nombre = data.segundo_nombre !== '' && data.segundo_nombre !== null ? `segundo_nombre: "${data.segundo_nombre}",` : `segundo_nombre: " ",`;
        const primer_apellido = data.primer_apellido !== '' && data.primer_apellido !== null ? `primer_apellido: "${data.primer_apellido}",` : `primer_apellido: " ",`;
        const fecha_ingreso = data.fecha_ingreso !== '' && data.fecha_ingreso !== null ? `fecha_ingreso: "${data.fecha_ingreso}",` : `fecha_ingreso: " ",`;
        const segundo_apellido = data.segundo_apellido !== '' && data.segundo_apellido !== null ? `segundo_apellido: "${data.segundo_apellido}",` : `segundo_apellido: " ",`;
        const tipo_documento = data.tipo_documento !== '' && data.tipo_documento !== null ? `tipo_documento: "${data.tipo_documento}",` : `tipo_documento: " ",`;
        const numero_documento = data.numero_documento !== '' && data.numero_documento !== null ? `numero_documento: "${data.numero_documento}",` : `numero_documento: " ",`;
        const ciudad = data.ciudad !== '' && data.ciudad !== null ? `ciudad: "${data.ciudad}",` : `ciudad: " ",`;
        const departamento = data.departamento !== '' && data.departamento !== null ? `departamento: "${data.departamento}",` : `departamento: " ",`;
        const direccion = data.direccion !== '' && data.direccion !== null ? `direccion: "${data.direccion}",` : `direccion: " ",`;
        const movil = data.movil !== '' && data.movil !== null ? `movil: "${data.movil}",` : `movil: " ",`;
        const eps = data.eps !== '' && data.eps !== null ? `eps: "${data.eps}",` : `eps: " ",`;
        const f_de_pensiones = data.f_de_pensiones !== '' && data.f_de_pensiones !== null ? `f_de_pensiones: "${data.f_de_pensiones}",` : `f_de_pensiones: " ",`;
        const fecha_retiro = data.fecha_retiro !== '' && data.fecha_retiro !== null ? `fecha_retiro: "${data.fecha_retiro}",` : `fecha_retiro: " ",`;
        const salario_base = data.salario_base !== '' && data.salario_base !== null ? `salario_base: ${data.salario_base},` : `salario_base: 0,`;
        const arl = data.arl !== '' && data.arl !== null ? `arl: "${data.arl}",` : `arl: " ",`;
        const riesgo = data.riesgo !== '' && data.riesgo !== null ? `riesgo: "${data.riesgo}",` : `riesgo: " ",`;
        const caja_cf = data.caja_cf !== '' && data.caja_cf !== null ? `caja_cf: "${data.caja_cf}",` : `caja_cf: " ",`;
        const sucursal = data.sucursal !== '' && data.sucursal !== null ? `sucursal: "${data.sucursal}",` : `sucursal: " ",`;
        const subsidio_transporte = data.subsidio_transporte !== '' && data.subsidio_transporte !== null ? `subsidio_transporte: "${data.subsidio_transporte}",` : `subsidio_transporte: " ",`;
        const periodo_de_pago = data.periodo_de_pago !== '' && data.periodo_de_pago !== null ? `periodo_de_pago: "${data.periodo_de_pago}",` : `periodo_de_pago: " ",`;
        const tipoContrato = data.tipoContrato !== '' && data.tipoContrato !== null ? `tipoContrato: ${data.tipoContrato},` : '';
        const tipoVinculacion = data.tipoVinculacion !== '' && data.tipoVinculacion !== null ? `tipoVinculacion: ${data.tipoVinculacion},` : '';
        const tipoAfiliacion = data.tipoAfiliacion !== '' && data.tipoAfiliacion !== null ? `tipoAfiliacion: ${data.tipoAfiliacion},` : '';
        const email = data.email !== '' && data.email !== null ? `email: "${data.email}",` : `email: " ",`;
        const cargo = data.cargo !== '' && data.cargo !== null ? `cargo: "${data.cargo}",` : `cargo: " ",`;
        const aporte_activacion = data.aporte_activacion !== '' && data.aporte_activacion !== null ? `aporte_activacion: ${data.aporte_activacion},` : `aporte_activacion:  ${this.dataAfiliacion.aporte_activacion},`;
        const queryParams = ` id: ${this.data.afiliacion.id}, ${aporte_activacion} ${cargo} ${email}  ${primer_nombre} ${segundo_nombre} ${fecha_ingreso} ${primer_apellido} ${segundo_apellido} ${tipo_documento} ${numero_documento} ${ciudad} ${departamento} ${direccion} ${movil} ${eps} ${f_de_pensiones} ${fecha_retiro} ${salario_base} ${arl} ${riesgo} ${caja_cf} ${sucursal}${subsidio_transporte}${periodo_de_pago} ${tipoContrato} ${tipoVinculacion} ${tipoAfiliacion}`;
        const queryProps = 'id, primer_nombre';
        this.apiService.setData(queryProps, queryParams, 'crearEmpleado').subscribe(

            (response: any) => {
                this.sending = false;

                this._snackBar.open('Guardado', null, {
                    duration: 4000
                });
                console.log(queryParams)
                this.close(data);
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

}
