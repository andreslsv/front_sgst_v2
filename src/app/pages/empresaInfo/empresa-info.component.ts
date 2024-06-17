import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { map, debounceTime, distinctUntilChanged, flatMap, delay, switchMap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';

import moment from 'moment';

import { Location } from '@angular/common';
import { environment } from 'environments/environment';
import { empleado } from 'app/models/empleado';
import { ApiService } from 'app/core/api/api.service';
import { UserService } from 'app/core/user/user.service';
import { RecordsService } from '../records.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgregarSucursalModalComponent } from 'app/modals/agregarsucursalModal/agregar-sucursal-modal.component';
import { CargarIconoComponent } from 'app/modals/cargarIcono/cargarIcono.component';
import { SuccessModalComponent } from 'app/modals/successModal/success-modal.component';
import { user } from 'app/models/user.model';

@Component({
  selector: 'empresa-info',
  templateUrl: './empresa-info.component.html',
  styleUrls: ['./empresa-info.component.scss']
})
export class EmpresaInfoComponent implements OnInit {
  // public uploader: FileUploader = new FileUploader({
  //   isHTML5: true,
  //   // url: 'http://localhost:8000/v1/actions/recordMultimedia'
  //   url: `${environment.serverUrl}/v1/actions/recordMultimedia`

  // });
  displayedColumns: string[] = ['nombre', 'direccion', 'ciudad', 'email', 'fecha'];
  displayedColumns1: string[] = ['nombre_empleado', 'paquete', 'documento_empleado', 'afiliacion', 'contrato', 'total' ,'status'];
  displayedColumns4: string[] = ['nombre', 'direccion', 'ciudad', 'email', 'periodo', 'fecha'];
  displayedColumnsDocuments: string[] = ['nombre_documento', 'fecha_guardado', 'imagen', 'descripcion', 'acciones'];
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  threeFormGroup: FormGroup;

  displayedColumns2: string[] = ['nombre',
   'documento',
   'tipo_contrato', 
   'salario', 
   'f_ingreso', 
    'tel_contacto', 
    'estado', 
    'acciones'];


  displayedColumns3: string[] = ['periodo', 'num_pago', 'f_pago', 'empleados', 'aportes', 'valor_total', 'estado', 'acciones'];

  alertIsVisible = true;

  loadingRecords: boolean;
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

  public keyUp = new Subject<any>();

  dataEmpresa: any[] = [];
  filters = new FormGroup({
    search: new FormControl('', []),
    date: new FormControl('', [])
  });
  currentRecord: any = null;
  @ViewChild('search', { static: false }) searchEl: ElementRef;
  total1 = 0;
  dataNomina: any [] = [];
  resultsLengthNomina: any;
  resultsLengthTotal= 0;
  totalServicio: number;
  dataCiudad: any [] =[];
  dataDepartamento: any[] =[];
  departamento_seleccionado: any;
  showOnlyName = false;
  dataSucursal: any[] = [];
  dataCaja: any[] = [];
  sending: boolean;
  totalAfiliados: any;
  datos: any;
  imagen: any[] = [];
  total2 = 0;
  
  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private recordsService: RecordsService,
    private fb: FormBuilder,
    private _userService: UserService,
    // private credentialsService: CredentialsService,
    // private coreService: CoreService
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
  // eliminar() {
  //   return this.coreService.currentUser.roles.eliminar
  // }
  // modificar() {
  //   return this.coreService.currentUser.roles.modificar
  // }
  backClicked() {
    // this._location.back();
  }
  save() {
    this.sending = true;
    const data = this.solicitud.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const afiliacion_id = this.id = this.route.snapshot.paramMap.get('id');
    const primer_nombre = data.primer_nombre !== '' && data.primer_nombre !== null ? `primer_nombre: "${data.primer_nombre}",` : `primer_nombre: ".",`;
    const razon_social = data.razon_social !== '' && data.razon_social !== null ? `razon_social: "${data.razon_social}",` : `razon_social: ".",`;
    const direccion = data.direccion !== '' && data.direccion !== null ? `direccion: "${data.direccion}",` : `direccion: ".",`;
    const email = data.email !== '' && data.email !== null ? `email: "${data.email}",` : `email: ".",`;
    const departamento = data.departamento !== '' && data.departamento !== null ? `departamento: "${data.departamento}",` : `departamento: ".",`;
    const ciudad = data.ciudad !== '' && data.ciudad !== null ? `ciudad: "${data.ciudad}",` : `ciudad: ".",`;
    const numDocumento = data.numDocumento !== '' && data.numDocumento !== null ? `numDocumento: "${data.numDocumento}",` : `numDocumento: ".",`;
    const dv = data.dv !== '' && data.dv !== null ? `dv: "${data.dv}",` : `dv: ".",`;
    const telEmpresaMovil = data.telEmpresaMovil !== '' && data.telEmpresaMovil !== null ? `telEmpresaMovil: "${data.telEmpresaMovil}",` : `telEmpresaMovil: ".",`;
    const telEmpresaFijo = data.telEmpresaFijo !== '' && data.telEmpresaFijo !== null ? `telEmpresaFijo: "${data.telEmpresaFijo}",` : `telEmpresaFijo: ".",`;
    const representanteLegal = data.representanteLegal !== '' && data.representanteLegal !== null ? `representanteLegal: "${data.representanteLegal}",` : `representanteLegal: ".",`;
    const contacto = data.contacto !== '' && data.contacto !== null ? `contacto: "${data.contacto}",` : `contacto: ".",`;
    const email_responsable = data.email_responsable !== '' && data.email_responsable !== null ? `email_responsable: "${data.email_responsable}",` : `email_responsable: ".",`;
    const email_contacto = data.email_contacto !== '' && data.email_contacto !== null ? `email_contacto: "${data.email_contacto}",` : `email_contacto: ".",`;
    const telefono_responsable = data.telefono_responsable !== '' && data.telefono_responsable !== null ? `telefono_responsable: "${data.telefono_responsable}",` : `telefono_responsable: ".",`;
    const telContacto = data.telContacto !== '' && data.telContacto !== null ? `telContacto: "${data.telContacto}",` : `telContacto: ".",`;
    const arl = data.arl !== '' && data.arl !== null ? `arl: "${data.arl}",` : `arl: ".",`;
    const riesgo = data.riesgo !== '' && data.riesgo !== null ? `riesgo: "${data.riesgo}",` : `riesgo: ".",`;
    const caja_cf = data.caja_cf !== '' && data.caja_cf !== null ? `caja_cf: "${data.caja_cf}",` : `caja_cf: ".",`;
    const periodo = data.periodo !== '' && data.periodo !== null ? `periodo: ${data.periodo},` : `periodo: 1,`;
    const tipoEmpresa = data.tipoEmpresa !== '' && data.tipoEmpresa !== null ? `tipoEmpresa: ${data.tipoEmpresa},` : `tipoEmpresa: 1,`;
    const obs = data.obs !== '' && data.obs !== null ? `obs: "${data.obs}",` : `obs: ".",`;
    const categoria = data.categoria !== '' && data.categoria !== null ? `categoria: ${data.categoria},` : `categoria: 1,`;
    
    const queryParams = `${id} afiliacion_id: ${this._userService.currentUser.empresa.afiliacion_id} ${periodo} ${tipoEmpresa}  ${razon_social}  ${primer_nombre} ${direccion} ${email} ${departamento} ${ciudad} ${numDocumento} ${dv} ${telEmpresaMovil} ${telEmpresaFijo} ${representanteLegal} ${contacto} ${email_responsable} ${email_contacto} ${telefono_responsable} ${telContacto} ${arl} ${riesgo} ${caja_cf} ${obs} ${categoria}`;
    const queryProps = 'id, afiliacion_id, razon_social';
    this.apiService.setData(queryProps, queryParams, 'saveEmpresa').subscribe(

      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        this.loadDataEmpresa(queryParams);
        console.log(queryParams)
        this.openSuccess()
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

  /*---------------Aquí se define el color del estado-------------------*/
  solicitud = new FormGroup({
    razon_social: new FormControl('', []),
    primer_nombre: new FormControl('', []),
    direccion: new FormControl('', []),
    email: new FormControl('', []),
    categoria: new FormControl('', []),

    departamento: new FormControl('', []),
    ciudad: new FormControl('', []),
    numDocumento: new FormControl('', []),
    dv: new FormControl('', []),
    telEmpresaMovil: new FormControl('', []),
    telEmpresaFijo: new FormControl('', []),
    /*-------Segunda vista---------*/
    representanteLegal: new FormControl('', []),
    contacto: new FormControl('', []),
    email_responsable: new FormControl('', []),
    email_contacto: new FormControl('', []),
    telefono_responsable: new FormControl('', []),
    telContacto: new FormControl('', []),
    /*-------Segunda vista---------*/
    arl: new FormControl('', []),
    riesgo: new FormControl('', []),
    caja_cf: new FormControl('', []),
    tipoEmpresa: new FormControl('', []),
    periodo: new FormControl('', []),
    obs: new FormControl('', [])
  });

  openagregarSucursalModal() {
    const dialogRef = this.dialog.open(AgregarSucursalModalComponent, {
      width: '700px',
      height: '400px',
      maxHeight: '850px',
      data: {
        id: this._userService.currentUser.empresa.afiliacion_id
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadSucursal();
    });
  }
  openSuccess() {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      width: '400px',
      height: '500px',
      maxHeight: '850px',
      data: {
        // id: this._userService.currentUser.empresa.afiliacion_id
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadDataEmpresa(this.id);
    });
  }
  openEditarSucursalModal(id: any) {
    const dialogRef = this.dialog.open(AgregarSucursalModalComponent, {
      width: '700px',
      height: '400px',
      maxHeight: '850px',
      data: {
        id: id
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadSucursal();
    });
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
        // this._snackBar.open('Error.', null, {
        //   duration: 4000
        // });
        console.log(error);
      }
    );
  }
  deleteSucursal(income: any) {

    const r = confirm('¿DESEAS ELIMINAR LA SUCURSAL?');
    if (r === true) {
      this.loadingRecords = true;

      // const id = income ? `id: ${income.id},` : '';
      const queryParams = `id:${income.id}, delete: 1 `;
      const queryProps = 'id ';
      this.apiService.setData(queryProps, queryParams, 'crearSucursal').subscribe(
        (response: any) => {
          this.loadingRecords = false;

          this.loadEmpleadoPaginator();

          this.setRecordFromCache();

          this.loadDetalleServicio();

          this.loadSucursal();

          // this._snackBar.open('Eliminado', null, {
          //   duration: 4000
          // });
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
  }
  loadSucursal() {
    console.log('loading records...');

    this.loadingRecords = true;
    // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `afiliacion_id: ${this._userService.currentUser.empresa.afiliacion_id}  `;
    const queryProps =
      'id, nombre, caja_cf, departamento, ciudad';
      this.apiService.getData(queryProps, queryParams, 'sucursales').subscribe(
      (response: any) => {
      
        this.dataSucursal = response.data.sucursales;

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
  setDepartamentoSeleccionado(index) {
    this.departamento_seleccionado = index;
  }

  tipoDepartamentoSeleccionado = "Norte de Santander";
  loadDepartamento() {
    console.log('loading records...');
    this.loadingRecords = true;
    // const queryParams = ``;
    const queryProps =
      'id, nombre';
      this.apiService.getDataSimple(queryProps, 'departamento').subscribe(
      (response: any) => {
        this.dataDepartamento = response.data.departamento;
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

  loadCiudad() {
    console.log('loading records...');
    this.loadingRecords = true;
    // const queryParams = ``;
    const queryProps =
      'id, id_departamento, nombre';
    this.apiService.getDataSimple(queryProps,  'ciudad').subscribe(
      (response: any) => {
        this.dataCiudad = response.data.ciudad;
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
  getEstadoClass(estado){
    var text;

    switch (estado) {
        case "Activo":
            text = "tag_azul";
            break;

        case "Desactivado":
            text = "tag_rojo";
            break;
    }

    return text;
}

  uploadForm: FormGroup;
  ngOnInit(): void {


    const nombreQuery = 'me';
    const queryParams = `search: " " `;
    const queryProps = 'id,name,email, avatar, empresa{id, razon_social, primer_nombre, afiliacion_id}';

    this.apiService.getData(queryProps, queryParams, nombreQuery).
      subscribe((response) => {
        this._userService.setUser(new user().deserialize(response.data.me));
        // this.userData = response.data.me;
      });

    let record$ = this.route.paramMap.pipe(switchMap((params: ParamMap) => of(params.get('id'))));
    record$.subscribe(recordId => {
      this.loadDataEmpresa(recordId);
      console.log('empresa', this.dataEmpresa);
      // this.uploader.setOptions({
      //   additionalParameter: {
      //     record_id: recordId,
      //     servicio_id: 0
      //   },
      //   headers: [
      //     {
      //       name: 'authorization',
      //       value: `Bearer ${this.credentialsService.credentials.access_token}`
      //     }
      //   ]
      // });
    });
    // this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    // this.uploader.onCompleteItem = (file) => { this.getRecordMultimedia(this.id = this.route.snapshot.paramMap.get('id')) };

    this.uploadForm = this.fb.group({
      document: [null, [Validators.required]],
    });
    this.loadEmpleadoPaginator();
    // this.loadNominaPaginator();
    this.loadDetalleServicio();
    this.loadAfiliacion();
    this.detalleServicio;
    this.dataNomina;
    this.loadCaja();
    this.getRecordMultimediaSS()
    this.getRecordMultimedia(record$)
    this.loadDepartamento();
    this.loadSucursal()
  }
  // user() {
  //   return this.coreService.currentUser.role_id;
  // }
  goBack() {
    this.router.navigate(['/app/home']);
  }
  openCambiarEstadoModal(indice) {
    // const dialogRef = this.dialog.open(CambiarEstadoModalComponent, {
    //   width: '600px',
    //   height: '400px',
    //   maxHeight: '850px',
    //   panelClass: 'custom-dialog-container',
    //   data: {
    //     indice: indice
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   this.loadDataEmpresa(result);
    //   this.loadAfiliacion();
    //   // this.datosPersonales();

    //   console.log('esto es para mostrar datos', this.dataSource)
    //   this.dataSource = new MatTableDataSource();
    // });
  }
  setRecordFromCache() {
    let currentRecord = this.recordsService.getCurrentRecordFromCache();

    this.setCurrentRecord(currentRecord);
  }
  setCurrentRecord(empresa: any) {
    this.currentRecord = empresa;
    console.log('dato empresa', empresa)
    if (empresa) {
      this.solicitud.setValue({
        primer_nombre: empresa.primer_nombre ? empresa.primer_nombre.replace(/<br>/g, '\n') : '',
        razon_social: empresa.razon_social ? empresa.razon_social.replace(/<br>/g, '\n') : '',
        direccion: empresa.direccion ? empresa.direccion.replace(/<br>/g, '\n') : '',
        email: empresa.email ? empresa.email.replace(/<br>/g, '\n') : '',
        departamento: empresa.departamento ? empresa.departamento.toString() : '',
        ciudad: empresa.ciudad ? empresa.ciudad.replace(/<br>/g, '\n') : '',
        categoria: empresa.categoria ? empresa.categoria.toString() : '',
        numDocumento: empresa.numDocumento ? empresa.numDocumento.replace(/<br>/g, '\n') : '',
        dv: empresa.dv ? empresa.dv.replace(/<br>/g, '\n') : '',
        telEmpresaMovil: empresa.telEmpresaMovil ? empresa.telEmpresaMovil.replace(/<br>/g, '\n') : '',
        telEmpresaFijo: empresa.telEmpresaFijo ? empresa.telEmpresaFijo.replace(/<br>/g, '\n') : '',
        representanteLegal: empresa.representanteLegal ? empresa.representanteLegal.replace(/<br>/g, '\n') : '',
        contacto: empresa.contacto ? empresa.contacto.replace(/<br>/g, '\n') : '',
        email_responsable: empresa.email_responsable ? empresa.email_responsable.replace(/<br>/g, '\n') : '',
        email_contacto: empresa.email_contacto ? empresa.email_contacto.replace(/<br>/g, '\n') : '',
        telefono_responsable: empresa.telefono_responsable ? empresa.telefono_responsable.replace(/<br>/g, '\n') : '',
        telContacto: empresa.telContacto ? empresa.telContacto.replace(/<br>/g, '\n') : '',
        arl: empresa.arl ? empresa.arl.toString() : '',
        tipoEmpresa: empresa.tipoEmpresa ? empresa.tipoEmpresa.toString() : '',
        riesgo: empresa.riesgo ? empresa.riesgo.toString() : '',
        periodo: empresa.periodo ? empresa.periodo.toString() : '',
        caja_cf: empresa.caja_cf ? empresa.caja_cf.replace(/<br>/g, '\n') : '',
        obs: empresa.obs ? empresa.obs.replace(/<br>/g, '\n') : '',
      });
    }
    // if (empresa) {
    //     this.servicios.setValue({

    //         afiliacion: empresa.afiliacion ? empresa.afiliacion.replace(/<br>/g, '\n') : '',
    //         creacion: empresa.creacion ? empresa.creacion.replace(/<br>/g, '\n') : '',
    //         liquidacion: empresa.liquidacion ? empresa.liquidacion.replace(/<br>/g, '\n') : '',
    //         asesorias: empresa.asesorias ? empresa.asesorias.replace(/<br>/g, '\n') : '',
    //         contratos: empresa.contratos ? empresa.contratos.replace(/<br>/g, '\n') : '',
    //         incapacidades: empresa.incapacidades ? empresa.incapacidades.replace(/<br>/g, '\n') : '',
    //         examenes: empresa.examenes ? empresa.examenes.replace(/<br>/g, '\n') : '',
    //     });
    // }
  }
  empresaEdit(solicitud :any){
    this.router.navigate(['/app/Empresa', solicitud]);
  }
  openObsEmpleadoModal(datos: any = null) {
    // const dialogRef = this.dialog.open(ObsModalEmpleadoComponent, {
    //   width: '1000px',
    //   height: '600px',
    //   maxHeight: '850px',
    //   panelClass: 'custom-dialog-container',
    //   data: {
    //     datos
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (!result) return;
    //   this.loadEmpleadoPaginator();

    // });
  }
  loadEmpleadoPaginator() {
    this.loadingRecords = true;
    const date =
      this.filters.value.date !== '' && this.filters.value.date !== null
        ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
        : '';
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `id_afiliacion: ${this._userService.currentUser.empresa.afiliacion_id}, limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date}`;
    const nombreQuery = 'empleadoPagination'
    const queryProps =
      'data{ id, id_afiliacion, empresa{id, razon_social, primer_nombre}, status, email, cargo, tipoContrato, tipoVinculacion, aporte_activacion, tipoAfiliacion, primer_nombre, segundo_nombre, primer_apellido, fecha_ingreso, segundo_apellido, tipo_documento, numero_documento, ciudad, departamento, direccion, movil, eps, f_de_pensiones, fecha_retiro, salario_base, arl, riesgo, caja_cf, sucursal, subsidio_transporte, periodo_de_pago }, total, total1, total2';

    this.apiService.getData(queryProps, queryParams, nombreQuery).subscribe(
      (response: any) => {
        this.total = response.data.empleadoPagination.total;
        this.total1 = response.data.empleadoPagination.total1;
        this.total2 = response.data.empleadoPagination.total2;
        this.data = response.data.empleadoPagination.data;
        this.resultsLengthNomina = response.data.empleadoPagination.total;
        this.loadingRecords = false;
        console.log('estos son los datos para la afiliacion ', this.data)

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
  getRecordMultimedia(record$id: any) {
    this.loadingRecords = true;
    const queryParams = `afiliacion_id: "${this.id = this.route.snapshot.paramMap.get('id')}" servicio_idEmpresa: 0`;
    const queryProps =
      'id,name,description,url,type,status,created_at';

    // this.apiService.getMultimediasFromLocal(queryParams, queryProps).subscribe(
    //   (result: any) => {
    //     this.loadingRecords = false;
    //     this.imagen = result.data.multimedias;
    //     this.currentRecord.multimedias = result.data.multimedias;
    //     // this.apiService.setEmpresa(result.data.record);
    //     // this.setCurrentRecord(result.data.record);

    //     console.log(result);
    //   },
    //   (error: any) => {
    //     this.loadingRecords = false;
    //     console.log(error);
    //   }
    // );
  }
  openDocumentosModalSS() {
    // const dialogRef = this.dialog.open(CargarDocumentoEmpresaComponent, {
    //   width: '1200px',
    //   height: '600px',
    //   maxHeight: '800px',
    //   panelClass: 'custom-dialog-container',
    //   data: {
    //     ss: this.id
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   this.getRecordMultimediaSS();
    //   if (result) {
    //     let match = this.imagenSS.filter((value) => {
    //       return value.id == result.id;
    //     });
       
    //     console.log(match);
    //     console.log(result);
    //     console.log(this.imagenSS);
    //   }

    // });
  }
  openDocumentosModalIcon() {
    const dialogRef = this.dialog.open(CargarIconoComponent, {
      width: '670px',
      height: 'auto',
      maxHeight: '800px',
      panelClass: 'custom-dialog-container',
      data: {
        ss: this._userService.currentUser.empresa.afiliacion_id,
        imagen: this._userService.currentUser.empresa.imagen
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.getRecordMultimediaSS();
      this.currentRecord.imagen;
      this.loadDataEmpresa(result);
      if (result) {
        let match = this.imagenSS.filter((value) => {
          return value.id == result.id;
        });
  
        console.log(match);
        console.log(result);
        console.log(this.imagenSS);
      }

    });
  }
  NuevoServicio(){
    this.router.navigate(['/app/servicio-empresa', this.id = this.route.snapshot.paramMap.get('id')]);
  }
  imagenSS: any[] = []

  getRecordMultimediaSS() {
    this.loadingRecords = true;
    const queryParams = `afiliacion_id: "${this.id = this.route.snapshot.paramMap.get('id')}" servicio_idEmpresa: 1`;
    const queryProps =
      'id,name,description,url,type,status,created_at';

    // this.apiService.getMultimediasFromLocal(queryParams, queryProps).subscribe(
    //   (result: any) => {
    //     this.loadingRecords = false;
    //     this.imagenSS = result.data.multimedias;
    //     // this.currentRecord.multimedias = result.data.multimedias;
    //     // this.apiService.setEmpresa(result.data.record);
    //     // this.setCurrentRecord(result.data.record);

    //     console.log(result);
    //   },
    //   (error: any) => {
    //     this.loadingRecords = false;
    //     console.log(error);
    //   }
    // );
  }
  openMultimediaModal(empleado: any) {
    // const dialogRef = this.dialog.open(MultimediaModalComponent, {
    //   width: '480px',
    //   height: '504px',
    //   maxHeight: '800px',
    //   panelClass: 'custom-dialog-container',
    //   data: {
    //     empleado: empleado
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (!result) { return; }

    //   this.getRecordMultimediaSS();
    // });
  }
  loadNominaPaginator() {
    this.loadingRecords = true;
    const date =
      this.filters.value.date !== '' && this.filters.value.date !== null
        ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
        : '';
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `afiliacion_id: ${this.id = this.route.snapshot.paramMap.get('id')}, limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date}`;
    const queryProps =
      'data{ id, empresa_id, periodo, nombre_periodo, numEmpleado, valorTotal, t_valorSS, t_valorHorasEx, t_otrosPagos, t_deducciones, status, numPlanilla, created_at, }, total';

    // this.apiService.nominaPagination(queryParams, queryProps).subscribe(
    //   (response: any) => {

    //     this.dataNomina = response.data.nominaPagination.data;
    //     this.resultsLengthTotal = response.data.nominaPagination.total;
    //     this.loadingRecords = false;
    //     console.log('estos son los datos para la afiliacion ', this.data)

    //   },
    //   error => {
    //     this.loadingRecords = false;
    //     this._snackBar.open('Error.', null, {
    //       duration: 4000
    //     });
    //     console.log(error);
    //   }
    // );
  }
  dateChange(event: any) {
    this.loadNominaPaginator();
  }


  searchKeyUp($event: KeyboardEvent): void {
    console.log($event);
    if ($event.code === 'KeyN' && $event.shiftKey) {
      this.filters.controls.search.setValue('');
      return;
    }

    this.keyUp.next($event);
  }
  
  
  openCrearEmpleadoModal(afiliacion: any = null) {
    // const dialogRef = this.dialog.open(CrearEmpleadoComponent, {
    //   width: '1000px',
    //   height: 'auto',
    //   maxHeight: '850px',
    //   panelClass: 'custom-dialog-container',
    //   data: {
    //     afiliacion
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (!result) return;
    //   this.loadEmpleadoPaginator();

    // });
  }
  openModal(afiliacion: any) {


    if (afiliacion.status == 1) {

      this.openStatusModal(afiliacion)
    }
    if (afiliacion.status == 2) {

      this.openStatusModal(afiliacion);
    }

    if (afiliacion.status == 3) {
      this.openStatusModal(afiliacion)
    }

  }
  openStatusModal(afiliacion: any = null) {
    // const dialogRef = this.dialog.open(ServicioStatuscomponent, {
    //   width: '470px',
    //   height: '320px',
    //   maxHeight: '850px',
    //   panelClass: 'custom-dialog-container',
    //   data: {
    //     afiliacion
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (!result) return;
    //   this.loadEmpleadoPaginator();
    //   this.loadDataEmpresa(result);
    //   this.loadDetalleServicio();

    // });
  }
  
  delete(income: any) {

    const r = confirm('¿DESEAS ELIMINAR EL EMPLEADO?');
    // if (r === true) {
    //   this.loadingRecords = true;

    //   // const id = income ? `id: ${income.id},` : '';
    //   const queryParams = `id:${income.id}, delete: 1, id_afiliacion: ${this.id = this.route.snapshot.paramMap.get('id')} `;
    //   const queryProps = 'id ';

    //   this.apiService.crearEmpleado(queryParams, queryProps).subscribe(
    //     (response: any) => {
    //       this.loadingRecords = false;

    //       this.loadEmpleadoPaginator();

    //       this.setRecordFromCache();

    //       this._snackBar.open('Eliminado', null, {
    //         duration: 4000
    //       });
    //     },
    //     error => {
    //       this.loadingRecords = false;
    //       this._snackBar.open('Error.', null, {
    //         duration: 4000
    //       });

    //       console.log(error);
    //     }
    //   );
    // }
  }
  deleteMultimedia(multimedia: any) {
    var r = confirm('¿Seguro que desea eliminar el archivo?');
    // if (r === true) {
    //   this.loadingRecords = true;

    //   const id = multimedia ? `id: ${multimedia.id},` : '';
    //   const queryParams = `${id} delete: 1`;
    //   const queryProps = 'id';

    //   this.apiService.saveLocalMultimedia(queryParams, queryProps).subscribe(
    //     (response: any) => {
    //       this.loadingRecords = false;

    //       this.getRecordMultimediaSS();

    //       this._snackBar.open('Eliminado', null, {
    //         duration: 4000
    //       });
    //     },
    //     error => {
    //       this.loadingRecords = false;
    //       this._snackBar.open('Error.', null, {
    //         duration: 4000
    //       });

    //       console.log(error);
    //     }
    //   );
    // }
  }
  openDetalleEmpleadoModal(afiliacion: any = null) {
    // const dialogRef = this.dialog.open(EditarEmpleadoComponent, {
    //   width: '1200px',
    //   height: '600px',
    //   maxHeight: '850px',
    //   panelClass: 'custom-dialog-container',
    //   data: {
    //     afiliacion
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (!result) return;
    //   this.loadEmpleadoPaginator();

    // });
  }
  openStatusEmpleadoModal(afiliacion: any = null) {
    // const dialogRef = this.dialog.open(statusEmpleadocomponent, {
    //   width: '350px',
    //   height: '400px',
    //   maxHeight: '850px',
    //   panelClass: 'custom-dialog-container',
    //   data: {
    //     afiliacion
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (!result) return;
    //   this.loadEmpleadoPaginator();

    // });
  }
  loadAfiliacion() {
    console.log('loading records...');

    this.loadingRecords = true;
    // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `id: ${this.id = this.route.snapshot.paramMap.get('id')} `;
    const queryProps =
      'id, servicioGuardado{id, id_afiliacion} multimedias{id,name,description,url,type,status,created_at}, sucursales{id, nombre, caja_cf},  detalleServicio{id, id_afiliacion, id_servicio, valor, servicio{id, nombre} },  primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, tipoEmpresa, telefono, tipoPersona, observacion{id, user_id, afiliacion_id, description, created_at, updated_at}, tipoDocumento, numDocumento, dv, status, apellidos, tipoSolicitud, representanteLegal, telEmpresa, email, departamento, ciudad, direccion, contacto, telContacto, tipoAfiliacion, progreso, created_at';
    // this.apiService.getAfiliacion(queryParams, queryProps).subscribe(
    //   (response: any) => {

    //     this.datos = response.data.afiliacion;
    //     this.totalAfiliados = this.datos.reduce((
    //       acc,
    //       obj,
    //     ) => acc + (obj.servicioGuardado.length++), 0
    //     );
    //   },
    //   error => {
    //     this.loadingRecords = false;
    //     this._snackBar.open('Error.', null, {
    //       duration: 4000
    //     });
    //     console.log(error);
    //   }
    // );
  }
  loadDataEmpresa(id: any) {
    console.log('loading records...');

    this.loadingRecords = true;
    // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `afiliacion_id: ${this._userService.currentUser.empresa.afiliacion_id}`;
    const nombreQuery = 'empresa';
    const queryProps = 
      'id, periodo, categoria, imagen, detalleServicio{id, id_afiliacion, id_servicio,  status servicio{id, nombre} }, updated_at, afiliacion_id, contacto, telContacto, tipoEmpresa, razon_social, primer_nombre, direccion, email, departamento, ciudad, numDocumento, dv, telEmpresaMovil, telEmpresaFijo, representanteLegal, contacto, email_responsable, email_contacto, telefono_responsable, arl, riesgo, caja_cf ';
      this.apiService.getData(queryProps, queryParams, nombreQuery).subscribe(
      (response: any) => {
        this.dataEmpresa = response.data.empresa;
        this.apiService.setEmpresa(response.data.empresa);
        if (response.data.empresa && response.data.empresa.length > 0) {
          this.setCurrentRecord(response.data.empresa[0]);
        }
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
  detalleServicio: any [] = [];
  loadDetalleServicio() {
    console.log('loading records...');

    this.loadingRecords = true;
    // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `id_afiliacion: ${this._userService.currentUser.empresa.afiliacion_id} `;
    const queryProps =
      'id, id_afiliacion, id_servicio, cantidad, nombre, paquete, numero_empleados, unidad, status, obs, valor, created_at, servicio{id, nombre}';
      this.apiService.getData(queryProps, queryParams, 'detalleServicio').subscribe(
      // this.apiService.getDetalleServicio(queryParams, queryProps).subscribe(
      (response: any) => {

        this.detalleServicio = response.data.detalleServicio;
        this.totalServicio = this.detalleServicio.reduce((
          acc,
          obj,
        ) => acc + (obj.valor == 1 ? 0 : obj.valor * obj.cantidad), 0
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
  deleteServicio(income: any) {

    const r = confirm('¿DESEAS ELIMINAR EL SERVICIO?');
    // if (r === true) {
    //   this.loadingRecords = true;

    //   // const id = income ? `id: ${income.id},` : '';
    //   const queryParams = `id:${income.id}, delete: 1 `;
    //   const queryProps = 'id ';

    //   this.apiService.saveServicio(queryParams, queryProps).subscribe(
    //     (response: any) => {
    //       this.loadingRecords = false;

    //       this.loadDetalleServicio();

    //       this.setRecordFromCache();

    //       this._snackBar.open('Eliminado', null, {
    //         duration: 4000
    //       });
    //     },
    //     error => {
    //       this.loadingRecords = false;
    //       this._snackBar.open('Error.', null, {
    //         duration: 4000
    //       });

    //       console.log(error);
    //     }
    //   );
    // }
  }
  openAsignarUsuarioModalComponent(user: any) {
    // const dialogRef = this.dialog.open(AsignarUsuarioModalComponent, {
    //   width: '600px',
    //   height: '400px',
    //   maxHeight: '850px',
    //   panelClass: 'custom-dialog-container',
    //   data: {
    //     user: this.currentRecord
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    // });
  }
}
