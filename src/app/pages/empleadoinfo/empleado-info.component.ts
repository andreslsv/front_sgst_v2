import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subject, of, ReplaySubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { map, debounceTime, distinctUntilChanged, flatMap, delay, switchMap, filter, tap, takeUntil } from 'rxjs/operators';
import moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { empleado } from 'app/models/empleado';

import { FileUploader } from 'ng2-file-upload';

import { CredentialsService } from 'app/core/credentials.service';
import { environment } from 'environments/environment';
import { ApiService } from 'app/core/api/api.service';
import { RecordsService } from '../records.service';
import { AuthService } from 'app/core/auth/auth.service';
import { InfoBeneficiarioModalComponent } from 'app/modals/infoBeneficiarioModal/info-beneficiario-modal.component';
import { CargarDocumentosComponent } from 'app/modals/cargarDocumentos/cargarDocumentos.component';
import { FileManagerService } from '../file-manager/file-manager.service';
import { Item, Items } from '../file-manager/file-manager.types';
import { MultimediaModalComponent } from 'app/modals/multimediaModal/multimedia-modal.component';
export interface Int {
  concepto: string;
  entidad: string;
  tarifa: string;
  cotizacion: string;
}

export interface Info {
  titulo: string;
  item: string;
}

const ELEMENT_DATA: Int[] = [
  {concepto: "EPS", entidad: 'NUEVA EPS', tarifa: '4%', cotizacion: '35000'},
  {concepto: "ARL", entidad: 'SURA', tarifa: '4%', cotizacion: '8000'},
  {concepto: "PENSIONES", entidad: 'COLPENSIONES', tarifa: '6%', cotizacion: '30000'}
];

const tabla_icon: Info[] = [
  {titulo: 'RIESGO', item: '2'},
  {titulo: 'CARGO', item: 'AUXILIAR ADMINISTRATIVO'},
  { titulo: 'SUCURSAL', item: 'PRINCIPAL'},
  { titulo: 'TIPO DE CONTRATO', item: 'TIEMPO COMPLETO'},
  { titulo: 'FECHA DE INICIO', item: '20 MAY 2018'},
  { titulo: 'FECHA DE TERMINACIÓN', item: '-'},
  { titulo: 'PERIODO DE PAGO', item: 'MENSUAL'},
  { titulo: 'SUBSIDIO DE TRANSPORTE', item: 'SI'}
];



@Component({
  selector: 'vex-empleado-info',
  templateUrl: './empleado-info.component.html',
  styleUrls: ['./empleado-info.component.scss']
})
export class EmpleadoInfoComponent implements OnInit {
  displayedColumnsDocuments: string[] = ['nombre_documento', 'fecha_guardado',  'acciones'];
  displayedColumnsDocuments2: string[] = ['nombre_documento', 'descripcion', 'fecha_guardado', 'acciones'];
  displayedColumns: string[] = ['concepto', 'entidad', 'tarifa', 'cotizacion'];
  beneficiarios_displayedColumns: string[] = ['nombre_beneficiario', 'tipo', 'acciones'];
  dataSource1 = ELEMENT_DATA;
  uploadForm: FormGroup;
  displayedColumns2: string[] = ['titulo', 'item'];
  dataSource2 = tabla_icon;
  totalNomina: number;
  totalOtros: number;
  empleados: number;
  totalNominaSS: any;
  horasExtrasTotal: any;
  DeduccionesTotal: any;
  totalPlanilla: any;
  totalDiasValor: any;
  dataNominaDetalle: any[] = [];

  protected _onDestroy = new Subject<void>();

  public searchingProcedures = false;
  public searchingPension = false;
  public searchingEps = false;
  public searchingCiudad = false;
  public filtereddataProcedure: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filtereddataPension: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filtereddataEps: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filtereddataCiudades: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  loadingRecords = false;
  dataCaja: any[] = [];
  dataPension: any[] = [];
  dataEps: any[] = [];
  dataSucursal: any[] = [];
  loading: boolean;
  imagen: any[] = [];
  imagenContrato: any[] = [];

