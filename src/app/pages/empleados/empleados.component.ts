import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

// import baseLineAttachMoney from '@iconify/icons-ic/baseline-attach-money';
// import { ReciboEmpleadoModalComponent } from 'src/app/modals/reciboempleadoModal/recibo-empleado-modal.component';
// import { MatDialog } from '@angular/material/dialog';
// import fileDownload from '@iconify/icons-ic/file-download';
// import search from '@iconify/icons-ic/search';
// import { MatTableDataSource } from '@angular/material/table';
// import { empleado } from 'src/app/models/empleado';
// import { ApiService } from 'src/app/core/api/api.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router, ActivatedRoute } from '@angular/router';
// import { RecordsService } from '../records/records.service';
// import { CredentialsService } from 'src/app/core';
import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import moment from 'moment';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { empleado } from 'app/models/empleado';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'app/core/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'app/core/api/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { user } from 'app/models/user.model';
import { ObsModalEmpleadoComponent } from 'app/modals/obsModalEmpleado/obs-modalEmpleado.component';
// import { ObsModalEmpleadoComponent } from 'src/app/modals/obsModalEmpleado/obs-modalEmpleado.component';
// import twotoneArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
// import { stagger80ms } from 'src/@vex/animations/stagger.animation';
// import { scaleIn400ms } from 'src/@vex/animations/scale-in.animation';
// import { fadeInRight400ms } from 'src/@vex/animations/fade-in-right.animation';
// import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
// import { CargarDocumentosComponent } from 'src/app/modals/cargarDocumentos/cargarDocumentos.component';
// import { CoreService } from 'src/app/core/core.service';



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
  {nombre:"CARLOS  ANDRES GONZALES", n_doc:"135687412", tel:"3185754711", empresa:"ALUMINIOS EL TREBOL", cargo:"AUX. CONTABLE", salario:"$ 1´200.000", estado:"Activo"},
  {nombre:"SADFSDF  SFSFSDF SDFSDSDF", n_doc:"2358996589", tel:"2153668745", empresa:"CASSDFFDS", cargo:"AUX. CONTABLE", salario:"$ 3.000.000", estado:"Activo"},
  {nombre:"SDFSAFSA  SDFSD SDFSDF", n_doc:"3543643541", tel:"564465456", empresa:"SFDFGDSGDS", cargo:"AUX. CONTABLE", salario:"$ 3.000.000", estado:"Activo"}
];

@Component({
  selector: 'vex-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss'],
  animations: [
    // stagger80ms,
    // scaleIn400ms,
    // fadeInRight400ms,
    // fadeInUp400ms
  ]
})
export class EmpleadosComponent implements OnInit {
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
  dataEmpleado: empleado[] = [];
  

  filters = new FormGroup({
    search: new FormControl('', []),
    search2: new FormControl('', []),
    date: new FormControl('', []),
    date2: new FormControl('', []),

  });

  empleado = new FormGroup({
    razon_social: new FormControl('', []),
    contacto: new FormControl('', []),
    telefono: new FormControl('', []),
    email: new FormControl('', []),
    color_asignado: new FormControl('', [])
  });
  userData: any;
  
  searchKeyUp($event: KeyboardEvent): void {
    // console.log($event);
    if ($event.code === 'KeyN' && $event.shiftKey) {
      this.filters.controls.search.setValue('');
      return;
    }

    this.keyUp.next($event);
  }

  searchKeyUp2($event: KeyboardEvent): void {
    // console.log($event);
    if ($event.code === 'KeyN' && $event.shiftKey) {
      this.filters.controls.search2.setValue('');
      return;
    }

    this.keyUp.next($event);
  }
  dateChange(event: any) {
    this.loadEmpleadoPaginator();
  }

