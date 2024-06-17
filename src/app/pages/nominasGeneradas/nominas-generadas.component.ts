import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import moment from 'moment';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'app/core/api/api.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';

import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { empleado } from 'app/models/empleado';
import { RecordsService } from '../records.service';
import { CredentialsService } from 'app/core/credentials.service';
import { environment } from 'environments/environment';
import { UserService } from 'app/core/user/user.service';
import { CargarDocumentosComponent } from 'app/modals/cargarDocumentos/cargarDocumentos.component';
import { selectPeriodoMesComponent } from 'app/modals/selectPeriodoMes/selectPeriodoMes.component';

// import { selectPeriodoMesComponent } from 'src/app/modals/selectPeriodoMes/selectPeriodoMes.component';
// import { CambiarLiquidacionComponent } from 'src/app/modals/cambiarLiquidacion/cambiarLiquidacion.component';
// import { CargarDocumentosComponent } from 'src/app/modals/cargarDocumentos/cargarDocumentos.component';

export interface PeriodicElement {
  periodo: string;
  f_creacion: string;
  pago_ss: string;
  o_ingreso: string;
  h_extra: string;
  deducciones: string;
  total_pagar: string;
  empleados:string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {periodo:"1 al 15 de enero", empleados:"11", f_creacion:"$ 1.200.000", pago_ss:"$ 252.000", o_ingreso:"$ 56.000", h_extra:"$ 85.000", deducciones:" $ 115.000", total_pagar:"$1.480.000"},
  {periodo:"15 al  30 de enero", empleados:"11", f_creacion:"$ 1.200.000", pago_ss:"$ 252.000", o_ingreso:"$ 56.000", h_extra:"$ 85.000", deducciones:" $ 115.000", total_pagar:"$1.480.000"}
];

