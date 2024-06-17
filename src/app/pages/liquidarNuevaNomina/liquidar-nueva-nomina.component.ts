import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import moment from 'moment';
import * as XLSX from 'xlsx';
// import { CambiarLiquidacionComponent } from 'src/app/modals/cambiarLiquidacion/cambiarLiquidacion.component';
import { HbModalComponent } from 'app/modals/hbModal/hb-modal.component';
import { ApiService } from 'app/core/api/api.service';
import { RecordsService } from '../records.service';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { htoModalComponent } from 'app/modals/htoModal/hto-modal.component';
import { DeduccionesModal } from 'app/modals/deduccionesModal/deduccionesModal.component';
import { empleado } from 'app/models/empleado';
import { DiasLaboradosComponent } from 'app/modals/diasLaborados/diasLaborados-modal.component';
import { ingresoNocComponent } from 'app/modals/ingreso-noc/ingreso-noc.component';
import { environment } from 'environments/environment';


export interface PeriodicElement {
  nombre: string;
  salario_base: string;
  ss: string;
  o_ingreso: string;
  h_extras: string;
  deducciones: string;
  total_pagar: string; 
}

const ELEMENT_DATA: PeriodicElement[] = [
  {nombre:"DIEGO ALEJANDRO MEDINA", salario_base:"$ 1.200.000", ss:" $ 252.000", o_ingreso:" $ 56.000", h_extras: "$ 85.000", deducciones:"$ 115.000 ", total_pagar:"$1.480.000"},
  {nombre:"MARTIN ALFONSO SANABRIA", salario_base:"$ 1.500.000", ss:" $ 285.000", o_ingreso:" $ 1.785.000", h_extras: "$ 85.000", deducciones:"$ 115.000 ", total_pagar:"$1.480.000"}
];


@Component({
  selector: 'vex-liquidar-nueva-nomina',
  templateUrl: './liquidar-nueva-nomina.component.html',
  styleUrls: ['./liquidar-nueva-nomina.component.scss']
})
export class LiquidarNuevaNominaComponent implements OnInit {

