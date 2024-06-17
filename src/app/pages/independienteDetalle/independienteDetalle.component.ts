import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map, debounceTime, distinctUntilChanged, flatMap, delay, switchMap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import moment from 'moment';

import { MatTableDataSource } from '@angular/material/table';

import { FileUploader } from 'ng2-file-upload';
import { Afiliacion } from 'app/models/afiliacion';
import { environment } from 'environments/environment';
import { ApiService } from 'app/core/api/api.service';
import { RecordsService } from '../records.service';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { MultimediaModalComponent } from 'app/modals/multimediaModal/multimedia-modal.component';
import { AgregarSucursalModalComponent } from 'app/modals/agregarsucursalModal/agregar-sucursal-modal.component';
import { InfoBeneficiarioModalComponent } from 'app/modals/infoBeneficiarioModal/info-beneficiario-modal.component';
import { user } from 'app/models/user.model';
import { CargarIconoComponent } from 'app/modals/cargarIcono/cargarIcono.component';

export interface beneficiarios_interface{
  nombre_beneficiario: string;
  tipo: string;
}

const BENEFICIARIOS: beneficiarios_interface[] = [
  {nombre_beneficiario: "sdsadsddfs", tipo: 'Hydrogen'},
  {nombre_beneficiario: "sdsadsddfs", tipo: 'Hydrogen'},
  {nombre_beneficiario: "sdsadsddfs", tipo: 'Hydrogen'}
];


export interface PeriodicElement {
  nombre_documento: string;
  fecha_guardado: string;
}

const TABLA_DOCUMENTOS: PeriodicElement[] = [
  {nombre_documento: 'Cédula', fecha_guardado: '12/01/20'},
  {nombre_documento: 'Copia del contacto', fecha_guardado: '15/01/20'},
  {nombre_documento: 'poder', fecha_guardado: '15/01/20'}
];