@Component({
  selector: 'vex-nominas-generadas',
  templateUrl: './nominas-generadas.component.html',
  styleUrls: ['./nominas-generadas.component.scss']
})
export class NominasGeneradasComponent implements OnInit {
  id = '';
  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 50, 100];
  orderBy = 'created_at';
  order = 'asc';
  limit = 10;
  offset = 0;
  total: number;

  total1: number;
  data: empleado[] = [];

  displayedColumns: string[] = ['periodo', 'empleados', 'salarios',   'pago_ss',   'deducciones', 'total_pagar', 'status', 'acciones'];
  dataSource = ELEMENT_DATA;

  loadingRecords: boolean;

  filters = new FormGroup({
    search: new FormControl('', []),
    date: new FormControl('', [])
  });
  @ViewChild('search', { static: false }) searchEl: ElementRef;
  public keyUp = new Subject<any>();
  afiliacion_id= '';
  dataNomina: any [] = [];
  resultsLengthTotal: any;
  totalNomina: number;
  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private apiService: ApiService,
    // private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private recordsService: RecordsService,
    private fb: FormBuilder,
    private credentialsService: CredentialsService,
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
  ngOnInit(): void 
  {
    this.loadDataEmpresa();
    this.loadEmpleadoPaginator();
    this.loadNominaPaginator();
    this.id = this.route.snapshot.paramMap.get('id')
    this.afiliacion_id = this.route.snapshot.paramMap.get('afiliacion_id')
  }
  // selectDetails(empresa: any) {
  //   this.router.navigate(['/app/liquidarnuevanomina', empresa.id, empresa.afiliacion_id]);
  // }
  openPresupuesto(element) {
    // const win = window.open(`http://localhost:8000/nomina/${this.id = element.afiliacion_id}/${element.t_valorSS}/${element.nombre_periodo}`, '_blank');
    const win = window.open(`http://api.soyasesorias.co/nomina/${this.id = element.afiliacion_id}/${element.t_valorSS}/${element.id}`, '_blank');
    win.focus();
  }

  openTirilla(data) {
 
      this.dataNomina.forEach(element => {
        const win = window.open(`${environment.serverUrl}/desprendible/${element.id}`, '_blank');
      win.focus();

    });
    
  }

  loadNominaPaginator() {
    this.loadingRecords = true;
    const date =
      this.filters.value.date !== '' && this.filters.value.date !== null
        ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
        : '';
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `afiliacion_id: ${this._userService?.currentUser?.empresa?.afiliacion_id}, limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date}`;
    const queryProps =
      'data{ id, detalleNomina{id, nomina_id, empresa_id, empleado_id, ss, ibc, salud, pension, arl, ccf, sena, icdf, dias_laborados, otros_ingresos, horas_extras, deducciones,  riesgo },  empresa{id, periodo, afiliacion_id, contacto, telContacto, tipoEmpresa, razon_social, direccion, email, departamento, ciudad, numDocumento, dv, telEmpresaMovil, telEmpresaFijo, representanteLegal, contacto, email_responsable, email_contacto, telefono_responsable, arl, riesgo, caja_cf }, empresa_id, periodo, nombre_periodo, numEmpleado, valorTotal, t_valorSS, t_valorHorasEx, t_otrosPagos, t_deducciones, status, numPlanilla, salario_dias, created_at, afiliacion_id, }, total';
    this.apiService.getData(queryProps, queryParams, 'nominaPagination').
      subscribe((response: any) => {

        this.dataNomina = response.data.nominaPagination.data;
        this.resultsLengthTotal = response.data.nominaPagination.total;
        // this.empleados = response.data.nominaPagination.data.afiliacion_id;
        this.loadingRecords = false;
        this.totalNomina = this.dataNomina.reduce((
          acc,
          obj,
        ) => acc + (obj.detalleNomina.ibc ), 0
        );
        console.log('nominas', this.dataNomina)
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
  currentRecord: any = null;
  setRecordFromCache() {
    let currentRecord = this.recordsService.getCurrentRecordFromCache();

    this.setCurrentRecord(currentRecord);
  }
  setCurrentRecord(empresa: any) {
    this.currentRecord = empresa;
    console.log('dato empresa', empresa)
    if (empresa) {
      // this.solicitud.setValue({

      //   razon_social: empresa.razon_social ? empresa.razon_social.replace(/<br>/g, '\n') : '',
      //   direccion: empresa.direccion ? empresa.direccion.replace(/<br>/g, '\n') : '',
      //   email: empresa.email ? empresa.email.replace(/<br>/g, '\n') : '',
      //   departamento: empresa.departamento ? empresa.departamento.toString() : '',
      //   ciudad: empresa.ciudad ? empresa.ciudad.replace(/<br>/g, '\n') : '',
      //   categoria: empresa.categoria ? empresa.categoria.toString() : '',
      //   numDocumento: empresa.numDocumento ? empresa.numDocumento.replace(/<br>/g, '\n') : '',
      //   dv: empresa.dv ? empresa.dv.replace(/<br>/g, '\n') : '',
      //   telEmpresaMovil: empresa.telEmpresaMovil ? empresa.telEmpresaMovil.replace(/<br>/g, '\n') : '',
      //   telEmpresaFijo: empresa.telEmpresaFijo ? empresa.telEmpresaFijo.replace(/<br>/g, '\n') : '',
      //   representanteLegal: empresa.representanteLegal ? empresa.representanteLegal.replace(/<br>/g, '\n') : '',
      //   contacto: empresa.contacto ? empresa.contacto.replace(/<br>/g, '\n') : '',
      //   email_responsable: empresa.email_responsable ? empresa.email_responsable.replace(/<br>/g, '\n') : '',
      //   email_contacto: empresa.email_contacto ? empresa.email_contacto.replace(/<br>/g, '\n') : '',
      //   telefono_responsable: empresa.telefono_responsable ? empresa.telefono_responsable.replace(/<br>/g, '\n') : '',
      //   telContacto: empresa.telContacto ? empresa.telContacto.replace(/<br>/g, '\n') : '',
      //   arl: empresa.arl ? empresa.arl.toString() : '',
      //   tipoEmpresa: empresa.tipoEmpresa ? empresa.tipoEmpresa.toString() : '',
      //   riesgo: empresa.riesgo ? empresa.riesgo.toString() : '',
      //   periodo: empresa.periodo ? empresa.periodo.toString() : '',
      //   caja_cf: empresa.caja_cf ? empresa.caja_cf.replace(/<br>/g, '\n') : '',
      //   obs: empresa.obs ? empresa.obs.replace(/<br>/g, '\n') : '',
      // });
    }

  }
  dataEmpresa: any[] = [];
  loadDataEmpresa() {
    // console.log('loading records...');

    // this.loadingRecords = true;
    // // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    // const queryParams = `afiliacion_id: ${this.afiliacion_id = this.route.snapshot.paramMap.get('afiliacion_id')}`;
    // const queryProps =
    //   'id, periodo, categoria, imagen, detalleServicio{id, id_afiliacion, id_servicio,  status servicio{id, nombre} }, updated_at, afiliacion_id, contacto, telContacto, tipoEmpresa, razon_social, direccion, email, departamento, ciudad, numDocumento, dv, telEmpresaMovil, telEmpresaFijo, representanteLegal, contacto, email_responsable, email_contacto, telefono_responsable, arl, riesgo, caja_cf ';
    // this.apiService.getEmpresa(queryParams, queryProps).subscribe(
    //   (response: any) => {
    //     this.dataEmpresa = response.data.empresa;
    //     this.apiService.setEmpresa(response.data.empresa);
    //     if (response.data.empresa && response.data.empresa.length > 0) {
    //       this.setCurrentRecord(response.data.empresa[0]);
    //     }
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
  openDocumento(planilla: any) {
    const dialogRef = this.dialog.open(CargarDocumentosComponent, {
      width: '650px',
      height: 'auto',
      maxHeight: '850px',
      data: {
        planilla: planilla,
        // afiliacion: this.route.snapshot.paramMap.get('afiliacion_id')
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.router.navigate(['/app/liquidarnuevaplanilla', result.id]);
      }

    });
  }
  openSelectPeriodo(empresa: any) {
    const dialogRef = this.dialog.open(selectPeriodoMesComponent, {
      width: 'auto',
      height: 'auto',
      maxHeight: '850px',
      data: {
        empresa: this._userService?.currentUser.empresa.id,
        afiliacion: this._userService?.currentUser.empresa.afiliacion_id,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.router.navigate(['./liquidarnuevanomina', result.id]);
      }
  
    });
  }
  selectDetails(result: any) {
    this.router.navigate(['./liquidarnuevanomina', result.id]);
  }
  
  openSelectLiquidacionModal(id: any) {
    // const dialogRef = this.dialog.open(CambiarLiquidacionComponent, {
    //   width: '650px',
    //   height: 'auto',
    //   maxHeight: '850px',
    //   data: {

    //     id: id,

    //     // valorTotal: this.totalNomina,

    //     // totalDiasValor: this.totalDiasValor,

    //     // totalOtros: this.totalOtros,

    //     // horasExtrasTotal: this.horasExtrasTotal,

    //     // DeduccionesTotal: this.DeduccionesTotal,

    //     // totalValorSS: this.totalPlanilla,

    //     // CesantiasTotal: this.CesantiasTotal,

    //     // totalIntereses: this.totalIntereses,

    //     // totalVacaciones: this.totalVacaciones,

    //     // numEmpleado: this.currentRecord.detalleNomina.length,

    //     // totalARL: this.totalARL,

    //     // totalSalud: this.totalSalud,

    //     // totalPension: this.totalPension,

    //     // totalCCF: this.totalCCF,

    //     // totalSENA: this.totalSENA,

    //     // totalICBF: this.totalICBF,

    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   // this.loadNomina();
    //   // this.loadNominaPaginator();
    //   // this.loadDetalleNomina()
    // });
  }

  loadEmpleadoPaginator() {
    this.loadingRecords = true;
    const date =
      this.filters.value.date !== '' && this.filters.value.date !== null
        ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
        : '';
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `id_afiliacion: ${this.id = this.route.snapshot.paramMap.get('id')}, limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date}`;
    const queryProps =
      'data{ id, id_afiliacion, status, email, cargo, tipoContrato, tipoVinculacion, aporte_activacion, tipoAfiliacion, primer_nombre, segundo_nombre, primer_apellido, fecha_ingreso, segundo_apellido, tipo_documento, numero_documento, ciudad, departamento, direccion, movil, eps, f_de_pensiones, fecha_retiro, salario_base, arl, riesgo, caja_cf, sucursal, subsidio_transporte, periodo_de_pago }, total, total1';
    this.apiService.getData(queryProps, queryParams, 'empleadoPagination').
      subscribe((response: any) => {
    
        this.total = response.data.empleadoPagination.total;
        this.total1 = response.data.empleadoPagination.total1;
        this.data = response.data.empleadoPagination.data;
        this.resultsLength = response.data.empleadoPagination.total;
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

  delete(income: any) {

    const r = confirm('¿DESEAS ELIMINAR LA NOMINA?');
    if (r === true) {
      this.loadingRecords = true;

      // const id = income ? `id: ${income.id},` : '';
      const queryParams = `id:${income.id}, delete: 1 `;
      const queryProps = 'id ';
      this.apiService.setData(queryProps, queryParams, 'SaveNomina').
        subscribe((response: any) => {
      // this.apiService.SaveNomina(queryParams, queryProps).subscribe(
      //   (response: any) => {
          this.loadingRecords = false;

          this.loadEmpleadoPaginator();
          this.loadNominaPaginator();

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
}