  dataNomina: any[] = [];
  displayedColumns: string[] = ['nombre', 'salario_base', 'aux', 'ss', 'dias', 'o_ingreso', 'n_ingreso', 'h_extras', 'deducciones', 'total_pagar', 'acciones'];
  displayedColumns2: string[] = ['nombre', 'salario_base', 'dias', 'ss', 'salud', 'o_ingreso', 'h_extras', 'deducciones', 'total_pagar', 'acciones', 'sena', 'icdf', 'total'];
  displayedColumns3: string[] = ['nombre', 'total_pagar', 'salario_base', 'aux', 'ss', 'prima', 'dias', 'o_ingreso', 'deducciones', 'h_extras', 'acciones'];
  dataSource = ELEMENT_DATA;
  loadingRecords: boolean;
  resultsLengthTotal = 0;
  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 50, 100];
  orderBy = 'created_at';
  order = 'desc';
  limit = 10;
  offset = 0;
  @ViewChild('search', { static: false }) searchEl: ElementRef;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('PLANILLA') planilla: ElementRef;
  @ViewChild('PRESTACIONES') prestaciones: ElementRef;
  public keyUp = new Subject<any>();
  id= '';
  total1: number;
  total: number;
  data: empleado[] = [];
  resultsLengthNomina= 0;
  empleados: number;
  dataNominaOne: any [] = [];
  currentRecord: any = null;
  afiliacion_id= '';
  totalNomina: number;
  dataNominaDetalle: any[] = [];
  dataId: any;
  sending: boolean;
  totalOtros: number;
  totalNominaSS: any;
  horasExtrasTotal: any;
  DeduccionesTotal: any;
  totalPlanilla: any;
  totalDiasValor: any;
  CesantiasTotal: any;
  totalIntereses: any;
  totalVacaciones: any;
  totalSalud: any;
  totalPension: any;
  totalARL: any;
  totalCCF: any;
  totalSENA: any;
  totalICBF: any;
  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private recordsService: RecordsService,
    private fb: FormBuilder,
    private credentialsService: AuthService,
    private _location: Location,
    private coreService: UserService,
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

  eliminar() {
    return 1 
    // this.coreService.currentUser.roles.eliminar
  }
  modificar() {
    return 1 
    // this.coreService.currentUser.roles.modificar
  }

  filters = new FormGroup({
    search: new FormControl('', []),
    date: new FormControl('', [])
  });
  openDesprendible(nomina: any) {
    // const win = window.open(`http://localhost:8000/presupuesto/${this.id = this.route.snapshot.paramMap.get('id')}`, '_blank');
    const win = window.open(`${environment.serverUrl}/desprendible/${nomina}`, '_blank');
    win.focus();
  }
   goBack(){
   this._location.back();
 }
  finalizar() {
    const r = confirm('¿ESTAS SEGURO QUE DESEAS GENERAR LA CUENTA DE COBRO?');
    if (r === true) {
      this.router.navigate(['/app/records']);
      this.save();
    }
  }
  exportNomina() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);//converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Nomina.xlsx');

  }
  exportPlanilla() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.planilla.nativeElement);//converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Planilla.xlsx');

  }
  exportPrestaciones() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.prestaciones.nativeElement);//converts a DOM TABLE element to a worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Prestaciones.xlsx');

  }
  exportTodo() {
    const workSheet = XLSX.utils.json_to_sheet(this.currentRecord.detalleNomina,
      // { header: ['dataprop1', 'dataprop2'] }
    );
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'Planilla.xlsx');
  }

  DetalleEmpleado(data: any){
    this.router.navigate(['/app/empleadoinfo', data]);
  }
  save() {
    const r = confirm('¿ESTAS SEGURO QUE DESEAS LIQUIDAR LA NOMINA?');
    if (r === true) {
      const id = `id: ${this.route.snapshot.paramMap.get('id')},` ;
      const valorTotal =  this.totalNomina !== null ? `valorTotal: ${this.totalNomina},` : `valorTotal: 0,`;
      const salario_dias = this.totalDiasValor !== null ? `salario_dias: ${this.totalDiasValor},` : `salario_dias: 0,`;
      const t_otrosPagos = this.totalOtros !== null ? `t_otrosPagos: ${this.totalOtros},` : `t_otrosPagos: 0,`;
      const t_valorHorasEx = this.horasExtrasTotal !== null ? `t_valorHorasEx: ${this.horasExtrasTotal},` : `t_valorHorasEx: 0,`;
      const t_deducciones = this.DeduccionesTotal !== null ? `t_deducciones: ${this.DeduccionesTotal},` : `t_deducciones: 0,`;
      const t_valorSS = this.totalPlanilla + this.totalNominaSS !== null ? `t_valorSS: ${this.totalPlanilla + this.totalNominaSS},` : `t_valorSS: 0,`;
      const numEmpleado = this.currentRecord.detalleNomina.length !== null ? `numEmpleado: ${this.currentRecord.detalleNomina.length},` : `numEmpleado: 0,`;
      const totalARL = this.totalARL !== null ? `totalARL: ${this.totalARL},` : `totalARL: 0,`;

      const totalSalud = this.totalSalud !== null ? `totalSalud: ${this.totalSalud},` : `totalSalud: 0,`;

      const totalPension = this.totalPension !== null ? `totalPension: ${this.totalPension},` : `totalPension: 0,`;

      const totalCCF = this.totalCCF !== null ? `totalCCF: ${this.totalCCF},` : `totalCCF: 0,`;

      const totalSENA = this.totalSENA !== null ? `totalSENA: ${this.totalSENA},` : `totalSENA: 0,`;

      const totalICBF = this.totalICBF !== null ? `totalICBF: ${this.totalICBF},` : `totalICBF: 0,`;

      const totalVacaciones = this.totalVacaciones !== null ? `totalVacaciones: ${this.totalVacaciones},` : `totalVacaciones: 0,`;

      const totalIntereses = this.totalIntereses !== null ? `totalIntereses: ${this.totalIntereses},` : `totalIntereses: 0,`;

      const CesantiasTotal = this.CesantiasTotal !== null ? `CesantiasTotal: ${this.CesantiasTotal},` : `CesantiasTotal: 0,`;
      
      const seleccion =  `seleccion: ${3},`;
      
      const queryParams = ` ${id} status: 1, ${seleccion} ${salario_dias} ${valorTotal} ${t_otrosPagos} ${t_valorHorasEx} ${t_deducciones} ${t_valorSS} ${numEmpleado}${totalARL} ${totalSalud} ${totalPension} ${totalCCF} ${totalSENA} ${totalICBF} ${totalVacaciones} ${totalIntereses} ${CesantiasTotal} `;
    const queryProps = 'id';
      this.apiService.setData(queryProps, queryParams, 'SaveNomina').subscribe(
  
      (response: any) => {
        this.sending = false;
        this.dataId = response.data.SaveNomina;
        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        console.log(this.dataId)
        this.goBack()
        // this.router.navigate(['/app/administration']);
   
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
  
  loadDetalleNomina() {

    this.loadingRecords = true;
    const queryParams = `nomina_id: ${this.id = this.route.snapshot.paramMap.get('id')},`;
    const queryProps =
      'id, totalNomina, cesantias, intereses, vacaciones, dias_valor, ibc, ibl, ingreso_noc, totalPlanilla, personaNomina{id, primer_nombre,  primer_apellido,  salario_base}, empleadoNomina{id, aporte_activacion, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, salario_base}, nomina_id, empresa_id, empleado_id, ss, ibc, ibl, salud, pension, arl, ccf, sena, icdf, dias_laborados, otros_ingresos, horas_extras, deducciones,  riesgo ';

    this.apiService.getData(queryProps, queryParams, 'getDetalleNomina').subscribe(

      (response: any) => {

        this.dataNominaDetalle = response.data.getDetalleNomina;
        this.empleados = response.data.getDetalleNomina.length;
        this.loadingRecords = false;
        this.totalNomina = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.totalNomina > 0 ? obj.totalNomina ++ : 0), 0
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

        this.CesantiasTotal = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.cesantias++), 0
        );
        this.totalIntereses = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.intereses++), 0
        );
        this.totalVacaciones = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.vacaciones++), 0
        );


        this.totalSalud = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.salud++), 0
        );
        this.totalPension = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.pension++), 0
        );
        this.totalARL = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.riesgo++), 0
        );
        this.totalCCF = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.ccf++), 0
        );

        this.totalSENA = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.sena++), 0
        );
        this.totalICBF = this.dataNominaDetalle.reduce((
          acc,
          obj,
        ) => acc + (obj.icdf++), 0
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
  openSelectLiquidacionModal(pago) {
    // const dialogRef = this.dialog.open(CambiarLiquidacionComponent, {
    //   width: '650px',
    //   height: 'auto',
    //   maxHeight: '850px',
    //   data: {
       
    //     id : this.route.snapshot.paramMap.get('id'),

    //     valorTotal: this.totalNomina,
       
    //     totalDiasValor: this.totalDiasValor,
       
    //     totalOtros: this.totalOtros,
       
    //     horasExtrasTotal: this.horasExtrasTotal,
       
    //     DeduccionesTotal: this.DeduccionesTotal,
       
    //     totalValorSS: this.totalPlanilla,
       
    //     CesantiasTotal: this.CesantiasTotal,
       
    //     totalIntereses: this.totalIntereses,
       
    //     totalVacaciones: this.totalVacaciones,
       
    //     numEmpleado: this.currentRecord.detalleNomina.length,

    //     totalARL: this.totalARL,

    //     totalSalud: this.totalSalud,

    //     totalPension: this.totalPension,

    //     totalCCF: this.totalCCF,

    //     totalSENA: this.totalSENA,

    //     totalICBF: this.totalICBF,
      
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   this.loadNomina();
    //   this.loadNominaPaginator();
    //   this.loadDetalleNomina()
    // });
  }
  openDeduccionesEditModal(edit) {
    const dialogRef = this.dialog.open(DeduccionesModal, {
      width: '650px',
      height: 'auto',
      maxHeight: '850px',
      data: {
        edit: edit
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadNomina();
      this.loadNominaPaginator();
      this.loadDetalleNomina()
    });
  }
  openDeduccionesModal(empleado) {
    const dialogRef = this.dialog.open(DeduccionesModal, {
      width: '650px',
      height: 'auto',
      maxHeight: '850px',
      data: {
        empleado: empleado
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadNomina();
      this.loadNominaPaginator();
      this.loadDetalleNomina()
    });
  }
  openDiasModal(empleado) {
    const dialogRef = this.dialog.open(DiasLaboradosComponent, {
      width: '650px',
      height: 'auto',
      maxHeight: '850px',
      data: {
        empleado: empleado
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadNomina();
      this.loadNominaPaginator();
      this.loadDetalleNomina()
    });
  }
  openOtrosModal(empleado) {
    const dialogRef = this.dialog.open(HbModalComponent, {
      width: '650px',
      height: '400px',
      maxHeight: '850px',
      data: {
        empleado: empleado
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadNomina();
      this.loadNominaPaginator();
      this.loadDetalleNomina()
    });
  }
  openOtrosNoModal(empleado) {
    const dialogRef = this.dialog.open(ingresoNocComponent, {
      width: '650px',
      height: '400px',
      maxHeight: '850px',
      data: {
        empleado: empleado
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadNomina();
      this.loadNominaPaginator();
      this.loadDetalleNomina()
    });
  }
  openOtrosNoEditModal(edit) {
    const dialogRef = this.dialog.open(ingresoNocComponent, {
      width: '650px',
      height: '400px',
      maxHeight: '850px',
      data: {
        edit: edit
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadNomina();
      this.loadNominaPaginator();
      this.loadDetalleNomina()
    });
  }
  openOtrosEditModal(edit) {
    const dialogRef = this.dialog.open(HbModalComponent, {
      width: '650px',
      height: '400px',
      maxHeight: '850px',
      data: {
        edit: edit
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadNomina();
      this.loadNominaPaginator();
      this.loadDetalleNomina()
    });
  }
  openHorasModal(empleado) {
    const dialogRef = this.dialog.open(htoModalComponent, {
      width: '650px',
      height: '500px',
      maxHeight: '850px',
      data: {
        empleado: empleado
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadNomina();
      this.loadNominaPaginator();
      this.loadDetalleNomina()
    });
  }
  openHorasModalEdit(edit) {
    const dialogRef = this.dialog.open(htoModalComponent, {
      width: '650px',
      height: '550px',
      maxHeight: '850px',
      data: {
        edit: edit
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.loadNomina();
      this.loadNominaPaginator();
      this.loadDetalleNomina()
    });
  }
  loadNominaPaginator() {
    this.loadingRecords = true;
    const date =
      this.filters.value.date !== '' && this.filters.value.date !== null
        ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
        : '';
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `id: ${this.id = this.route.snapshot.paramMap.get('id')}, limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date}`;
    const queryProps =
      'data{ id,  empresa{id, periodo, afiliacion_id, contacto, telContacto, tipoEmpresa, razon_social, direccion, email, departamento, ciudad, numDocumento, dv, telEmpresaMovil, telEmpresaFijo, representanteLegal, contacto, email_responsable, email_contacto, telefono_responsable, arl, riesgo, caja_cf }, empresa_id, periodo, nombre_periodo, numEmpleado, valorTotal, t_valorSS, t_valorHorasEx, t_otrosPagos, t_deducciones, status, numPlanilla, created_at, afiliacion_id, }, total';

    this.apiService.getData(queryProps, queryParams, 'nominaPagination').subscribe(

      (response: any) => {

        this.dataNomina = response.data.nominaPagination.data;
        this.resultsLengthTotal = response.data.nominaPagination.total;
        // this.empleados = response.data.nominaPagination.data.afiliacion_id;
        this.loadingRecords = false;
      
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
  openTirilla() {

    this.currentRecord.detalleNomina.forEach(element => {
      const win = window.open(`${environment.serverUrl}/desprendible/${element.id}`, '_blank');
      win.focus();

    });

  }
  loadNomina() {
    
    this.loadingRecords = true;
    const queryParams = `id: ${this.id = this.route.snapshot.paramMap.get('id')},`;
    const queryProps =
      'id, detalleNomina{id, dias_valor, totalNomina, cesantias, intereses, vacaciones, indemnizacion, aux_transporte, salario_base, totalPlanilla, ingreso_noc, personaNomina{id, primer_nombre,  primer_apellido,  salario_base}, empleadoNomina{id, aporte_activacion, subsidio_transporte, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, salario_base, numero_documento}, nomina_id, empresa_id, empleado_id, ss, ibc, ibl, salud, pension, arl, ccf, sena, icdf, dias_laborados, otros_ingresos, horas_extras, deducciones,  riesgo },  empresa{id, periodo, afiliacion_id, contacto, telContacto, tipoEmpresa, razon_social, direccion, email, departamento, ciudad, numDocumento, dv, telEmpresaMovil, telEmpresaFijo, representanteLegal, contacto, email_responsable, email_contacto, telefono_responsable, arl, riesgo, caja_cf }, empresa_id, periodo, nombre_periodo, numEmpleado, valorTotal, t_valorSS, t_valorHorasEx, t_otrosPagos, t_deducciones, status, numPlanilla, created_at, afiliacion_id, ';
    this.apiService.getData(queryProps, queryParams, 'getNomina').subscribe(

      (response: any) => {

        this.dataNominaOne = response.data.getNomina;
        this.empleados = response.data.getNomina.id;
        this.loadingRecords = false;

        if (response.data.getNomina && response.data.getNomina.length > 0) {
          this.setCurrentRecord(response.data.getNomina[0]);
        }

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
  setRecordFromCache() {
    let currentRecord = this.recordsService.getCurrentRecordFromCache();

    this.setCurrentRecord(currentRecord);
  }
  setCurrentRecord(nomina: any) {
    this.currentRecord = nomina;
    console.log('dato nomina', nomina)
   
  }

  loadEmpleadoPaginator() {
    this.loadingRecords = true;
    const date =
      this.filters.value.date !== '' && this.filters.value.date !== null
        ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
        : '';
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `id_afiliacion: ${this.afiliacion_id = this.route.snapshot.paramMap.get('afiliacion_id')}, limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date}`;
    const queryProps =
      'data{ id, id_afiliacion, status, email, cargo, tipoContrato, tipoVinculacion, aporte_activacion, tipoAfiliacion, primer_nombre, segundo_nombre, primer_apellido, fecha_ingreso, segundo_apellido, tipo_documento, numero_documento, ciudad, departamento, direccion, movil, eps, f_de_pensiones, fecha_retiro, salario_base, arl, riesgo, caja_cf, sucursal, subsidio_transporte, periodo_de_pago }, total, total1';
    
      this.apiService.getData(queryProps, queryParams, 'getEmpleadoPagination').subscribe(
   
      (response: any) => {
        this.total = response.data.empleadoPagination.total;
        this.total1 = response.data.empleadoPagination.total1;
        this.data = response.data.empleadoPagination.data;
        this.resultsLengthNomina = response.data.empleadoPagination.total;
        this.loadingRecords = false;
        console.log('estos son los datos para la afiliacion ', this.data)

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
  ngOnInit(): void {
    this.setRecordFromCache();
    this.id = this.route.snapshot.paramMap.get('id')
    this.loadNominaPaginator();
    this.loadDetalleNomina()
    // this.loadEmpleadoPaginator();
    this.loadNomina();
    console.log('datos empleado ', this.totalNomina)
  }

}
