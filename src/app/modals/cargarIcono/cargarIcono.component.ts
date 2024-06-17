import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import moment from 'moment';
import { filter, tap, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
// import { MultimediaModalComponent } from '../multimediaModal/multimedia-modal.component';
// import { CredentialsService } from 'src/app/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'environments/environment';
import { CredentialsService } from 'app/core/credentials.service';
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
    selector: 'vex-cargaricono',
    templateUrl: './cargaricono.component.html',
    styleUrls: ['./cargaricono.component.scss']
})
export class CargarIconoComponent implements OnInit {
    displayedColumnsDocuments: string[] = ['nombre_documento', 'fecha_guardado', 'imagen', 'descripcion', 'acciones'];
    displayedColumns: string[] = ['cedula', 'fecha', 'acciones'];
    dataSource = ELEMENT_DATA;
    public uploader: FileUploader = new FileUploader({
        isHTML5: true,
        // url: 'http://localhost:8000/v1/actions/empresaProfile'
        url: `${environment.serverUrl}/v1/actions/empresaProfile`
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
    dataEmpresa: any;
    dataPersona: any;
    persona = false;
    ngOnInit(): void {
       this.loadDataPersona()
       this.loadDataEmpresa();
        console.log(this.data.ss);
        console.log(this.data.imagen);
        if (this.data.ss) {
            this.uploader.setOptions({
                additionalParameter: {
                    record_id: this.data.ss,
                },
                headers: [
                    {
                        name: 'authorization',
                        value: `Bearer ${this.credentialsService.accessToken}`
                    }
                ]
            });

            if (this.data.ss.id) {
                this.dataAfiliacion = this.data.ss.id
                console.log(this.dataAfiliacion);
                this.ss = true;
                this.editing = true;
                this.servicio_id = 1
            }
        }
      
        this.uploadForm = this.fb.group({
            document: [null, [Validators.required]],
        });


        // this.loadSucursal()
     
        // this.getRecordMultimedia();
        this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
        if(this.data?.persona){

            this.persona = true;

            this.uploader.onCompleteItem = (file) => { this.loadDataPersona() };

        }else{
            this.uploader.onCompleteItem = (file) => { this.loadDataEmpresa() };
        }
        
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
        public dialogRef: MatDialogRef<CargarIconoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        private coreService: UserService,
        private router: Router,
        private _snackBar: MatSnackBar,
        private fb: FormBuilder,
        // private credentialsService: CredentialsService,
        private credentialsService: AuthService,
    ) {

    }
    imagenEmpresa(){
        this.coreService.currentUser.empresa.imagen
    }
    close(params: any = null) {
        this.dialogRef.close(params);
        this.imagen;
    }
    loadDataPersona() {
        console.log('loading records...');

        this.loadingRecords = true;
        // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `afiliacion_id: ${this.data.ss}`;
        const queryProps =
            'id,  afiliacion, imagen, afiliacion_id, liquidacion, asesorias, iva, incapacidades, examenes, primer_nombre, primer_apellido, tipoDocumento, numDocumento, ciudad, email, departamento,  direccion, telefono, tipoAfiliacion, eps, arl, tipoVinculacion, cargo, riesgo, pensiones, salario_base, status ';
        this.apiService.getData(queryProps, queryParams, 'persona').subscribe(

            (response: any) => {
                this.dataPersona = response.data.persona;
                this.apiService.setEmpresa(response.data.persona);

                console.log(this.dataPersona, 'datos independientes')
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
    loadDataEmpresa() {
        console.log('loading records...');

        this.loadingRecords = true;
        // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `afiliacion_id: ${this.data.ss}`;
        const nombreQuery = 'empresa';
        const queryProps =
            'id, periodo, categoria, imagen, detalleServicio{id, id_afiliacion, id_servicio,  status servicio{id, nombre} }, updated_at, afiliacion_id, contacto, telContacto, tipoEmpresa, razon_social, primer_nombre, direccion, email, departamento, ciudad, numDocumento, dv, telEmpresaMovil, telEmpresaFijo, representanteLegal, contacto, email_responsable, email_contacto, telefono_responsable, arl, riesgo, caja_cf ';
        this.apiService.getData(queryProps, queryParams, nombreQuery).subscribe(
            (response: any) => {
                this.dataEmpresa = response.data.empresa;
                this.apiService.setEmpresa(response.data.empresa);
               
            },
            error => {
                this.loadingRecords = false;
                // this._snackBar.open('Error.', null, {
                //   duration: 4000
                // });
                console.log(error);
            }
        );
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
  


    deleteMultimedia(multimedia: any) {
        // var r = confirm('¿Seguro que desea eliminar el archivo?');
        // if (r === true) {
        //     this.loading = true;

        //     const id = multimedia ? `id: ${multimedia.id},` : '';
        //     const queryParams = `${id} delete: 1`;
        //     const queryProps = 'id';

        //     this.apiService.saveLocalMultimedia(queryParams, queryProps).subscribe(
        //         (response: any) => {
        //             this.loading = false;

        //             // this.getRecordMultimedia();

        //             this._snackBar.open('Eliminado', null, {
        //                 duration: 4000
        //             });
        //         },
        //         error => {
        //             this.loading = false;
        //             this._snackBar.open('Error.', null, {
        //                 duration: 4000
        //             });

        //             console.log(error);
        //         }
        //     );
        // }
    }
    

}