  id = '';
  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 50, 100];
  orderBy = 'created_at';
  order = 'desc';
  limit = 10;
  offset = 0;
  total: number;
  dataSource: MatTableDataSource<empleado> | null;
  data: empleado[] = [];

  public uploader: FileUploader = new FileUploader({
    isHTML5: true,
    url: `${environment.serverUrl}/v1/actions/recordMultimediaEmpleado`
  });

  empleado = new FormGroup({
    razon_social: new FormControl('', []),
    contacto: new FormControl('', []),
    telefono: new FormControl('', []),
    email: new FormControl('', []),
    color_asignado: new FormControl('', [])
  });

  // displayedColumns: string[] = ['nombre', 'n_doc', 'tel', 'empresa', 'cargo', 'salario', 'estado', 'acciones'];
  public keyUp = new Subject<any>();
  filters = new FormGroup({
    search: new FormControl('', []),
    date: new FormControl('', [])
  });
  @ViewChild('search', { static: false }) searchEl: ElementRef;
  total1: number;

  currentRecord: any = null;


  totalEps: any;
  totalVacaciones: any;
  totalDeducciones: any;
  totalDias: any;
  totalIbc: any;
  totalCesantias: any;
  totalIntereses: any;
  meses: any;
  totalServicio: any;
  detalleServicio: any[] = [];
  dataEmpleado: any;
  sending: boolean;
  dataIncapacidad: any[] = [];
  loadingPropect: boolean;
  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private recordsService: RecordsService,
    private fb: FormBuilder,
    private credentialsService: AuthService,
    private _snackBar: MatSnackBar,
    private _fileManagerService: FileManagerService,
    private _changeDetectorRef: ChangeDetectorRef,
    // private _location: Location,
    // private coreService: CoreService,
  ) {
    const codeSearchSubscription = this.keyUp
      .pipe(
        map((event: any) => event.target.salario_base),
        debounceTime(300),
        distinctUntilChanged(),
        flatMap(search => of(search).pipe(delay(300)))
      )
      .subscribe(result => {
        this.filters.controls.search.setValue(this.searchEl.nativeElement.value);

      });
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  eliminar() {
    return 1
    // this.coreService.currentUser.roles.eliminar
  }
  modificar() {
    return 1
    // this.coreService.currentUser.roles.modificar
  }
  backClicked() {
    // this._location.back();
  }
  setRecordFromCache() {
    let currentRecord = this.recordsService.getCurrentEmpleadoFromCache();

    this.setCurrentRecord(currentRecord);
  }
  
  setCurrentRecord(empleado: any) {
    this.currentRecord = empleado;
    console.log('dato empleado', empleado)
    this.solicitud.setValue({
      // id: empleado.id ? empleado.id : null,
      // patient: empleado.app_user_id ? empleado.app_user_id : null,
      fecha_ingreso: empleado.fecha_ingreso ? empleado.fecha_ingreso : null,
      fecha_retiro: empleado.fecha_retiro ? empleado.fecha_retiro : null,
      // value: empleado.value ? parseInt(empleado.value, 10) : null,
      primer_nombre: empleado.primer_nombre ? empleado.primer_nombre : null,
      segundo_nombre: empleado.segundo_nombre ? empleado.segundo_nombre : null,
      primer_apellido: empleado.primer_apellido ? empleado.primer_apellido : null,
      segundo_apellido: empleado.segundo_apellido ? empleado.segundo_apellido : null,
      tipo_documento: empleado.tipo_documento ? empleado.tipo_documento.toString() : null,
      numero_documento: empleado.numero_documento ? empleado.numero_documento : null,
      ciudad: empleado.ciudad ? empleado.ciudad.toString() : null,
      departamento: empleado.departamento ? empleado.departamento.toString() : null,
      direccion: empleado.direccion ? empleado.direccion : null,
      movil: empleado.movil ? empleado.movil : null,
      eps: empleado.eps ? empleado.eps.toString() : null,
      arl: empleado.arl ? empleado.arl.toString() : null,
      f_de_pensiones: empleado.f_de_pensiones ? empleado.f_de_pensiones.toString() : null,
      caja_cf: empleado.caja_cf ? empleado.caja_cf : null,
      tipoContrato: empleado.tipoContrato ? empleado.tipoContrato.toString() : null,
      salario_base: empleado.salario_base ? empleado.salario_base : null,
      cargo: empleado.cargo ? empleado.cargo : null,
      riesgo: empleado.riesgo ? empleado.riesgo.toString() : null,
      sucursal: empleado.sucursal ? empleado.sucursal.toString() : null,
      subsidio_transporte: empleado.subsidio_transporte ? empleado.subsidio_transporte : null,
      periodo_de_pago: empleado.periodo_de_pago ? empleado.periodo_de_pago.toString() : null,
      tipoAfiliacion: empleado.tipoAfiliacion ? empleado.tipoAfiliacion.toString() : null,
      tipoVinculacion: empleado.tipoVinculacion ? empleado.tipoVinculacion.toString() : null,
      email: empleado.email ? empleado.email : null,
      aporte_activacion: null,
      // status: empleado.status ? empleado.status.toString() : null,
    });
  }
  openDetalleEmpleadoModal(afiliacion: any = null) {
    // const dialogRef = this.dialog.open(EditarEmpleadoComponent, {
    //   width: '1000px',
    //   height: 'auto',
    //   maxHeight: '850px',
    //   
    //   data: {
    //     afiliacion
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (!result) return;
    //   this.loadEmpleadoPaginator(afiliacion);

    // });
  }
  openStatusEmpleadoModal(incapacidad: any = null) {
    // const dialogRef = this.dialog.open(statusEmpleadocomponent, {
    //   width: '600px',
    //   height: '300px',
    //   maxHeight: '850px',
    //   
    //   data: {
    //     incapacidad
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (!result) return;
    //   this.loadIncapacidad();

    // });
  }
  openBeneficiario(empleado: any) {
    const dialogRef = this.dialog.open(InfoBeneficiarioModalComponent, {
      width: '670px',
      height: '600px',
      maxHeight: '850px',
      
      data: {
        empleado: empleado
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadSucursal();
      this.loadBeneficiado();
    });
  }
  openBeneficiario2(empleado: any) {
    const dialogRef = this.dialog.open(InfoBeneficiarioModalComponent, {
      width: '800px',
      height: '600px',
      maxHeight: '850px',
      
      data: {
        empleado: empleado,
        documento: 1
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadSucursal();
      this.loadBeneficiado();
    });
  }
  delete(data: any) {
    var r = confirm('¿Seguro que desea eliminar al beneficiario?');
    if (r === true) {
      this.loading = true;

      const id = data ? `id: ${data.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id';

      this.apiService.setData(queryProps, queryParams, 'crearBeneficiado').subscribe(
        (response: any) => {
          this.loading = false;

          this._snackBar.open('Eliminado', null, {
            duration: 4000
          });

          this.loadBeneficiado();
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
  beneficiado: any[] = [];
  loadBeneficiado() {
    this.loadingPropect = true;
    const date =
      this.filters.value.date !== '' && this.filters.value.date !== null
        ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
        : '';
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `empleado_id: ${this.id = this.route.snapshot.paramMap.get('id')},  ${searchText} ${date}`;
    const queryProps =
      'id, nombre, tipo,nacimiento,tipo_documento, documento';
    this.apiService.getData(queryProps, queryParams, 'beneficiado').subscribe(
      (response: any) => {
        this.beneficiado = response.data.beneficiado;

        this.loadingPropect = false;
        console.log('estos son los datos para la afiliacion ', this.data)

      },
      error => {
        this.loadingPropect = false;
        this._snackBar.open('Error.', null, {
          duration: 4000
        });
        console.log(error);
      }
    );
  }
  openPresupuesto() {
    // const win = window.open(`http://localhost:8000/liquidacion/${this.id = element.afiliacion_id}/${element.t_valorSS}/${element.nombre_periodo}`, '_blank');
    const win = window.open(`http://api.soyasesorias.co/liquidacion/${this.id = this.route.snapshot.paramMap.get('id')}`, '_blank');
    win.focus();
  }
  goBack() {
    // this._location.back();
  }
  Finalizar(){
    const r = confirm('¿ESTAS SEGURO QUE DESEAS LIQUIDAR AL EMPLEADO?');
    if (r === true) {
    this.openPresupuesto()
    this.save()
    }
  }
  save() {
   
    // // const aporte_activacion = data.aporte_activacion !== '' && data.aporte_activacion !== null ? `aporte_activacion: ${data.aporte_activacion},` : `aporte_activacion:  ${this.dataAfiliacion.aporte_activacion},`;
    //   const queryParams = `id:${this.id = this.route.snapshot.paramMap.get('id')}, liquidar:${1}, status: ${2}`;
    // const queryProps = 'id';

    // this.apiService.crearEmpleado(queryParams, queryProps).subscribe(
    //   (response: any) => {
    //     this.sending = false;

    //     this._snackBar.open('Guardado', null, {
    //       duration: 4000
    //     });
    //     console.log(queryParams)
        
    //     // this.close(response.data.saveObs);
       
    //     this.goBack()
    //   },
    //   (error: any) => {
    //     this.sending = false;
    //     this._snackBar.open('Error.', null, {
    //       duration: 4000
    //     });

    //     console.log(error);
    //   }
    // );
    
  }
  loadEmpleadoPaginator() {
    this.loadingRecords = true;
    const queryParams = `id: ${this.id = this.route.snapshot.paramMap.get('id')}, `;

    const queryProps =
      ' id, empresa{id, razon_social }, nominaDetalle{id, ingreso_noc, totalNomina,cesantias, intereses, vacaciones, indemnizacion, dias_valor, totalPlanilla, nomina_id, empresa_id, empleado_id, ss, ibc, salud, pension, arl, ccf, sena, icdf, dias_laborados, otros_ingresos, horas_extras, deducciones,  riesgo}, id_afiliacion, status, email, cargo, tipoContrato, tipoVinculacion, aporte_activacion, tipoAfiliacion, primer_nombre, segundo_nombre, primer_apellido, fecha_ingreso, segundo_apellido, tipo_documento, numero_documento, ciudad, departamento, direccion, movil, eps, f_de_pensiones, fecha_retiro, salario_base, arl, riesgo, caja_cf, sucursal, subsidio_transporte, periodo_de_pago ';

    const nombreQuery = 'empleado'

    this.apiService.getData(queryProps, queryParams, nombreQuery).subscribe(
      (response: any) => {
        this.data = response.data.empleado;
        this.dataEmpleado = response.data.empleado;
        this.loadingRecords = false;
        if (response.data.empleado && response.data.empleado.length > 0) {
          this.setCurrentRecord(response.data.empleado[0]);
        }
        // this.detalleServicio = response.data.dataEmpleado;
        // this.totalServicio = this.detalleServicio.reduce((
        //   acc,
        //   obj,
        // ) => acc + (obj.salario_base), 0
        // );
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
 
  loadDetalleNomina() {

    this.loadingRecords = true;
    const queryParams = `empleado_id: ${this.id = this.route.snapshot.paramMap.get('id')}, status: ${1}`;
    const queryProps =
      'id, totalNomina, dias_valor,  cesantias, intereses, vacaciones, indemnizacion, totalPlanilla, empleadoNomina{id, aporte_activacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, salario_base}, nomina_id, empresa_id, empleado_id, ss, ibc, salud, pension, arl, ccf, sena, icdf, dias_laborados, otros_ingresos, horas_extras, deducciones,  riesgo ';
    this.apiService.getData(queryProps, queryParams, 'getDetalleNomina').subscribe(
      (response: any) => {

        this.dataNominaDetalle = response.data.getDetalleNomina;
        this.meses = response.data.getDetalleNomina.length;
        console.log('total meses', this.meses)
        this.loadingRecords = false;
        this.totalEps = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.salud++), 0
        );
        this.totalVacaciones = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.vacaciones++), 0
        );
        this.totalDeducciones = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.deducciones++), 0
        );
        this.totalNomina = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.totalNomina > 0 ? obj.totalNomina++ : 0), 0
        );
        this.totalNominaSS = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.totalNomina < 0 ? obj.totalNomina++ : 0), 0
        );
        this.totalOtros = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.otros_ingresos++), 0
        );
        this.horasExtrasTotal = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.horas_extras++), 0
        );
        this.DeduccionesTotal = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.deducciones++), 0
        );
        this.totalPlanilla = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.totalPlanilla++), 0
        );
        this.totalDiasValor = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.dias_valor++), 0
        );
        this.totalDias = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.dias_laborados++), 0
        );
        this.totalIbc = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.ibc++), 0
        );
        this.totalCesantias = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.cesantias++), 0
        );
        this.totalIntereses = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.intereses++), 0
        );
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
  getRecordMultimedia() {
    this.loadingRecords = true;
    const queryParams = `empleado_id: ${this.id = this.route.snapshot.paramMap.get('id')}, servicio_id: 100`;
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

          this.getRecordMultimedia();

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
    salario_base: new FormControl('', [Validators.min(1000000)]),
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
  imagenSS: any[] = []
  procFilterCtrl: FormControl = new FormControl();
  pensionFilterCtrl: FormControl = new FormControl();
  EpsFilterCtrl: FormControl = new FormControl();
  CiudadesFilterCtrl: FormControl = new FormControl();

  getErrorMessage() {
    return this.solicitud.controls.salario_base.hasError('required')
      ? 'El salario es requerido'
      : this.solicitud.controls.salario_base.hasError('min')
        ? 'El valor debe ser igual o mayor al salario minimo (908526)'
        : '';
  }
  getErrorTransporte() {
    return this.solicitud.controls.subsidio_transporte.hasError('required')
      ? 'El subsidio es requerido'
      : this.solicitud.controls.subsidio_transporte.hasError('min')
        ? 'El valor debe ser igual o mayor(106454)'
        : '';
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
    const aporte_activacion = data.aporte_activacion !== '' && data.aporte_activacion !== null ? `aporte_activacion: ${data.aporte_activacion},` : `aporte_activacion:  ${1},`;
    const queryParams = ` id: ${this.id = this.route.snapshot.paramMap.get('id')}, ${aporte_activacion} ${cargo} ${email}  ${primer_nombre} ${segundo_nombre} ${fecha_ingreso} ${primer_apellido} ${segundo_apellido} ${tipo_documento} ${numero_documento} ${ciudad} ${departamento} ${direccion} ${movil} ${eps} ${f_de_pensiones} ${fecha_retiro} ${salario_base} ${arl} ${riesgo} ${caja_cf} ${sucursal}${subsidio_transporte}${periodo_de_pago} ${tipoContrato} ${tipoVinculacion} ${tipoAfiliacion}`;
    const queryProps = 'id, primer_nombre';
    this.apiService.setData(queryProps, queryParams, 'crearEmpleado').subscribe(
    // this.apiService.crearEmpleado(queryParams, queryProps).subscribe(
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        console.log(queryParams)
        this.loadEmpleadoPaginator();
        // this.close(data);
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
  loadSucursal() {
    console.log('loading records... ', this.dataSucursal);

    this.loadingRecords = true;

    const queryParams = `afiliacion_id: ${1}  `;
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
  loadIncapacidad() {
    console.log('loading records...');

    this.loadingRecords = true;
    // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `empleado_id: ${this.id = this.route.snapshot.paramMap.get('id')} `;
    const queryProps =
      'id, empleado_id, servicio_id, origen, tipo, dias, dias_acumulado, inicio, fin, status, created_at, updated_at';

    this.apiService.getData(queryProps, queryParams, 'getIncapacidad').subscribe(
      (response: any) => {

        this.dataIncapacidad = response.data.getIncapacidad;

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
  openMultimediaModal(empleado: any) {
    const dialogRef = this.dialog.open(MultimediaModalComponent, {
      width: '400px',
      height: '350px',
      maxHeight: '800px',
      
      data: {
        empleado: empleado
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) { return; }

      this.getRecordMultimedia();
      this.getRecordMultimediaContrato;
      this.getRecordMultimediaSS();
    });
  }
  openDocumentosModal(nombre: any) {
    const dialogRef = this.dialog.open(CargarDocumentosComponent, {
      width: '650px',
      height: 'auto',
      maxHeight: '800px',
      
      data: {
        general: this.id = this.route.snapshot.paramMap.get('id'),
        nombre: nombre
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let match = this.imagenContrato.filter((value) => {
          return value.id == result.id;
        });

        console.log(match);
        console.log(result);
        console.log(this.imagenContrato);
      }

      this.getRecordMultimedia();
    });
  }
  openDocumentosModalContrato() {
    const dialogRef = this.dialog.open(CargarDocumentosComponent, {
      width: '650px',
      height: 'auto',
      maxHeight: '800px',
      
      data: {
        contrato: this.id = this.route.snapshot.paramMap.get('id')
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let match = this.imagenContrato.filter((value) => {
          return value.id == result.id;
        });

        console.log(match);
        console.log(result);
        console.log(this.imagenContrato);
      }

      this.getRecordMultimediaContrato();
    });
  }
  openDocumentosModalSS() {
    const dialogRef = this.dialog.open(CargarDocumentosComponent, {
      width: '650px',
      height: 'auto',
      maxHeight: '800px',
      
      data: {
        ss: this.id = this.route.snapshot.paramMap.get('id')
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let match = this.imagenSS.filter((value) => {
          return value.id == result.id;
        });

        console.log(match);
        console.log(result);
        console.log(this.imagenSS);
      }
      this.getRecordMultimediaSS();
      
    });
  }
  getRecordMultimediaContrato() {
    this.loadingRecords = true;
    const queryParams = `empleado_id: ${this.id = this.route.snapshot.paramMap.get('id')} servicio_id: 5`;
    const queryProps =
      'id,name,description,url,type,status,created_at';
    this.apiService.getData(queryProps, queryParams, 'multimedias').subscribe(
    
      (result: any) => {
        this.loadingRecords = false;
        this.imagenContrato = result.data.multimedias;
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
  getRecordMultimediaSS() {
    this.loadingRecords = true;
    const queryParams = `empleado_id: ${this.id = this.route.snapshot.paramMap.get('id')} servicio_id: 1`;
    const queryProps =
      'id,name,description,url,type,status,created_at';
    this.apiService.getData(queryProps, queryParams, 'multimedias').subscribe(
    
      (result: any) => {
        this.loadingRecords = false;
        this.imagenSS = result.data.multimedias;
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
  selectedItem: Item;
  items: Items;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  ngOnInit(): void {

    let record$ = this.route.paramMap.pipe(switchMap((params: ParamMap) => of(params.get('id'))));
    record$.subscribe(recordId => {
      this.loadEmpleadoPaginator();
     
      this.uploader.setOptions({
        additionalParameter: {
          record_id: recordId,
          servicio_id:0
        },
        headers: [
          {
            name: 'authorization',
            value: `Bearer ${this.credentialsService.accessToken}`
          }
        ]
      });

    });
    this.uploadForm = this.fb.group({
      document: [null, [Validators.required]],
    });

    this._fileManagerService.items$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((items: Items) => {
        this.items = items;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

    this.procFilterCtrl.valueChanges.pipe(
      // filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 3),
      tap(() => this.searchingProcedures = true),
      takeUntil(this._onDestroy),
      debounceTime(500),
      distinctUntilChanged(),
      // switchMap(term => this.apiService.getCajaCF(`search: "${term}"`, 'id,codigo,nombre'))
    ).subscribe((results: any) => {
      console.log(results);
      this.searchingProcedures = false;
      this.filtereddataProcedure.next(results.data.cajaCompensacion);
    }, error => {
      this.searchingProcedures = false;
    });
    this.pensionFilterCtrl.valueChanges.pipe(
      // filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 2),
      tap(() => this.searchingPension = true),
      takeUntil(this._onDestroy),
      debounceTime(500),
      distinctUntilChanged(),
      // switchMap(term => this.apiService.getPensiones(`search: "${term}"`, 'id,codigo,nombre'))
    ).subscribe((results: any) => {
      console.log(results);
      this.searchingPension = false;
      this.filtereddataPension.next(results.data.pensiones);
    }, error => {
      this.searchingPension = false;
    });
    this.EpsFilterCtrl.valueChanges.pipe(
      // filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 2),
      tap(() => this.searchingEps = true),
      takeUntil(this._onDestroy),
      debounceTime(500),
      distinctUntilChanged(),
      // switchMap(term => this.apiService.getEps(`search: "${term}"`, 'id,codigo,nombre'))
    ).subscribe((results: any) => {
      console.log(results);
      this.searchingEps = false;
      this.filtereddataEps.next(results.data.eps);
    }, error => {
      this.searchingEps = false;
    });

    this.CiudadesFilterCtrl.valueChanges.pipe(
      // filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 2),
      tap(() => this.searchingCiudad = true),
      takeUntil(this._onDestroy),
      debounceTime(500),
      distinctUntilChanged(),
      // switchMap(term => this.apiService.getCiudad(`search: "${term}"`, 'id, nombre'))
    ).subscribe((results: any) => {
      console.log(results);
      this.searchingCiudad = false;
      this.filtereddataCiudades.next(results.data.ciudad);
    }, error => {
      this.searchingCiudad = false;
    });
    this.loadCaja();
    this.loadPension();
    this.loadEps();
    this.loadSucursal()
    this.loadBeneficiado();
    this.loadIncapacidad();
    this.getRecordMultimedia();
    this.getRecordMultimediaContrato();
    this.getRecordMultimediaSS();
    this.loadDetalleNomina()
    this.setRecordFromCache();
    this.id = this.route.snapshot.paramMap.get('id');
    
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (file) => { this.getRecordMultimedia() };

  }


}