  sortRecords(event: MatSort): void {
    this.orderBy = event.active;
    this.order = event.direction;
    this.loadEmpleadoPaginator();
  }
  pageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.loadEmpleadoPaginator();
  }
  changeDateTimeFormat(date: string) {
    return moment(date).format('DD/MM/YYYY');
  }
  afiliacionFilter: any[] = [];
  filterAfiliacion(status) {
    if (status == '0') {
      this.afiliacionFilter = this.dataEmpleado;
      return;
    }
    this.afiliacionFilter = this.dataEmpleado.filter((data: any) => data.status == status);
  }
  displayedColumns: string[] = ['nombre', 'empresa', 'n_doc', 'tel', 'cargo', 'salario', 'estado', 'acciones'];
  public keyUp = new Subject<any>();
  // filters = new FormGroup({
  //   search: new FormControl('', []),
  //   date: new FormControl('', [])
  // });
  @ViewChild('search', { static: false }) searchEl: ElementRef;
  @ViewChild('search2', { static: false }) searchEl2: ElementRef;
  total1: number;
  loadingRecords: boolean;
  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private apiService: ApiService,
    // private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    // private recordsService: RecordsService,
    private fb: FormBuilder,
    private _userService: UserService,
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
        this.filters.controls.search2.setValue(this.searchEl2.nativeElement.value);
        this.loadEmpleadoPaginator();
      });
      

      
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
    const dialogRef = this.dialog.open(ObsModalEmpleadoComponent, {
      width: '1000px',
      height: '600px',
      maxHeight: '850px',
      data: {
        datos
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;
      this.loadEmpleadoPaginator();

    });
  }
  getEstadoClass(estado){
    var text;

    switch (estado) {
        case "Activo":
            text="tag_verde";
            break;
    
        case "Al dia":
            text= "tag_verde";
            break;

        /*
        #Clases disponibles disponibles en style.css
        */
    }

    return text;
}

  empleadoEdit(solicitud: any) {
    this.router.navigate(['/empleadoinfo', solicitud]);
  }
  
  delete(income: any) {

    // const r = confirm('¿DESEAS ELIMINAR EL EMPLEADO?');
    // if (r === true) {
    //   this.loadingRecords = true;

    //   // const id = income ? `id: ${income.id},` : '';
    //   const queryParams = `id:${income.id}, delete: 1 `;
    //   const queryProps = 'id ';

    //   this.apiService.crearEmpleado(queryParams, queryProps).subscribe(
    //     (response: any) => {
    //       this.loadingRecords = false;

    //       this.loadEmpleadoPaginator();

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
  loadEmpleadoPaginator() {
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
    const searchText2 = this.filters.value.search2 !== '' ? `search2: "${this.filters.value.search2}",` : '';
    const queryParams = `id_afiliacion: ${this._userService.currentUser.empresa.afiliacion_id}, limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${searchText2}  ${date} ${date2}`;
    const nombreQuery = 'empleadoPagination'
    const queryProps =
      'pagesData{ id, afiliacion_status, planilla_status, contrato_status, incapacidad_status, examen_status, empresa{id, razon_social, detalleServicio4{id, nombre, paquete, valor} }, id_afiliacion, status, email, cargo, tipoContrato, tipoVinculacion, aporte_activacion, tipoAfiliacion, primer_nombre, segundo_nombre, primer_apellido, fecha_ingreso, segundo_apellido, tipo_documento, numero_documento, ciudad, departamento, direccion, movil, eps, f_de_pensiones, fecha_retiro, salario_base, arl, riesgo, caja_cf, sucursal, subsidio_transporte, periodo_de_pago, created_at }, totalPage';

    this.apiService.getData(queryProps, queryParams, nombreQuery).subscribe(
      (response: any) => {
        this.dataEmpleado = response.data.empleadoPagination.pagesData;
        this.afiliacionFilter = response.data.empleadoPagination.pagesData;
        this.dataSource.data = this.dataEmpleado;
        this.resultsLength = response.data.empleadoPagination.totalPage;
        this.loadingRecords = false;
        console.log('estos son los datos para la afiliacion ', this.dataEmpleado)

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

  openEmpleadosModal() {
    // const dialogRef = this.dialog.open(ReciboEmpleadoModalComponent, {
    //     width: '1500px',
    //     height: '800px',
    //     maxHeight: '850px',
    //   panelClass: 'custom-dialog-container',  
    //     data: {
    //     }
    // });
    // dialogRef.afterClosed().subscribe((result: any) => {
    //     if (!result) return;
    //     //this.loadRecords();
    //     console.log(result);

    // });
}


  openDocumentosModal(empleado: any) {
    // const dialogRef = this.dialog.open(CargarDocumentosComponent, {
    //   width: '1200px',
    //   height: '600px',
    //   maxHeight: '800px',
    //   panelClass: 'custom-dialog-container',
    //   data: {
    //     general: empleado
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (result) {
    //     // let match = this.imagenContrato.filter((value) => {
    //     //   return value.id == result.id;
    //     // });

    //     // console.log(match);
    //     console.log(result);
    //     // console.log(this.imagenContrato);
    //   }


    // });
  }

  ngOnInit(): void {
    this.loadEmpleadoPaginator()
    this.dataSource = new MatTableDataSource();
    const nombreQuery = 'me';
    const queryParams = `search: " " `;
    const queryProps = 'id,name,email, avatar, empresa{id, razon_social, primer_nombre, afiliacion_id}';

    this.apiService.getData(queryProps, queryParams, nombreQuery).
      subscribe((response) => {
        this._userService.setUser(new user().deserialize(response.data.me));
        this.userData = response.data.me;
      });
  }

}
