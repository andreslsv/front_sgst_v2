import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import moment from 'moment';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { empleado } from 'app/models/empleado';
import { ApiService } from 'app/core/api/api.service';
import { RecordsService } from '../records.service';
import { UserService } from 'app/core/user/user.service';
import { selectPeriodoMesComponent } from 'app/modals/selectPeriodoMes/selectPeriodoMes.component';
import { CargarDocumentosComponent } from 'app/modals/cargarDocumentos/cargarDocumentos.component';

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
  selector: 'vex-planilla-generadas',
  templateUrl: './planilla-generadas.component.html',
  styleUrls: ['./planilla-generadas.component.scss']
})
export class PlanillaGeneradasComponent implements OnInit {
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

  displayedColumns: string[] = ['periodo',  'salarios',  'pago_ss',  'status', 'acciones'];
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
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private recordsService: RecordsService,
    private fb: FormBuilder,
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
  dataPersona: any[] = [];
  loadDataPersona() {
    console.log('loading records...');

    this.loadingRecords = true;
    // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `id: ${this.coreService.currentUser.persona.afiliacion_id}`;
    const queryProps =
      'id,  afiliacion, liquidacion, asesorias, iva, incapacidades, examenes, primer_nombre, primer_apellido, tipoDocumento, numDocumento, ciudad, email, departamento,  direccion, telefono, tipoAfiliacion, eps, arl, tipoVinculacion, cargo, riesgo, salario_base, status ';
    this.apiService.getData(queryProps, queryParams, 'persona').subscribe(

      (response: any) => {
        this.dataPersona = response.data.persona;
        this.apiService.setEmpresa(response.data.persona);
        if (response.data.persona && response.data.persona.length > 0) {
          this.setCurrentRecord(response.data.persona[0]);
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
  currentRecord: any = null;
  setRecordFromCache() {
    let currentRecord = this.recordsService.getIndependienteFromCache();

    this.setCurrentRecord(currentRecord);
  }
  setCurrentRecord(persona: any) {
    this.currentRecord = persona;
    console.log('dato persona', persona)
    if (persona) {
      // this.step_1.setValue({
      //   primer_nombre: persona.primer_nombre ? persona.primer_nombre.replace(/<br>/g, '\n') : '',
      //   primer_apellido: persona.primer_apellido ? persona.primer_apellido.replace(/<br>/g, '\n') : '',
      //   tipoDocumento: persona.tipoDocumento ? persona.tipoDocumento.toString() : '',
      //   numDocumento: persona.numDocumento ? persona.numDocumento.replace(/<br>/g, '\n') : '',
      //   ciudad: persona.ciudad ? persona.ciudad.replace(/<br>/g, '\n') : '',
      //   departamento: persona.departamento ? persona.departamento.toString() : '',
      //   email: persona.email ? persona.email.replace(/<br>/g, '\n') : '',
      //   direccion: persona.direccion ? persona.direccion.replace(/<br>/g, '\n') : '',
      //   telefono: persona.telefono ? persona.telefono.replace(/<br>/g, '\n') : '',
      //   tipoAfiliacion: persona.tipoAfiliacion ? persona.tipoAfiliacion.toString() : '',
      //   eps: persona.eps ? persona.eps.toString() : '',
      //   arl: persona.arl ? persona.arl.toString() : '',
      //   tipoVinculacion: persona.tipoVinculacion ? persona.tipoVinculacion.toString() : '',
      //   cargo: persona.cargo ? persona.cargo.replace(/<br>/g, '\n') : '',
      //   riesgo: persona.riesgo ? persona.riesgo.toString() : '',
      //   salario_base: persona.salario_base ? persona.salario_base.replace(/<br>/g, '\n') : '',
      // });
    }

  }
  ngOnInit(): void 
  {
    this.loadDataPersona()
    // this.loadEmpleadoPaginator();
    this.loadNominaPaginator();
    this.coreService.currentUser.persona.afiliacion_id
     
  }
  // selectDetails(empresa: any) {
  //   this.router.navigate(['./liquidarnuevaplanilla', empresa.id, empresa.afiliacion_id]);
  // }
  openPresupuesto(element) {
    // const win = window.open(`http://localhost:8000/nomina/${this.id = element.afiliacion_id}/${element.t_valorSS}/${element.nombre_periodo}`, '_blank');
    const win = window.open(`http://api.soyasesorias.co/nomina/${this.id = element.afiliacion_id}/${element.t_valorSS}/${element.id}`, '_blank');
    win.focus();
  }
  loadNominaPaginator() {
    this.loadingRecords = true;
    const date =
      this.filters.value.date !== '' && this.filters.value.date !== null
        ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
        : '';
    const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
    const queryParams = `afiliacion_id: ${this.coreService.currentUser.persona.afiliacion_id}, limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date}`;
    const queryProps =
      'data{ id, detalleNomina{id, persona_id, nomina_id, empresa_id, empleado_id, ss, ibc, salud, pension, arl, ccf, sena, icdf, dias_laborados, otros_ingresos, horas_extras, deducciones,  riesgo },  empresa{id, periodo, afiliacion_id, contacto, telContacto, tipoEmpresa, razon_social, direccion, email, departamento, ciudad, numDocumento, dv, telEmpresaMovil, telEmpresaFijo, representanteLegal, contacto, email_responsable, email_contacto, telefono_responsable, arl, riesgo, caja_cf }, empresa_id, periodo, nombre_periodo, numEmpleado, valorTotal, t_valorSS, t_valorHorasEx, t_otrosPagos, t_deducciones, status, numPlanilla, salario_dias, created_at, afiliacion_id, }, total';
    this.apiService.getData(queryProps, queryParams, 'nominaPagination').subscribe(

      (response: any) => {

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
        this._snackBar.open('Error.', null, {
          duration: 4000
        });
        console.log(error);
      }
    );
  }
  openSelectPeriodo(independiente: any) {
    const dialogRef = this.dialog.open(selectPeriodoMesComponent, {
      width: 'auto',
      height: 'auto',
      maxHeight: '850px',
      data: {
        independiente: 1,
        afiliacion: this.coreService.currentUser.persona.afiliacion_id
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.router.navigate(['./liquidarnuevaplanilla', result.id]);
      }
  
    });
  }

  openDocumento(planilla: any) {
    const dialogRef = this.dialog.open(CargarDocumentosComponent, {
      width: 'auto',
      height: 'auto',
      maxHeight: '850px',
      data: {
        planilla: planilla,
        // afiliacion: this.coreService.currentUser.persona.afiliacion_id
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.router.navigate(['./liquidarnuevaplanilla', result.id]);
      }

    });
  }
  selectDetails(result: any) {
    this.router.navigate(['./liquidarnuevaplanilla', result.id]);
  }


  delete(income: any) {

    const r = confirm('¿DESEAS ELIMINAR LA NOMINA?');
    if (r === true) {
      this.loadingRecords = true;

      // const id = income ? `id: ${income.id},` : '';
      const queryParams = `id:${income.id}, delete: 1 `;
      const queryProps = 'id ';
      this.apiService.setData(queryProps, queryParams, 'SaveNomina').subscribe(

        (response: any) => {
          this.loadingRecords = false;

          this.loadNominaPaginator();

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
}
