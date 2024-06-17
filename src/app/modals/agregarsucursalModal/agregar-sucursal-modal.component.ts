import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { filter, tap, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { ApiService } from 'app/core/api/api.service';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'vex-agregar-sucursal-modal',
  templateUrl: './agregar-sucursal-modal.component.html',
  styleUrls: ['./agregar-sucursal-modal.component.scss']
})
export class AgregarSucursalModalComponent implements OnInit {
  loadingRecords: boolean;
  showOnlyName= false;
  editing= false;

  constructor(
    public dialogRef: MatDialogRef<AgregarSucursalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private coreService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {

  }

  sucursal = new FormGroup({
    nombre: new FormControl('', []),
    departamento: new FormControl('', []),
    caja_cf: new FormControl('', []),
    // ciudad: new FormControl('', [])
  });
  procFilterCtrl: FormControl = new FormControl();

  protected _onDestroy = new Subject<void>();

  public searchingProcedures = false;

  public filtereddataProcedure: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  dataCaja: any[] = [];
  ngOnInit(): void {
    console.log(this.data.id);
    if (this.data.id) {
      this.sucursal.setValue({
        nombre: this.data.id.nombre ? this.data.id.nombre : null,
        caja_cf: this.data.id.caja_cf ? this.data.id.caja_cf.toString() : null,
        departamento: this.data.id.departamento ? this.data.id.departamento.toString() : null,
      });

      if (this.data.id.id) {
        this.showOnlyName = true;
        this.editing = true;
      }
    } 
    this.procFilterCtrl.valueChanges.pipe(
      filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 3),
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
    this.dataCaja;
    this.loadCaja();
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
    this.loadingRecords = true;
    const data = this.sucursal.value;

    const id = data.id ? `id: ${data.id},` : '';
    const empresaId = `id_empresa: ${this.data.id}`
    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: " ",`;
    const caja_cf = data.caja_cf !== '' && data.caja_cf !== null ? `caja_cf: "${data.caja_cf}",` : `caja_cf: " ",`;
    const departamento = data.departamento !== '' && data.departamento !== null ? `departamento: "${data.departamento}",` : `departamento: " ",`;
    const queryParams = `${id} ${empresaId}  ${nombre} ${caja_cf} ${departamento}`;
    const queryProps = 'id, nombre';
    this.apiService.setData(queryProps, queryParams, 'crearSucursal').subscribe(
    // this.apiService.crearSucursal(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loadingRecords = false;

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });

        this.close(data);
      
      },
      (error: any) => {
        this.loadingRecords = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
  saveDetails() {
    this.loadingRecords = true;
    const data = this.sucursal.value;

    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: " ",`;
    const caja_cf = data.caja_cf !== '' && data.caja_cf !== null ? `caja_cf: "${data.caja_cf}",` : `caja_cf: " ",`;
    const departamento = data.departamento !== '' && data.departamento !== null ? `departamento: "${data.departamento}",` : `departamento: " ",`;
    const queryParams = `id: ${this.data.id.id}, ${nombre} ${caja_cf} ${departamento}`;
    const queryProps = 'id, nombre';
    this.apiService.setData(queryProps, queryParams, 'crearSucursal').subscribe(
    // this.apiService.crearSucursal(queryParams, queryProps).subscribe(
      (response: any) => {
        this.loadingRecords = false;

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });

        this.close(data);

      },
      (error: any) => {
        this.loadingRecords = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
  close(params: any = null) {
    this.dialogRef.close(params);
  }

}
