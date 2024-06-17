import { Component, OnInit, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
// import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { Router } from '@angular/router';
import * as moment from 'moment';
// import { IncomeModalComponent } from '@app/components/modals/incomeModal/income-modal.component';

import { cuentaCobro } from 'app/models/cuentaCobro';
import { ApiService } from 'app/core/api/api.service';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { IncomeModalComponent } from 'app/modals/incomeModal/income-modal.component';
// import { DetallePagosModalComponent } from 'app/modals/detallePagos/detallePagos.component';
// import { CambiarLiquidacionComponent } from 'app/modals/cambiarLiquidacion/cambiarLiquidacion.component';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'app/core/user/user.service';

export interface PeriodicElement {
  periodo: string;
  f_creacion: string;
  pago_ss: string;
  o_ingreso: string;
  h_extra: string;
  deducciones: string;
  total_pagar: string;
  empleados: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  { periodo: "CUCUTA SAS", empleados: "111111", f_creacion: "05/09/2021", pago_ss: "110", o_ingreso: "256000", h_extra: "1", deducciones: " $ 115.000", total_pagar: "$1.480.000" },
  { periodo: "BOX MEDIA", empleados: "222222", f_creacion: "05/09/2021", pago_ss: "122", o_ingreso: "556000", h_extra: "2", deducciones: " $ 115.000", total_pagar: "$1.480.000" }
];
@Component({
  selector: 'app-administration',
  templateUrl:  './administration.component.html',
  styleUrls: ['./administration.component.scss'],
  animations: [

  ]
})

export class AdministrationComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'company', 'nit', 'tipo', 'date', 'fecha_pago', 'fecha', 'date2', 'concept',  'value', 'status', 'options'];
  data: cuentaCobro[] = [];

  searchText = '';
  loadingRecords = false;
  totalIncome: 0;

  patientsModalIsOpen = false;

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  orderBy = 'status';
  order = 'desc';
  limit = 100;
  offset = 0;
  dataSource: MatTableDataSource<cuentaCobro> | null;
  filters = new FormGroup({
    search: new FormControl('', []),
    date: new FormControl('', []),
    date2: new FormControl('', []),
    
  });

  // shortcuts: ShortcutInput[] = [];

  public keyUp = new Subject<any>();
  @ViewChild('search', { static: true }) searchEl: ElementRef;
  PagosTotal: any [] = [];
  totales: any;
  totalPagado:0;
  cuatroXmil: 0;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private apiService: ApiService,
    private _userService: UserService,

  ) {
    const codeSearchSubscription = this.keyUp
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(700),
        distinctUntilChanged(),
        flatMap(search => of(search).pipe(delay(400)))
      )
      .subscribe(result => {
        this.loadRecords();
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
  ngOnInit() {
    this.loadRecords();
    this.loadPago();
    this.dataSource = new MatTableDataSource();
  }
  afiliacionId = this._userService?.currentUser?.empresa != null ? this._userService?.currentUser?.empresa : this._userService?.currentUser?.persona;
  ngAfterViewInit() {
    this.searchEl.nativeElement.focus();

    // this.shortcuts.push(
    //   {
    //     key: ['shift + b'],
    //     command: e => console.log('clicked ', e.key),
    //     preventDefault: true
    //   },
    //   {
    //     key: ['shift + n'],
    //     command: e => console.log('clicked ', e.key),
    //     preventDefault: true
    //   }
    // );
  }

  // @ViewChild(KeyboardShortcutsComponent, { static: true }) private keyboard: KeyboardShortcutsComponent;
  loadPago() {
    // console.log('loading records...');
    // this.loadingRecords = true;
    // const queryParams = `search:""`;
    // const queryProps =
    //   'id, id_afiliacion, nombre, valor, iva, status, created_at, persona{id, primer_nombre, primer_apellido} empresaCuenta{id, iva, razon_social, numDocumento, dv}';
    // this.apiService.getCuentaCobro(queryParams, queryProps).subscribe(
    //   (response: any) => {
    //     this.PagosTotal = response.data.getCuentaCobro;
    //     this.totales = this.PagosTotal.reduce((
    //       acc,
    //       obj,
    //     ) => acc + (obj.valor++), 0
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
  openPresupuesto(element : any) {
    // const win = window.open(`http://localhost:8000/cobro/${element.id}`, '_blank');
    const win = window.open(`http://api.soyasesorias.co/cobro/${element.id}`, '_blank');
    win.focus();
  }
  openModal(params: any = null) {
    // const dialogRef = this.dialog.open(DetallePagosModalComponent, {
    //   width: '800px',
    //   height: '640px',
    //   maxHeight: '800px',
    //   panelClass: 'custom-dialog-container',
    //   data: {
    //     params
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   this.loadPago();
    //   this.loadRecords()
    // });
  }
  openFacturarModal(facturar: any = 1) {
    // const dialogRef = this.dialog.open(CambiarLiquidacionComponent, {
    //   width: '800px',
    //   height: '600px',
    //   maxHeight: '800px',
    //   panelClass: 'custom-dialog-container',
    //   data: {
    //     facturar: facturar
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   this.loadPago();
    //   this.loadRecords()
    // });
  }
  searchKeyUp($event: KeyboardEvent): void {
    // console.log($event);
    if ($event.code === 'KeyN' && $event.shiftKey) {
      this.filters.controls.search.setValue('');
      return;
    }

    this.keyUp.next($event);
  }

  dateChange(event: any) {
    this.loadRecords();
  }

  sortRecords(event: MatSort): void {
    this.orderBy = event.active;
    this.order = event.direction;

    // this.loadRecords();
  }
  afiliacionFilter = null;
  filterAfiliacion(status) {
    if (status == '0') {
      this.afiliacionFilter = this.dataSource;
      return;
    }
    this.afiliacionFilter = this.data.filter((data: any) => data.status == status);
  }
  filterAfiliacion2(concepto) {
    if (concepto == '0') {
      this.afiliacionFilter = this.dataSource;
      return;
    }
    this.afiliacionFilter = this.data.filter((data: any) => data.nombre == concepto);
  }
  filterAfiliacion3(sucursal_id) {
    if (sucursal_id == '0') {
      this.afiliacionFilter = this.dataSource;
      return;
    }
    this.afiliacionFilter = this.data.filter((data: any) => data.sucursal_id == sucursal_id);
  }
  loadRecords() {
    console.log('loading records...');
    console.log(this.filters.value);

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
    const queryParams = `id_afiliacion: ${this.afiliacionId.afiliacion_id} limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date} ${date2}`;
    const queryProps =
      'data{id, id_afiliacion, tipo, sucursal_id,  fecha, nombre, valor, cuatroxmil, iva, status, created_at, updated_at, persona{id, primer_nombre, primer_apellido, numDocumento}, tercero{id, nombre, apellido, documento, dv}, sucursal{id, nombre, departamento}, empresaCuenta{id, iva, razon_social, numDocumento, dv}}, total';
    const nombreQuery = 'getCuentaCobroPagination';
    this.apiService.getData(queryProps, queryParams, nombreQuery).subscribe(
      (response: any) => {
        this.data = response.data.getCuentaCobroPagination.data;
        this.resultsLength = response.data.getCuentaCobroPagination.total;
        this.afiliacionFilter = response.data.getCuentaCobroPagination.data;
        this.dataSource.data = this.data;
        this.totalIncome = response.data.getCuentaCobroPagination.data.length === 0
          ? 0 : response.data.getCuentaCobroPagination.data.map((item: any) => parseFloat(item.status == 2 ? item.valor : 0))
            .reduce((item1: any, item2: any) => item1 + item2);
        this.totalPagado = response.data.getCuentaCobroPagination.data.length === 0
          ? 0 : response.data.getCuentaCobroPagination.data.map((item: any) => parseFloat(item.status == 2 ? item.valor : 0))
            .reduce((item1: any, item2: any) => item1 + item2);
        this.cuatroXmil = response.data.getCuentaCobroPagination.data.length === 0
          ? 0 : response.data.getCuentaCobroPagination.data.map((item: any) => item.cuatroxmil == 1 ? item.valor * 0.004 : 0)
            .reduce((item1: any, item2: any) => item1 + item2);
        console.log('cuatroXmil', this.cuatroXmil)
        this.loadingRecords = false;
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

  openIncomeModal(income: any = null) {
    // const dialogRef = this.dialog.open(IncomeModalComponent, {
    //   width: '1200px',
    //   height: '800px',
    //   maxHeight: '1024px',
    //   panelClass: 'custom-dialog-container',
    //   data: {
    //     income: income
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (!result) return;

    //   this.loadRecords();
    //   console.log(result);
    // });
  }

  pageChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.offset = event.pageSize * event.pageIndex;
    this.loadRecords();
  }

  changeDateTimeFormat(date: string) {
    return moment(date).format('DD/MM/YYYY');
  }

  selectRecord(record: any) {
  }

  replaceSpace(str: string) {
    return str.replace(/<br>/g, '\n');
  }

  delete(income: any) {

    // const r = confirm('¿Eliminar Ingreso?');
    // if (r === true) {
    //   this.loadingRecords = true;

    //   const id = income ? `id: ${income.id},` : '';
    //   const queryParams = `${id} delete: 1`;
    //   const queryProps = 'id';

    //   this.apiService.saveIncome(queryParams, queryProps).subscribe(
    //     (response: any) => {
    //       this.loadingRecords = false;

    //       this.loadRecords();

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
}