@Component({
  selector: 'vex-independienteDetalle',
  templateUrl: './independienteDetalle.component.html',
  styleUrls: ['./independienteDetalle.component.scss'],
  animations: [

  ]
})
export class IndependienteDetalleComponent implements OnInit {
  displayedColumns: string[] = ['nombre_empleado', 'documento_empleado', 'afiliacion', 'contrato', 'total'];

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  resultsLength = 0;
  pageSize = 10;
  displayedColumnsDocuments: string[] = ['nombre_documento', 'fecha_guardado', 'imagen', 'acciones'];
  dataSource: MatTableDataSource<Afiliacion> | null;
  documentos_displayedColumns: string[] = ['nombre_documento', 'fecha_guardado', 'acciones'];
  tabla_documentos = TABLA_DOCUMENTOS;
  data: Afiliacion[] = [];
  beneficiarios_displayedColumns: string[] = ['nombre_beneficiario', 'tipo', 'acciones'];
  beneficiarios = BENEFICIARIOS;
  loadingPropect= false;
  alertIsVisible = true;
  filters = new FormGroup({
    search: new FormControl('', []),
    date: new FormControl('', [])
  });
  totalAfiliados: any []=[];
  datos: any []=[];
  loadingRecords= false;
  dataPersona: any [] =[];
  currentRecord: any = null;
  id='';
  dataCaja: any[] = [];
  sending= false;
  departamento_seleccionado: any;
  dataCiudad: any[] = [];
  dataDepartamento: any[] = [];
  dataEps: any[] = [];
  dataSucursal: any[] = [];
  beneficiado: any[] = [];
  imagen: any[] = [];
  uploadForm: FormGroup;
  public uploader: FileUploader = new FileUploader({
    isHTML5: true,
    url: `${environment.serverUrl}/v1/actions/recordMultimedia`
  });
  loading: boolean;
  detalleServicio: any [] = [];
  userData: any;
  constructor(
    private _formBuilder: FormBuilder, 
    public dialog: MatDialog,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private recordsService: RecordsService,
    private credentialsService: AuthService,
    private fb: FormBuilder,
    private coreService: UserService
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
      });
    }

  eliminar() {
    return 1
  }
  modificar() {
    return 1
  }

  @ViewChild(MatSort) sort: MatSort;
  public keyUp = new Subject<any>();
  @ViewChild('search', { static: false }) searchEl: ElementRef;
  
  step_1 = new FormGroup({
    primer_nombre: new FormControl('', []),
    primer_apellido: new FormControl('', []),
    tipoDocumento: new FormControl('', []),
    numDocumento: new FormControl('', []),
    ciudad: new FormControl('', []),
    departamento: new FormControl('', []),
    email: new FormControl('', []),
    direccion: new FormControl('', []),
    telefono: new FormControl('', []),
    tipoAfiliacion: new FormControl('', []),
    eps: new FormControl('', []),
    arl: new FormControl('', []),
    tipoVinculacion: new FormControl('', []),
    cargo: new FormControl('', []),
    riesgo: new FormControl('1', []),
    salario_base: new FormControl('', [Validators.required, Validators.min(1000000)]),
    pensiones: new FormControl('', []),
    
  });

  step_4 = new FormGroup({
    nombre_beneficiario: new FormControl('', []),
    tipo: new FormControl('', []),
  });


  
  setRecordFromCache() {
    let currentRecord = this.recordsService.getIndependienteFromCache();

    this.setCurrentRecord(currentRecord);
  }
  setCurrentRecord(persona: any) {
    this.currentRecord = persona;
    console.log('dato persona', persona)
    if (persona) {
      this.step_1.setValue({
        primer_nombre: persona.primer_nombre ? persona.primer_nombre.replace(/<br>/g, '\n') : '',
        primer_apellido: persona.primer_apellido ? persona.primer_apellido.replace(/<br>/g, '\n') : '',
        tipoDocumento: persona.tipoDocumento ? persona.tipoDocumento.toString() : '',
        numDocumento: persona.numDocumento ? persona.numDocumento.replace(/<br>/g, '\n') : '',
        ciudad: persona.ciudad ? persona.ciudad.replace(/<br>/g, '\n') : '',
        departamento: persona.departamento ? persona.departamento.toString() : '',
        email: persona.email ? persona.email.replace(/<br>/g, '\n') : '',
        direccion: persona.direccion ? persona.direccion.replace(/<br>/g, '\n') : '',
        telefono: persona.telefono ? persona.telefono.replace(/<br>/g, '\n') : '',
        tipoAfiliacion: persona.tipoAfiliacion ? persona.tipoAfiliacion.toString() : '',
        eps: persona.eps ? persona.eps.toString() : '',
        arl: persona.arl ? persona.arl.toString() : '',
        tipoVinculacion: persona.tipoVinculacion ? persona.tipoVinculacion.toString() : '',
        cargo: persona.cargo ? persona.cargo.replace(/<br>/g, '\n') : '',
        riesgo: persona.riesgo ? persona.riesgo.toString() : '',
        salario_base: persona.salario_base ? persona.salario_base.replace(/<br>/g, '\n') : '',
        pensiones: persona.pensiones ? persona.pensiones.toString() : '',
      });
    }

  }
  loadDataPersona(id: any) {
    console.log('loading records...');

    this.loadingRecords = true;
    // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `afiliacion_id: ${this.coreService.currentUser.persona.afiliacion_id}`;
    const queryProps =
      'id,  afiliacion, imagen, afiliacion_id, liquidacion, asesorias, iva, incapacidades, examenes, primer_nombre, primer_apellido, tipoDocumento, numDocumento, ciudad, email, departamento,  direccion, telefono, tipoAfiliacion, eps, arl, tipoVinculacion, cargo, riesgo, pensiones, salario_base, status ';
    this.apiService.getData(queryProps, queryParams, 'persona').subscribe(
     
      (response: any) => {
        this.dataPersona = response.data.persona;
        this.apiService.setEmpresa(response.data.persona);
        if (response.data.persona && response.data.persona.length > 0) {
          this.setCurrentRecord(response.data.persona[0]);
        }
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
  loadBeneficiado() {
    this.loadingPropect = true;
    const date =
      this.filters.value.date !== '' && this.filters.value.date !== null
        ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
        : '';
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `id_afiliacion: ${this.coreService.currentUser.persona.afiliacion_id},  ${searchText} ${date}`;
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
  save() {
    this.sending = true;
    const data = this.step_1.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const afiliacion_id = this.coreService.currentUser.persona.afiliacion_id;
    const primer_nombre = data.primer_nombre !== '' && data.primer_nombre !== null ? `primer_nombre: "${data.primer_nombre}",` : `primer_nombre: ".",`;
    const primer_apellido = data.primer_apellido !== '' && data.primer_apellido !== null ? `primer_apellido: "${data.primer_apellido}",` : `primer_apellido: ".",`;
    const email = data.email !== '' && data.email !== null ? `email: "${data.email}",` : `email: ".",`;
    const departamento = data.departamento !== '' && data.departamento !== null ? `departamento: "${data.departamento}",` : `departamento: ".",`;
    const ciudad = data.ciudad !== '' && data.ciudad !== null ? `ciudad: "${data.ciudad}",` : `ciudad: ".",`;
    const numDocumento = data.numDocumento !== '' && data.numDocumento !== null ? `numDocumento: "${data.numDocumento}",` : `numDocumento: ".",`;
    const tipoDocumento = data.tipoDocumento !== '' && data.tipoDocumento !== null ? `tipoDocumento: "${data.tipoDocumento}",` : `tipoDocumento: ".",`;
    const telefono = data.telefono !== '' && data.telefono !== null ? `telefono: "${data.telefono}",` : `telefono: ".",`;
    const tipoAfiliacion = data.tipoAfiliacion !== '' && data.tipoAfiliacion !== null ? `tipoAfiliacion: ${data.tipoAfiliacion},` : `tipoAfiliacion: 1,`;
    const eps = data.eps !== '' && data.eps !== null ? `eps: "${data.eps}",` : `eps: ".",`;
    const tipoVinculacion = data.tipoVinculacion !== '' && data.tipoVinculacion !== null ? `tipoVinculacion: "${data.tipoVinculacion}",` : `tipoVinculacion: ".",`;
    const cargo = data.cargo !== '' && data.cargo !== null ? `cargo: "${data.cargo}",` : `cargo: ".",`;
    const arl = data.arl !== '' && data.arl !== null ? `arl: "${data.arl}",` : `arl: ".",`;
    const riesgo = data.riesgo !== '' && data.riesgo !== null ? `riesgo: "${data.riesgo}",` : `riesgo: ".",`;
    const salario_base = data.salario_base !== '' && data.salario_base !== null ? `salario_base: "${data.salario_base}",` : `salario_base: ".",`;
    const direccion = data.direccion !== '' && data.direccion !== null ? `direccion: "${data.direccion}",` : `direccion: ".",`;
    const pensiones = data.pensiones !== '' && data.pensiones !== null ? `pensiones: "${data.pensiones}",` : `pensiones: ".",`;

    const queryParams = `${id} afiliacion_id: ${this.coreService.currentUser.persona.afiliacion_id},  ${primer_nombre} ${primer_apellido} ${email} ${departamento} ${ciudad} ${pensiones} ${numDocumento} ${tipoDocumento} ${telefono} ${tipoAfiliacion} ${eps}  ${tipoVinculacion} ${cargo} ${arl} ${riesgo} ${salario_base} ${direccion}`;
   
    const queryProps = 'id, afiliacion_id, primer_nombre';
    this.apiService.setData(queryProps, queryParams, 'savePersona').subscribe(
   
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        console.log(queryParams)
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
  dataPension: any[] = [];
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
  finalizar() {
    const r = confirm('¿ESTAS SEGURO QUE DESEAS GENERAR LA CUENTA DE COBRO?');
    if (r === true) {
    this.router.navigate(['/app/home']);
    this.saveStatus();
    this.saveCuentaCobro();
    }
  }
  saveCuentaCobro() {
    this.sending = true;
    const data = this.servicios.value;

    const id = data.id ? `id: ${data.id},` : '';
    const queryParams = `${id} id_afiliacion: ${this.coreService.currentUser.persona.afiliacion_id}, valor: ${this.totalServicio} nombre:"Afiliacion" `;
    const queryProps = 'id';
    this.apiService.setData(queryProps, queryParams, 'saveCuentaCobro').subscribe(
 
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        console.log(queryParams)

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
  saveStatus() {
    this.sending = true;
    const data = this.step_1.value;
    const id = data.id ? `id: ${data.id},` : '';
    // const status = 1 ;
    const queryParams = `${id} afiliacion_id: ${this.coreService.currentUser.persona.afiliacion_id}, activacion:${1}  status: 4`;
    const queryProps = 'id, afiliacion_id,  status';
    this.apiService.setData(queryProps, queryParams, 'savePersona').subscribe(

      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        console.log(queryParams)
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

  loadDepartamento() {
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = ``;
    const queryProps =
      'id, nombre';
    this.apiService.getData(queryProps, queryParams, 'departamento').subscribe(
   
      (response: any) => {
        this.dataDepartamento = response.data.departamento;
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

  // loadCiudad() {
  //   console.log('loading records...');
  //   this.loadingRecords = true;
  //   const queryParams = ``;
  //   const queryProps =
  //     'id, id_departamento, nombre';
  //   this.apiService.getCiudad(queryParams, queryProps).subscribe(
  //     (response: any) => {
  //       this.dataCiudad = response.data.ciudad;
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
  openMultimediaModal(multimedia: any) {
    const dialogRef = this.dialog.open(MultimediaModalComponent, {
      width: '480px',
      height: '504px',
      maxHeight: '800px',
      panelClass: 'custom-dialog-container',
      data: {
        multimedia: multimedia
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) { return; }

      this.getRecordMultimedia(this.currentRecord.identification);
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
      // this.apiService.saveLocalMultimedia(queryParams, queryProps).subscribe(
        (response: any) => {
          this.loading = false;

          this.getRecordMultimedia(this.currentRecord.identification);

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
  loadEps() {
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `search: ""`;
    const queryProps =
      'id, codigo, nombre';
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

  setDepartamentoSeleccionado(index) {
    this.departamento_seleccionado = index;
  }

  tipoDepartamentoSeleccionado = "Norte de Santander";
  loadSucursal() {
    console.log('loading records...');

    this.loadingRecords = true;
    // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `afiliacion_id: ${this.coreService.currentUser.persona.afiliacion_id}  `;
    const queryProps =
      'id, nombre, caja_cf, departamento, ciudad';
    this.apiService.getData(queryProps, queryParams, 'sucursales').subscribe(
    
      (response: any) => {
        console.log('esto es para mostrar datos', this.datos)
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
  openagregarSucursalModal(id: any) {
    const dialogRef = this.dialog.open(AgregarSucursalModalComponent, {
      width: '600px',
      height: '400px',
      maxHeight: '850px',
      panelClass: 'custom-dialog-container',
      data: {
        id: id
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadSucursal();
    });
  }
    openBeneficiario(datos: any) {
    const dialogRef = this.dialog.open(InfoBeneficiarioModalComponent, {
      width: '700px',
      height: '600px',
      maxHeight: '850px',
      panelClass: 'custom-dialog-container',
      data: {
        datos: datos
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadSucursal();
      this.loadBeneficiado();
    });
  }

  openBeneficiario2(datos: any) {
    const dialogRef = this.dialog.open(InfoBeneficiarioModalComponent, {
      width: '800px',
      height: '600px',
      maxHeight: '850px',
      panelClass: 'custom-dialog-container',
      data: {
        datos: datos,
        documento: 1
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadSucursal();
      this.loadBeneficiado();
    });
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

          // this.setRecordFromCache();
          this.loadSucursal();

          this._snackBar.open('Eliminado', null, {
            duration: 4000
          });
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
  }

  user() {
    return 1
    // this.coreService.currentUser.role_id;
  }
  ngOnInit(): void {
    this.loadEps();
    this.loadDepartamento();
    // this.loadCiudad();
    this.loadPension()
    this.loadCaja();
    this.loadBeneficiado();
    this.loadDetalleServicio();
    this.LoadServicioDetalle7();
    this.LoadServicioDetalle6();
    this.LoadServicioDetalle5();
    this.LoadServicioDetalle4();
    this.LoadServicioDetalle3();
    this.LoadServicioDetalle2();
    this.LoadServicioDetalle1();
    const nombreQuery = 'me';
    const queryParams = `search: " " `;
    const queryProps = 'id,name,email, avatar, empresa{id, razon_social, primer_nombre, afiliacion_id}';

    this.apiService.getData(queryProps, queryParams, nombreQuery).
      subscribe((response) => {
        this.coreService.setUser(new user().deserialize(response.data.me));
        this.userData = response.data.me;
      });
    // this.id = this.userData.snapshot.paramMap.get('id');
    let record$ = this.route.paramMap.pipe(switchMap((params: ParamMap) => of(params.get('id'))));
    
    this.loadDataPersona(1);
    console.log('empresa', this.dataPersona);

    this.uploader.setOptions({
      additionalParameter: {
        // record_id: recordId
      },
      headers: [
        {
          name: 'authorization',
          value: `Bearer ${this.credentialsService.accessToken}`
        }
      ]
    });
 
    this.getRecordMultimedia(record$);
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (file) => { this.getRecordMultimedia(this.coreService.currentUser.persona.afiliacion_id) };

    this.uploadForm = this.fb.group({
      document: [null, [Validators.required]],
    });

  }
  getRecordMultimedia(id: any) {
    this.loadingRecords = true;
    const queryParams = `afiliacion_id: "${this.coreService.currentUser.persona.afiliacion_id}"`;
    const queryProps =
      'id,name,description,url,type,status,created_at';
    this.apiService.getData(queryProps, queryParams, 'multimedias').subscribe(
    
      (result: any) => {
        this.loadingRecords = false;
        this.imagen = result.data.multimedias;
        this.currentRecord.multimedias = result.data.multimedias;
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
  openPresupuesto() {
    // const win = window.open(`http://localhost:8000/presupuesto/${this.coreService.currentUser.persona.afiliacion_id}`, '_blank');
    const win = window.open(`${environment.serverUrl}/presupuesto/${this.coreService.currentUser.persona.afiliacion_id}`, '_blank');
    win.focus();
  }
  afiliacion = new FormGroup({
    paquete: new FormControl('', []),
    nombre: new FormControl('AFILIACIONES PARA SEGURIDAD SOCIAL', []),
    tipo: new FormControl('1', []),
    valor: new FormControl('', []),
  })
  creacion = new FormGroup({
    paquete: new FormControl('CREACION EMPRESA', []),
    nombre: new FormControl('CREACION EMPRESA', []),
    tipo: new FormControl('2', []),
    valor: new FormControl('', []),
  })
  liquidacion = new FormGroup({
    paquete: new FormControl('', []),
    nombre: new FormControl('LIQUIDACION Y PAGOS DE PLANILLAS', []),
    tipo: new FormControl('3', []),
    valor: new FormControl('', []),
  })
  asesorias = new FormGroup({
    paquete: new FormControl('ASESORIAS', []),
    nombre: new FormControl('ASESORIAS', []),
    tipo: new FormControl('4', []),
    valor: new FormControl('', []),
  })
  contratos = new FormGroup({
    paquete: new FormControl('', []),
    nombre: new FormControl('CONTRATOS', []),
    tipo: new FormControl('5', []),
    valor: new FormControl('', []),
  })
  incapacidad = new FormGroup({
    paquete: new FormControl('INCAPACIDADES', []),
    nombre: new FormControl('INCAPACIDADES', []),
    tipo: new FormControl('6', []),
    valor: new FormControl('', []),
  })
  examen = new FormGroup({
    paquete: new FormControl('', []),
    nombre: new FormControl('EXAMENES OCUPACIONALES', []),
    tipo: new FormControl('7', []),
    valor: new FormControl('', []),
  })

  solicitud = new FormGroup({
    razon_social: new FormControl('', []),
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



  servicios = new FormGroup({
    afiliacion_empleado: new FormControl('', []),
    elaboracion_contrato: new FormControl('', []),
    seguridad_social: new FormControl('', []),
    liquidacion_nomina: new FormControl('', []),
    liquidacion_sociales: new FormControl('', []),

    afiliacion: new FormControl('', [Validators.required]),
    // creacion: new FormControl('', [Validators.required]),
    liquidacion: new FormControl('', [Validators.required]),
    asesorias: new FormControl('', [Validators.required]),
    // contratos: new FormControl('', [Validators.required]),
    incapacidades: new FormControl('', [Validators.required]),
    examenes: new FormControl('', [Validators.required]),
    iva: new FormControl('', [Validators.required]),
    paquete: new FormControl('', []),
    nombre: new FormControl('', []),
    tipo: new FormControl('', []),
    valor: new FormControl('', []),
  });
  servicio = 0;//Si está en cero, se oculta todo
  servicio1 = 0;
  servicio2 = 0;
  servicio3 = 0;
  servicio4 = 0;
  servicio5 = 0;
  servicio6 = 0;
  geServicioSeleccionado() { //Devuelve el valor de id_vehiculo_seleccionado

    return this.servicio;
  }

  ServicioSeleccionado(index) { //Modifica el valor de id_vehiculo_seleccionado
    this.servicio = index;

  }
  ServicioSeleccionado1(index) { //Modifica el valor de id_vehiculo_seleccionado
    this.servicio = 0;

  }
  getCreate() { //Devuelve el valor de id_vehiculo_seleccionado

    return this.servicio1;
  }

  creacionSelect(index) { //Modifica el valor de id_vehiculo_seleccionado
    this.servicio1 = index;

  }
  creacionSelect1(index) { //Modifica el valor de id_vehiculo_seleccionado
    this.servicio1 = 0;

  }

  getLiquidacion() { //Devuelve el valor de id_vehiculo_seleccionado

    return this.servicio2;
  }

  liquidacionSelect(index) { //Modifica el valor de id_vehiculo_seleccionado
    this.servicio2 = index;

  }
  liquidacionSelect1(index) { //Modifica el valor de id_vehiculo_seleccionado
    this.servicio2 = 0;

  }
  getServicio() { //Devuelve el valor de id_vehiculo_seleccionado

    return this.servicio3;
  }

  servicioSelect(index) { //Modifica el valor de id_vehiculo_seleccionado
    this.servicio3 = index;

  }
  servicioSelect1(index) { //Modifica el valor de id_vehiculo_seleccionado
    this.servicio3 = 0;

  }
  getContratos() { //Devuelve el valor de id_vehiculo_seleccionado

    return this.servicio4;
  }

  contratoSelect(index) { //Modifica el valor de id_vehiculo_seleccionado
    this.servicio4 = index;

  }
  contratoSelect1(index) { //Modifica el valor de id_vehiculo_seleccionado
    this.servicio4 = 0;

  }
  getIncapacidad() { //Devuelve el valor de id_vehiculo_seleccionado

    return this.servicio5;
  }

  incapacidadSelect(index) { //Modifica el valor de id_vehiculo_seleccionado
    this.servicio5 = index;

  }
  incapacidadSelect1(index) { //Modifica el valor de id_vehiculo_seleccionado
    this.servicio5 = 0;

  }
  getExamenes() { //Devuelve el valor de id_vehiculo_seleccionado

    return this.servicio6;
  }

  examenesSelect(index) { //Modifica el valor de id_vehiculo_seleccionado
    this.servicio6 = index;

  }
  examenesSelect1(index) { //Modifica el valor de id_vehiculo_seleccionado
    this.servicio6 = 0;

  }
  categoriaSelect: any;
  categoriaSelect7: any;
  categoriaSelect5: any;
  categoriaSelect3: any;
  valorSelect: any[] = [];
  valorSelect7: any[] = [];
  valorSelect5: any[] = [];
  valorSelect3: any[] = [];
  setCategoriaSeleccionado7(index) {
    this.categoriaSelect7 = index;
  }
  setValorSeleccionado7(index) {
    this.valorSelect7 = index;
  }
  setCategoriaSeleccionado5(index) {
    this.categoriaSelect5 = index;
  }
  setValorSeleccionado5(index) {
    this.valorSelect5 = index;
  }
  setCategoriaSeleccionado3(index) {
    this.categoriaSelect3 = index;
  }
  setValorSeleccionado3(index) {
    this.valorSelect3 = index;
  }
  setCategoriaSeleccionado(index) {
    this.categoriaSelect = index;
  }
  setValorSeleccionado(index) {
    this.valorSelect = index;
  }
  saveServicio() {

    this.saveServicioIncapacidad();
    this.saveServicioExamen();
    // this.saveServicioContratos();
    this.saveServicioAsesorias();
    this.saveServicioLiquidacion();
    // this.saveServicioCreacion();
    this.saveServicioAfiliacion();

  }
  operandoA: number;
  operandoB: number;
  resultado= 0;

  onSumar(): void {
    this.resultado = this.operandoA * this.operandoB / 100;
  }
  deleteServicios() {

    const r = confirm('¿DESEAS REINICIAR LOS SERVICIOS CONTRATADOS?');
    if (r === true) {
      this.loadingRecords = true;

      // const id = income ? `id: ${income.id},` : '';
      const queryParams = `id_afiliacion: ${this.coreService.currentUser.persona.afiliacion_id}, delete: 1 `;
      const queryProps = 'id ';
      this.apiService.setData(queryProps, queryParams, 'saveCuentaCobro').subscribe(
     
        (response: any) => {
          this.loadingRecords = false;

          this.setRecordFromCache();

          this.loadDetalleServicio();

          this.totalServicio;

          this._snackBar.open('Eliminado', null, {
            duration: 4000
          });
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
  }
  saveServicioData() {
    this.sending = true;
    const data = this.servicios.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const afiliacion_id = this.coreService.currentUser.persona.afiliacion_id;
    const afiliacion = data.afiliacion !== '' && data.afiliacion !== null ? `afiliacion: "${data.afiliacion}",` : `afiliacion: ".",`;
    // const creacion = data.creacion !== '' && data.creacion !== null ? `creacion: "${data.creacion}",` : `creacion: ".",`;
    const liquidacion = data.liquidacion !== '' && data.liquidacion !== null ? `liquidacion: "${data.liquidacion}",` : `liquidacion: ".",`;
    const asesorias = data.asesorias !== '' && data.asesorias !== null ? `asesorias: "${data.asesorias}",` : `asesorias: ".",`;
    // const contratos = data.contratos !== '' && data.contratos !== null ? `contratos: "${data.contratos}",` : `contratos: ".",`;
    const incapacidades = data.incapacidades !== '' && data.incapacidades !== null ? `incapacidades: "${data.incapacidades}",` : `incapacidades: ".",`;
    const examenes = data.examenes !== '' && data.examenes !== null ? `examenes: "${data.examenes}",` : `examenes: ".",`;
    const iva = data.iva !== '' && data.iva !== null ? `iva: ${data.iva},` : `iva: 0,`;
    const queryParams = `${id} ${iva} afiliacion_id: ${this.coreService.currentUser.persona.afiliacion_id}  ${afiliacion}  ${liquidacion} ${asesorias} ${incapacidades} ${examenes} `;
    const queryProps = 'id, afiliacion_id';
    this.apiService.setData(queryProps, queryParams, 'savePersona').subscribe(
      
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        console.log(queryParams)
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
  servicioDetalleData1: any[] = [];
  LoadServicioDetalle1() {
    this.loading = true;

    const queryParams = `tipo: 1`;
    const queryProps = 'id, nombre, tipo, precio1, precio2, precio3, precio4, precio5, precio6';
    this.apiService.getData(queryProps, queryParams, 'getSelectServicio').subscribe(

      (result: any) => {
        this.loading = false;
        this.servicioDetalleData1 = result.data.getSelectServicio;


        console.log('afiliacionesService', result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  servicioDetalleData2: any[] = [];
  LoadServicioDetalle2() {
    this.loading = true;

    const queryParams = `tipo: 2`;
    const queryProps = 'id, nombre, tipo, precio1, precio2, precio3, precio4, precio5, precio6';
    this.apiService.getData(queryProps, queryParams, 'getSelectServicio').subscribe(

      (result: any) => {
        this.loading = false;
        this.servicioDetalleData2 = result.data.getSelectServicio;


        console.log(result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  servicioDetalleData3: any[] = [];
  LoadServicioDetalle3() {
    this.loading = true;

    const queryParams = `tipo: 8`;
    const queryProps = 'id, nombre, tipo, precio1, precio2, precio3, precio4, precio5, precio6';
    this.apiService.getData(queryProps, queryParams, 'getSelectServicio').subscribe(
    
      (result: any) => {
        this.loading = false;
        this.servicioDetalleData3 = result.data.getSelectServicio;


        console.log(result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  servicioDetalleData4: any[] = [];
  LoadServicioDetalle4() {
    this.loading = true;

    const queryParams = `tipo: 4`;
    const queryProps = 'id, nombre, tipo, precio1, precio2, precio3, precio4, precio5, precio6';
    this.apiService.getData(queryProps, queryParams, 'getSelectServicio').subscribe(
    
      (result: any) => {
        this.loading = false;
        this.servicioDetalleData4 = result.data.getSelectServicio;


        console.log(result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  servicioDetalleData5: any[] = [];
  LoadServicioDetalle5() {
    this.loading = true;

    const queryParams = `tipo: 5`;
    const queryProps = 'id, nombre, tipo, precio1, precio2, precio3, precio4, precio5, precio6';
    
    this.apiService.getData(queryProps, queryParams, 'getSelectServicio').subscribe(
      (result: any) => {
        this.loading = false;
        this.servicioDetalleData5 = result.data.getSelectServicio;


        console.log(result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  servicioDetalleData6: any[] = [];
  LoadServicioDetalle6() {
    this.loading = true;

    const queryParams = `tipo: 6`;
    const queryProps = 'id, nombre, tipo, precio1, precio2, precio3, precio4, precio5, precio6';

    this.apiService.getData(queryProps, queryParams, 'getSelectServicio').subscribe(
      (result: any) => {
        this.loading = false;
        this.servicioDetalleData6 = result.data.getSelectServicio;


        console.log(result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  servicioDetalleData7: any[] = [];
  LoadServicioDetalle7() {
    this.loading = true;

    const queryParams = `tipo: 7`;
    const queryProps = 'id, nombre, tipo, precio1, precio2, precio3, precio4, precio5, precio6';

    this.apiService.getData(queryProps, queryParams, 'getSelectServicio').subscribe(
      (result: any) => {
        this.loading = false;
        this.servicioDetalleData7 = result.data.getSelectServicio;


        console.log(result);
      },
      (error: any) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
  goBack() {
    this.router.navigate(['/app/home']);
  }
  saveServicioExamen() {
    this.sending = true;
    const data = this.examen.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const afiliacion_id = this.coreService.currentUser.persona.afiliacion_id;
    const paquete = data.paquete !== '' && data.paquete !== null ? `paquete: "${data.paquete}",` : `paquete: ".",`;
    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: ".",`;
    const tipo = data.tipo !== '' && data.tipo !== null ? `tipo: ${data.tipo},` : `tipo: 1,`;
    const valor = data.valor !== '' && data.valor !== null ? `valor: ${data.valor},` : `valor: 1,`;
    const unidad = data.unidad !== '' && data.unidad !== null ? `unidad: "${1}",` : `unidad: ".",`;
    const queryParams = `${id} cantidad: ${1}, id_afiliacion: ${this.coreService.currentUser.persona.afiliacion_id}  ${paquete} ${nombre} ${tipo} ${valor}  ${unidad}`;
    const queryProps = 'id, id_afiliacion';

    this.apiService.setData(queryProps, queryParams, 'saveServicio').subscribe(

      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });

        console.log(queryParams)
        this.loadDetalleServicio();
        this.detalleServicio;

      },
      (error: any) => {
        this.sending = false;
        this._snackBar.open('no guardado.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
  saveServicioIncapacidad() {
    this.sending = true;
    const data = this.incapacidad.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const afiliacion_id = this.coreService.currentUser.persona.afiliacion_id;
    const paquete = data.paquete !== '' && data.paquete !== null ? `paquete: "${data.paquete}",` : `paquete: ".",`;
    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: ".",`;
    const tipo = data.tipo !== '' && data.tipo !== null ? `tipo: ${data.tipo},` : `tipo: 1,`;
    // const valor = `valor: ${this.resultado}`;
    const valor = this.resultado !== null ? `valor: ${this.resultado},` : `valor: 1,`;
    const unidad = data.unidad !== '' && data.unidad !== null ? `unidad: "${1}",` : `unidad: ".",`;
    const queryParams = `${id} cantidad: ${1}, id_afiliacion: ${this.coreService.currentUser.persona.afiliacion_id}  ${paquete} ${nombre} ${tipo} ${valor}  ${unidad}`;
    const queryProps = 'id, id_afiliacion';

    this.apiService.setData(queryProps, queryParams, 'saveServicio').subscribe(
    
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });

        console.log(queryParams)
        this.loadDetalleServicio();
        this.detalleServicio;

      },
      (error: any) => {
        this.sending = false;
        this._snackBar.open('no guardado.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
  saveServicioContratos() {
    this.sending = true;
    const data = this.contratos.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const afiliacion_id = this.coreService.currentUser.persona.afiliacion_id;
    const paquete = data.paquete !== '' && data.paquete !== null ? `paquete: "${data.paquete}",` : `paquete: ".",`;
    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: ".",`;
    const tipo = data.tipo !== '' && data.tipo !== null ? `tipo: ${data.tipo},` : `tipo: 1,`;
    const valor = data.valor !== '' && data.valor !== null ? `valor: ${data.valor},` : `valor: 1,`;
    const unidad = data.unidad !== '' && data.unidad !== null ? `unidad: "${1}",` : `unidad: ".",`;
    const queryParams = `${id} cantidad: ${1}, id_afiliacion: ${this.coreService.currentUser.persona.afiliacion_id}  ${paquete} ${nombre} ${tipo} ${valor}  ${unidad}`;
    const queryProps = 'id, id_afiliacion';


     this.apiService.setData(queryProps, queryParams, 'saveServicio').subscribe(
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });

        console.log(queryParams)
        this.loadDetalleServicio();
        this.detalleServicio;

      },
      (error: any) => {
        this.sending = false;
        this._snackBar.open('no guardado.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
  saveServicioAsesorias() {
    this.sending = true;
    const data = this.asesorias.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const afiliacion_id = this.coreService.currentUser.persona.afiliacion_id;
    const paquete = data.paquete !== '' && data.paquete !== null ? `paquete: "${data.paquete}",` : `paquete: ".",`;
    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: ".",`;
    const tipo = data.tipo !== '' && data.tipo !== null ? `tipo: ${data.tipo},` : `tipo: 1,`;
    const valor = data.valor !== '' && data.valor !== null ? `valor: ${data.valor},` : `valor: 1,`;
    const unidad = data.unidad !== '' && data.unidad !== null ? `unidad: "${2}",` : `unidad: ".",`;
    const queryParams = `${id} cantidad: ${1} id_afiliacion: ${this.coreService.currentUser.persona.afiliacion_id}  ${paquete} ${nombre} ${tipo} ${valor}  ${unidad}`;
    const queryProps = 'id, id_afiliacion';


     this.apiService.setData(queryProps, queryParams, 'saveServicio').subscribe(
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });

        console.log(queryParams)
        this.loadDetalleServicio();
        this.detalleServicio;

      },
      (error: any) => {
        this.sending = false;
        this._snackBar.open('no guardado.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
  saveServicioLiquidacion() {
    this.sending = true;
    const data = this.liquidacion.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const afiliacion_id = this.coreService.currentUser.persona.afiliacion_id;
    const paquete = data.paquete !== '' && data.paquete !== null ? `paquete: "${data.paquete}",` : `paquete: ".",`;
    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: ".",`;
    const tipo = data.tipo !== '' && data.tipo !== null ? `tipo: ${data.tipo},` : `tipo: 1,`;
    const valor = data.valor !== '' && data.valor !== null ? `valor: ${data.valor},` : `valor: 1,`;
    const unidad = data.unidad !== '' && data.unidad !== null ? `unidad: "${1}",` : `unidad: ".",`;
    const queryParams = `${id} cantidad: ${1}, id_afiliacion: ${this.coreService.currentUser.persona.afiliacion_id}  ${paquete} ${nombre} ${tipo} ${valor}  ${unidad}`;
    const queryProps = 'id, id_afiliacion';


     this.apiService.setData(queryProps, queryParams, 'saveServicio').subscribe(
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });

        console.log(queryParams)
        this.loadDetalleServicio();
        this.detalleServicio;

      },
      (error: any) => {
        this.sending = false;
        this._snackBar.open('no guardado.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
  saveServicioCreacion() {
    this.sending = true;
    const data = this.creacion.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const afiliacion_id = this.coreService.currentUser.persona.afiliacion_id;
    const paquete = data.paquete !== '' && data.paquete !== null ? `paquete: "${data.paquete}",` : `paquete: ".",`;
    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: ".",`;
    const tipo = data.tipo !== '' && data.tipo !== null ? `tipo: ${data.tipo},` : `tipo: 1,`;
    const valor = data.valor !== '' && data.valor !== null ? `valor: ${data.valor},` : `valor: 1,`;
    const unidad = data.unidad !== '' && data.unidad !== null ? `unidad: "${2}",` : `unidad: ".",`;
    const queryParams = `${id} cantidad: ${1} id_afiliacion: ${this.coreService.currentUser.persona.afiliacion_id}  ${paquete} ${nombre} ${tipo} ${valor}  ${unidad}`;
    const queryProps = 'id, id_afiliacion';


     this.apiService.setData(queryProps, queryParams, 'saveServicio').subscribe(
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });

        console.log(queryParams)
        this.loadDetalleServicio();
        this.detalleServicio;

      },
      (error: any) => {
        this.sending = false;
        this._snackBar.open('no guardado.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
  saveServicioAfiliacion() {
    this.sending = true;
    const data = this.afiliacion.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const afiliacion_id = this.coreService.currentUser.persona.afiliacion_id;
    const paquete = data.paquete !== '' && data.paquete !== null ? `paquete: "${data.paquete}",` : `paquete: ".",`;
    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: ".",`;
    const tipo = data.tipo !== '' && data.tipo !== null ? `tipo: ${data.tipo},` : `tipo: 1,`;
    const valor = data.valor !== '' && data.valor !== null ? `valor: ${data.valor},` : `valor: 1,`;
    const unidad = data.unidad !== '' && data.unidad !== null ? `unidad: "${1}",` : `unidad: ".",`;
    const queryParams = `${id}  cantidad: ${1}, id_afiliacion: ${this.coreService.currentUser.persona.afiliacion_id}  ${paquete} ${nombre} ${tipo} ${valor}  ${unidad}`;
    const queryProps = 'id, id_afiliacion';


     this.apiService.setData(queryProps, queryParams, 'saveServicio').subscribe(
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });

        console.log(queryParams)
        this.loadDetalleServicio();
        this.detalleServicio;

      },
      (error: any) => {
        this.sending = false;
        this._snackBar.open('no guardado.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
  saveStatus1() {
    this.sending = true;
    const data = this.solicitud.value;

    const id = data.id ? `id: ${data.id},` : '';
    const status = data.status !== '' && data.status !== null ? `status: 2,` : `status: 2,`;
    const queryParams = `${id} afiliacion_id: ${this.coreService.currentUser.persona.afiliacion_id}   ${status}`;
    const queryProps = 'id, afiliacion_id';
    this.apiService.setData(queryProps, queryParams, 'savePersona').subscribe(

      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        console.log(queryParams)
        // this.close(response.data.saveObs);
        this.loadDataPersona(1);
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
  totalServicio = 0;
  loadDetalleServicio() {
    console.log('loading records...');

    this.loadingRecords = true;
    // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `id_afiliacion: ${this.coreService.currentUser.persona.afiliacion_id} `;
    const queryProps =
      'id, id_afiliacion, id_servicio, cantidad, nombre, paquete, numero_empleados, unidad, obs, valor, created_at, servicio{id, nombre}';
      
    this.apiService.getData(queryProps, queryParams, 'detalleServicio').subscribe(

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
  imagenSS: any[] = []
  openDocumentosModalIcon() {
    const dialogRef = this.dialog.open(CargarIconoComponent, {
      width: '670px',
      height: 'auto',
      maxHeight: '800px',
      panelClass: 'custom-dialog-container',
      data: {
        ss: this.coreService.currentUser.persona.afiliacion_id,
        imagen: this.coreService.currentUser.persona.imagen,
        persona: 1
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.getRecordMultimedia();
      this.currentRecord.imagen;
      this.loadDataPersona(result);
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

}
