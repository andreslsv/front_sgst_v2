import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, MinLengthValidator } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import moment from 'moment';
import { filter, tap, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';

import { FileUploader } from 'ng2-file-upload';

import { MultimediaModalComponent } from '../multimediaModal/multimedia-modal.component';
import { environment } from 'environments/environment';
import { ApiService } from 'app/core/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { CrearCargoModalComponent } from '../crearCargo/crearCargo.component';
// import { CrearCargoModalComponent } from '../crearCargo/crearCargo.component';


export interface PeriodicElement {
  cedula: string;
  fecha: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {cedula: '1090481240', fecha: '12/12/20'},
  {cedula: '1234589621', fecha: '12/12/20'},
  {cedula: '1586568448', fecha: '12/12/20'}
];


@Component({
  selector: 'vex-crear-empleado',
  templateUrl: './crear-empleado.component.html',
  styleUrls: ['./crear-empleado.component.scss']
})
export class CrearEmpleadoComponent implements OnInit {
  uploadForm: FormGroup;
  displayedColumnsDocuments: string[] = ['nombre_documento', 'fecha_guardado', 'imagen', 'acciones'];
  displayedColumns: string[] = ['cedula', 'fecha', 'acciones'];
  dataSource = ELEMENT_DATA;
  
  sending= false;
  showOnlyName= false;
  editing= false;
  dataAfiliacion: any [] = [];
  procFilterCtrl: FormControl = new FormControl(); 
  pensionFilterCtrl: FormControl = new FormControl();
  EpsFilterCtrl: FormControl = new FormControl();
  CiudadesFilterCtrl: FormControl = new FormControl();
  CargoFilterCtrl: FormControl = new FormControl();

  public uploader: FileUploader = new FileUploader({
    isHTML5: true,
    url: `${environment.serverUrl}/v1/actions/recordMultimedia`
  });
  protected _onDestroy = new Subject<void>();

  public searchingProcedures = false;
  public searchingPension = false;
  public searchingEps = false;
  public searchingCiudad = false;
  public searchingCargo = false;
  tipoIndefinido= false;
  dataEmpleado: any[] = [];
  imagen: any []=[];
  loading: boolean;
  serviceActive= false;
  dataModal: any;
  razonSocial: any;
  setTipoContrato(index) {
    this.tipoIndefinido = index;
  }
  public filtereddataProcedure: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filtereddataPension: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filtereddataEps: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filtereddataCiudades: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filtereddataCargo: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  loadingRecords= false;
  dataCaja: any []=[];
  dataPension: any[] = [];
  dataEps: any[] = [];
  dataSucursal: any[] = [];
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  
  ngOnInit(): void {
    this.dataAfiliacion = this.data.afiliacion;
    this.razonSocial = this.data?.razonSocial
    console.log(this.dataAfiliacion);
    console.log('razon social',this.data?.razonSocial);
    if (this.data.afiliacion) {
      this.solicitud.setValue({
        // id: this.data.afiliacion.id ? this.data.afiliacion.id : null,
        // patient: this.data.afiliacion.app_user_id ? this.data.afiliacion.app_user_id : null,
        fecha_ingreso: this.data.afiliacion.fecha_ingreso ? this.data.afiliacion.fecha_ingreso : new Date(),
        fecha_retiro: this.data.afiliacion.fecha_retiro ? this.data.afiliacion.fecha_retiro : null,
        // value: this.data.afiliacion.value ? parseInt(this.data.afiliacion.value, 10) : null,
        primer_nombre: this.data.afiliacion.primer_nombre ? this.data.afiliacion.primer_nombre : null,
        segundo_nombre: this.data.afiliacion.segundo_nombre ? this.data.afiliacion.segundo_nombre : null,
        primer_apellido: this.data.afiliacion.primer_apellido ? this.data.afiliacion.primer_apellido : null,
        segundo_apellido: this.data.afiliacion.segundo_apellido ? this.data.afiliacion.segundo_apellido : null,
        tipo_documento: this.data.afiliacion.tipo_documento ? this.data.afiliacion.tipo_documento.toString() : null,
        numero_documento: this.data.afiliacion.numero_documento ? this.data.afiliacion.numero_documento : null,
        ciudad: this.data.afiliacion.ciudad ? this.data.afiliacion.ciudad : null,
        departamento: this.data.afiliacion.departamento ? this.data.afiliacion.departamento.toString() : null,
        direccion: this.data.afiliacion.direccion ? this.data.afiliacion.direccion : null,
        movil: this.data.afiliacion.movil ? this.data.afiliacion.movil : null,
        eps: this.data.afiliacion.eps ? this.data.afiliacion.eps.toString() : null,
        arl: this.data.afiliacion.arl ? this.data.afiliacion.arl.toString() : null,
        f_de_pensiones: this.data.afiliacion.f_de_pensiones ? this.data.afiliacion.f_de_pensiones.toString() : null,
        caja_cf: this.data.afiliacion.caja_cf ? this.data.afiliacion.caja_cf : null,
        tipoContrato: this.data.afiliacion.tipoContrato ? this.data.afiliacion.tipoContrato.toString() : null,
        salario_base: this.data.afiliacion.salario_base ? this.data.afiliacion.salario_base : null,
        cargo: this.data.afiliacion.cargo ? this.data.afiliacion.cargo : null,
        riesgo: this.data.afiliacion.riesgo ? this.data.afiliacion.riesgo.toString() : null,
        sucursal: this.data.afiliacion.sucursal ? this.data.afiliacion.sucursal.toString() : null,
        subsidio_transporte: this.data.afiliacion.subsidio_transporte ? this.data.afiliacion.subsidio_transporte : null,
        periodo_de_pago: this.data.afiliacion.periodo_de_pago ? this.data.afiliacion.periodo_de_pago.toString() : null,
        tipoAfiliacion: this.data.afiliacion.tipoAfiliacion ? this.data.afiliacion.tipoAfiliacion.toString() : null,
        tipoVinculacion: this.data.afiliacion.tipoVinculacion ? this.data.afiliacion.tipoVinculacion.toString() : null,
        email: this.data.afiliacion.email ? this.data.afiliacion.email : null,
        aporte_activacion: this.data.afiliacion.aporte_activacion ? this.data.afiliacion.aporte_activacion : null,
        // status: this.data.afiliacion.status ? this.data.afiliacion.status.toString() : null,
      });

        this.showOnlyName = true;
        this.editing = true;

        this.dataModal = this.data.afiliacion
      
    } 
    if(this.data.newService){
      this.dataModal = this.data.newService
      this.serviceActive = true;
    }
    // else {
    //   this.solicitud.controls.fecha_ingreso.setValue(new Date());
    //   this.solicitud.controls.fecha_retiro.setValue(new Date());
    // }

    this.procFilterCtrl.valueChanges.pipe(
      filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 2),
      tap(() => this.searchingProcedures = true),
      takeUntil(this._onDestroy),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => this.apiService.getData('id,codigo,nombre', `search: "${term}"`, 'cajaCompensacion'))

    ).subscribe((results: any) => {
      console.log(results);
      this.searchingProcedures = false;
      this.filtereddataProcedure.next(results.data.cajaCompensacion);
    }, error => {
      this.searchingProcedures = false;
    });
    this.pensionFilterCtrl.valueChanges.pipe(
      filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 2),
      tap(() => this.searchingPension = true),
      takeUntil(this._onDestroy),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => this.apiService.getData('id,codigo,nombre', `search: "${term}"`, 'pensiones'))

    ).subscribe((results: any) => {
      console.log(results);
      this.searchingPension = false;
      this.filtereddataPension.next(results.data.pensiones);
    }, error => {
      this.searchingPension = false;
    });
    this.EpsFilterCtrl.valueChanges.pipe(
      filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 2),
      tap(() => this.searchingEps = true),
      takeUntil(this._onDestroy),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => this.apiService.getData('id,codigo,nombre', `search: "${term}"`, 'eps'))

    ).subscribe((results: any) => {
      console.log(results);
      this.searchingEps = false;
      this.filtereddataEps.next(results.data.eps);
    }, error => {
      this.searchingEps = false;
    });

    this.CiudadesFilterCtrl.valueChanges.pipe(
      filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 2),
      tap(() => this.searchingCiudad = true),
      takeUntil(this._onDestroy),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => this.apiService.getData('id,nombre', `search: "${term}"`, 'ciudad'))

    ).subscribe((results: any) => {
      console.log(results);
      this.searchingCiudad = false;
      this.filtereddataCiudades.next(results.data.ciudad);
    }, error => {
      this.searchingCiudad = false;
    });

    this.CargoFilterCtrl.valueChanges.pipe(
      filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 2),
      tap(() => this.searchingCargo = true),
      takeUntil(this._onDestroy),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => this.apiService.getData('id,nombre', `search: "${term}" empresa_id:${this.dataAfiliacion}`, 'getCargo'))

    ).subscribe((results: any) => {
      console.log(results);
      this.searchingCargo = false;
      this.filtereddataCargo.next(results.data.getCargo);
    }, error => {
      this.searchingCargo = false;
    });
    
    this.dataCaja;
    this.loadCaja();
    this.loadPension();
    this.loadEps();
    this.loadSucursal()
    this.uploadForm = this.fb.group({
      document: [null, [Validators.required]],
    });
    this.firstFormGroup = this.fb.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required]
    });
  }
  getRecordMultimedia(id: any) {
    this.loadingRecords = true;
    const queryParams = ``;
    const queryProps =
      'id,name,description,url,type,status,created_at';
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
  loadSucursal() {
    console.log('loading records... ', this.dataSucursal);

    this.loadingRecords = true;
   
    const queryParams = `afiliacion_id: ${this.dataModal}  `;
    const queryProps =
      'id, nombre, caja_cf, departamento, ciudad';
    this.apiService.getData(queryProps, queryParams, 'sucursales').subscribe(

      (response: any) => {
      
        this.dataSucursal = response.data.sucursales;

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
  loadCaja() {
    console.log('loading records...');

    this.loadingRecords = true;
    // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `search: "" `;
    const queryProps =
      ' id, nombre, codigo';
    this.apiService.getData(queryProps, queryParams, 'cajaCompensacion').subscribe(

      (response: any) => {

        this.dataCaja = response.data.cajaCompensacion;

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
  loadEps() {
    console.log('loading records...');

    this.loadingRecords = true;
    // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `search: "" `;
    const queryProps =
      ' id, nombre, codigo';
    this.apiService.getData(queryProps, queryParams, 'eps').subscribe(
   
      (response: any) => {

        this.dataEps = response.data.eps;

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
  loadPension() {
    console.log('loading records...');

    this.loadingRecords = true;
    // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `search: "" `;
    const queryProps =
      ' id, nombre, codigo';
    this.apiService.getData(queryProps, queryParams, 'pensiones').subscribe(

      (response: any) => {

        this.dataPension = response.data.pensiones;

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
    primer_nombre: new FormControl('', [Validators.required]),
    segundo_nombre: new FormControl('', []),
    primer_apellido: new FormControl('', [Validators.required]),
    segundo_apellido: new FormControl('', []),
    tipo_documento: new FormControl('', [Validators.required]),
    numero_documento: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', []),
    departamento: new FormControl('', []),
    direccion: new FormControl('', []),
    movil: new FormControl('', []),
    eps: new FormControl('', [Validators.required]),
    arl: new FormControl('', []),
    f_de_pensiones: new FormControl('', []),
    caja_cf: new FormControl('', []),
    tipoContrato: new FormControl('', []),
    fecha_ingreso: new FormControl('', []),
    fecha_retiro: new FormControl('', []),
    salario_base: new FormControl('', [Validators.required, Validators.min(1000000)]),
    cargo: new FormControl('', []),
    riesgo: new FormControl('', [Validators.required]),
    sucursal: new FormControl('', []),
    subsidio_transporte: new FormControl('', [Validators.min(117172)]),
    periodo_de_pago: new FormControl('', []),
    tipoVinculacion: new FormControl('', []),
    tipoAfiliacion: new FormControl('', []),
    email: new FormControl('', []),
    aporte_activacion: new FormControl('', []),
  });
  getErrorMessage() {
    return this.solicitud.controls.salario_base.hasError('required')
      ? 'El campo es requerido'
      : this.solicitud.controls.salario_base.hasError('min')
        ? 'El valor debe ser igual o mayor al salario minimo (1000000)'
        : '';
  }
  getErrorTransporte() {
    return this.solicitud.controls.subsidio_transporte.hasError('required')
      ? 'El campo es requerido'
      : this.solicitud.controls.subsidio_transporte.hasError('min')
        ? 'El valor debe ser igual o mayor(117172)'
        : '';
  }
  getErrorPrimerNombre() {
    return this.solicitud.controls.primer_nombre.hasError('required')
      ? 'El campo es requerido'
       : '';
  }
  getErrorPrimerApellido() {
    return this.solicitud.controls.primer_apellido.hasError('required')
      ? 'El campo es requerido'
        : '';
  }
  getErrorTipoDocumento() {
    return  this.solicitud.controls.tipo_documento.hasError('required')
      ? 'El campo es requerido' : '';
  }
  getErrorDocumento() {
    return this.solicitud.controls.numero_documento.hasError('required')
      ? 'El campo es requerido' : '';
  }
  constructor(
    public dialogRef: MatDialogRef<CrearEmpleadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private coreService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private credentialsService: AuthService,
    private fb: FormBuilder,
  ) {

  }
  close(params: any = null) {
    this.dialogRef.close(params);
  }
  saveNewService() {
    if (this.solicitud.invalid) {
      return;
    }

    this.sending = true;
    const data = this.solicitud.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const afiliacion_id = this.id = this.route.snapshot.paramMap.get('id');
    const primer_nombre = data.primer_nombre !== '' && data.primer_nombre !== null ? `primer_nombre: "${data.primer_nombre}",` : `primer_nombre: " ",`;
    const segundo_nombre = data.segundo_nombre !== '' && data.segundo_nombre !== null ? `segundo_nombre: "${data.segundo_nombre}",` : `segundo_nombre: " ",`;
    const primer_apellido = data.primer_apellido !== '' && data.primer_apellido !== null ? `primer_apellido: "${data.primer_apellido}",` : `primer_apellido: " ",`;
    const fecha_ingreso = data.fecha_ingreso !== '' && data.fecha_ingreso !== null ? `fecha_ingreso: "${moment(data.fecha_ingreso).format('YYYY-MM-DD')}",` : '';
    const segundo_apellido = data.segundo_apellido !== '' && data.segundo_apellido !== null ? `segundo_apellido: "${data.segundo_apellido}",` : `segundo_apellido: " ",`;
    const tipo_documento = data.tipo_documento !== '' && data.tipo_documento !== null ? `tipo_documento: "${data.tipo_documento}",` : `tipo_documento: " ",`;
    const numero_documento = data.numero_documento !== '' && data.numero_documento !== null ? `numero_documento: "${data.numero_documento}",` : `numero_documento: " ",`;
    const ciudad = data.ciudad !== '' && data.ciudad !== null ? `ciudad: "${data.ciudad}",` : `ciudad: " ",`;
    const departamento = data.departamento !== '' && data.departamento !== null ? `departamento: "${data.departamento}",` : `departamento: " ",`;
    const direccion = data.direccion !== '' && data.direccion !== null ? `direccion: "${data.direccion}",` : `direccion: " ",`;
    const movil = data.movil !== '' && data.movil !== null ? `movil: "${data.movil}",` : `movil: " ",`;
    const eps = data.eps !== '' && data.eps !== null ? `eps: "${data.eps}",` : `eps: " ",`;
    const f_de_pensiones = data.f_de_pensiones !== '' && data.f_de_pensiones !== null ? `f_de_pensiones: "${data.f_de_pensiones}",` : `f_de_pensiones: " ",`;
    const fecha_retiro = data.fecha_retiro !== '' && data.fecha_retiro !== null ? `fecha_retiro: "${moment(data.fecha_retiro).format('YYYY-MM-DD')}",` : '';
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
    const aporte_activacion = data.aporte_activacion !== '' && data.aporte_activacion !== null ? `aporte_activacion: ${data.aporte_activacion},` : `aporte_activacion: 1,`;
    const queryParams = `${id} dataHoy: "${moment().format('YYYY-MM-DD')}" id_afiliacion: ${this.data.newService}, ${cargo} ${aporte_activacion} ${email}  ${primer_nombre} ${segundo_nombre} ${fecha_ingreso} ${primer_apellido} ${segundo_apellido} ${tipo_documento} ${numero_documento} ${ciudad} ${departamento} ${direccion} ${movil} ${eps} ${f_de_pensiones} ${fecha_retiro} ${salario_base} ${arl} ${riesgo} ${caja_cf} ${sucursal}${subsidio_transporte}${periodo_de_pago} ${tipoContrato} ${tipoVinculacion} ${tipoAfiliacion}`;
    const queryProps = 'id, id_afiliacion, primer_nombre';
    this.apiService.setData(queryProps, queryParams, 'crearEmpleado').subscribe(

      (response: any) => {
        this.sending = false;

        this.dataEmpleado = response.data.crearEmpleado.id;
        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        this.uploader.setOptions({
          additionalParameter: {
            record_id: this.dataEmpleado
          },
          headers: [
            {
              name: 'authorization',
              value: `Bearer ${this.credentialsService.accessToken}`
            }
          ]
        });
        console.log(queryParams)
        this.close(data);
        // this.close(response.data.saveObs);
        // this.loadObservacion();
      },
      (error: any) => {
        this.sending = false;
        this._snackBar.open('El empleado no se creara hasta que esten los servicios guardados.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
  save() {
    if (this.solicitud.invalid) {
      return;
    }

    this.sending = true;
    const data = this.solicitud.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const afiliacion_id = this.id = this.route.snapshot.paramMap.get('id');
    const primer_nombre = data.primer_nombre !== '' && data.primer_nombre !== null ? `primer_nombre: "${data.primer_nombre}",` : `primer_nombre: " ",`;
    const segundo_nombre = data.segundo_nombre !== '' && data.segundo_nombre !== null ? `segundo_nombre: "${data.segundo_nombre}",` : `segundo_nombre: " ",`;
    const primer_apellido = data.primer_apellido !== '' && data.primer_apellido !== null ? `primer_apellido: "${data.primer_apellido}",` : `primer_apellido: " ",`;
    const fecha_ingreso = data.fecha_ingreso !== '' && data.fecha_ingreso !== null ? `fecha_ingreso: "${moment(data.fecha_ingreso).format('YYYY-MM-DD')}",` : '';
    const segundo_apellido = data.segundo_apellido !== '' && data.segundo_apellido !== null ? `segundo_apellido: "${data.segundo_apellido}",` : `segundo_apellido: " ",`;
    const tipo_documento = data.tipo_documento !== '' && data.tipo_documento !== null ? `tipo_documento: "${data.tipo_documento}",` : `tipo_documento: " ",`;
    const numero_documento = data.numero_documento !== '' && data.numero_documento !== null ? `numero_documento: "${data.numero_documento}",` : `numero_documento: " ",`;
    const ciudad = data.ciudad !== '' && data.ciudad !== null ? `ciudad: "${data.ciudad}",` : `ciudad: " ",`;
    const departamento = data.departamento !== '' && data.departamento !== null ? `departamento: "${data.departamento}",` : `departamento: " ",`;
    const direccion = data.direccion !== '' && data.direccion !== null ? `direccion: "${data.direccion}",` : `direccion: " ",`;
    const movil = data.movil !== '' && data.movil !== null ? `movil: "${data.movil}",` : `movil: " ",`;
    const eps = data.eps !== '' && data.eps !== null ? `eps: "${data.eps}",` : `eps: " ",`;
    const f_de_pensiones = data.f_de_pensiones !== '' && data.f_de_pensiones !== null ? `f_de_pensiones: "${data.f_de_pensiones}",` : `f_de_pensiones: " ",`;
    const fecha_retiro = data.fecha_retiro !== '' && data.fecha_retiro !== null ? `fecha_retiro: "${moment(data.fecha_retiro).format('YYYY-MM-DD')}",` : '';
    const salario_base = data.salario_base !== '' && data.salario_base !== null ? `salario_base: ${data.salario_base},` : `salario_base: 0,`;
    const arl = data.arl !== '' && data.arl !== null ? `arl: "${data.arl}",` : `arl: " ",`;
    const riesgo = data.riesgo !== '' && data.riesgo !== null ? `riesgo: "${data.riesgo}",` : `riesgo: " ",`;
    const caja_cf = data.caja_cf !== '' && data.caja_cf !== null ? `caja_cf: "${data.caja_cf}",` : `caja_cf: " ",`;
    const sucursal = data.sucursal !== '' && data.sucursal !== null ? `sucursal: "${data.sucursal}",` : `sucursal: " ",`;
    const subsidio_transporte = data.subsidio_transporte !== '' && data.subsidio_transporte !== null ? `subsidio_transporte: "${data.subsidio_transporte}",` : `subsidio_transporte: " ",`;
    const periodo_de_pago = data.periodo_de_pago !== '' && data.periodo_de_pago !== null ? `periodo_de_pago: "${data.periodo_de_pago}",` : `periodo_de_pago: " ",`;
    const tipoContrato = data.tipoContrato !== '' && data.tipoContrato !== null ? `tipoContrato: ${data.tipoContrato},` :'';
    const tipoVinculacion = data.tipoVinculacion !== '' && data.tipoVinculacion !== null ? `tipoVinculacion: ${data.tipoVinculacion},` : '';
    const tipoAfiliacion = data.tipoAfiliacion !== '' && data.tipoAfiliacion !== null ? `tipoAfiliacion: ${data.tipoAfiliacion},` : '';
    const email = data.email !== '' && data.email !== null ? `email: "${data.email}",` : `email: " ",`;
    const cargo = data.cargo !== '' && data.cargo !== null ? `cargo: "${data.cargo}",` : `cargo: " ",`;
    const aporte_activacion = data.aporte_activacion !== '' && data.aporte_activacion !== null ? `aporte_activacion: ${data.aporte_activacion},` : `aporte_activacion: 2,`;
    const queryParams = `${id}  id_afiliacion: ${this.data.afiliacion}, ${cargo} ${aporte_activacion} ${email}  ${primer_nombre} ${segundo_nombre} ${fecha_ingreso} ${primer_apellido} ${segundo_apellido} ${tipo_documento} ${numero_documento} ${ciudad} ${departamento} ${direccion} ${movil} ${eps} ${f_de_pensiones} ${fecha_retiro} ${salario_base} ${arl} ${riesgo} ${caja_cf} ${sucursal}${subsidio_transporte}${periodo_de_pago} ${tipoContrato} ${tipoVinculacion} ${tipoAfiliacion}`;
    const queryProps = 'id, id_afiliacion, primer_nombre';
    this.apiService.setData(queryProps, queryParams, 'crearEmpleado').subscribe(
   
      (response: any) => {
        this.sending = false;

        this.dataEmpleado = response.data.crearEmpleado.id;
        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        this.uploader.setOptions({
          additionalParameter: {
            record_id: this.dataEmpleado
          },
          headers: [
            {
              name: 'authorization',
              value: `Bearer ${this.credentialsService.accessToken}`
            }
          ]
        });
        console.log(queryParams)
        this.close(data);
        // this.close(response.data.saveObs);
        // this.loadObservacion();
      },
      (error: any) => {
        this.sending = false;
        this._snackBar.open('El empleado no se creara hasta que esten los servicios guardados.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
  openMultimediaModal(multimedia: any) {
    const dialogRef = this.dialog.open(MultimediaModalComponent, {
      width: '480px',
      height: '504px',
      maxHeight: '800px',
      data: {
        multimedia: multimedia
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) { return; }

      // this.getRecordMultimedia(this.currentRecord.identification);
    });
  }

  openCargoModal() {
    const dialogRef = this.dialog.open(CrearCargoModalComponent, {
      width: '480px',
      height: '280px',
      maxHeight: '800px',
      data: {
        empresa_id: this.dataAfiliacion
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) { return; }

      // this.getRecordMultimedia(this.currentRecord.identification);
    });
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

          // this.getRecordMultimedia(this.currentRecord.identification);

          this._snackBar.open('Eliminado', null, {
            duration: 4000
          });
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
    if (this.solicitud.invalid) {
      return;
    }
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
    const salario_base = data.salario_base !== '' && data.salario_base !== null ? `salario_base: "${data.salario_base}",` : `salario_base: " ",`;
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
    const queryParams = ` id: ${this.data.afiliacion.id}, ${cargo} ${email}  ${primer_nombre} ${segundo_nombre} ${fecha_ingreso} ${primer_apellido} ${segundo_apellido} ${tipo_documento} ${numero_documento} ${ciudad} ${departamento} ${direccion} ${movil} ${eps} ${f_de_pensiones} ${fecha_retiro} ${salario_base} ${arl} ${riesgo} ${caja_cf} ${sucursal}${subsidio_transporte}${periodo_de_pago} ${tipoContrato} ${tipoVinculacion} ${tipoAfiliacion}`;
    const queryProps = 'id, primer_nombre';
    this.apiService.setData(queryProps, queryParams, 'crearEmpleado').subscribe(
   
      (response: any) => {
        this.sending = false;

        this._snackBar.open('El empleado no se creara hasta que esten los servicios guardados.', null, {
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
