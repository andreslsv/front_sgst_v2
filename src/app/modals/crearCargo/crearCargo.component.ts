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
  selector: 'vex-crearCargo',
  templateUrl: './crearCargo.component.html',
  styleUrls: ['./crearCargo.component.scss']
})
export class CrearCargoModalComponent implements OnInit {
  loadingRecords: boolean;
  showOnlyName= false;
  editing= false;
  gasto= false;

  constructor(
    public dialogRef: MatDialogRef<CrearCargoModalComponent>,
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
  });
  procFilterCtrl: FormControl = new FormControl();

  protected _onDestroy = new Subject<void>();

  public searchingProcedures = false;

  public filtereddataProcedure: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  dataCaja: any[] = [];
  ngOnInit(): void {
    console.log(this.data.id);
    this.data?.empresa_id;
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
    console.log(this.data?.gasto);
    if (this.data?.gasto){
      this.gasto = true
    }
    // this.procFilterCtrl.valueChanges.pipe(
    //   filter(ctuSearchterm => ctuSearchterm && ctuSearchterm.length >= 3),
    //   tap(() => this.searchingProcedures = true),
    //   takeUntil(this._onDestroy),
    //   debounceTime(500),
    //   distinctUntilChanged(),
    //   switchMap(term => this.apiService.getData('id,codigo,nombre', `search: "${term}"`, 'cajaCompensacion'))

    // ).subscribe((results: any) => {
    //   console.log(results);
    //   this.searchingProcedures = false;
    //   this.filtereddataProcedure.next(results.data.cajaCompensacion);
    // }, error => {
    //   this.searchingProcedures = false;
    // });

  }

  saveGasto() {
    this.loadingRecords = true;
    const data = this.sucursal.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const independiente_id = `independiente_id: ${this.data.id}`
    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: " ",`;
    const queryParams = `${id}  ${nombre} `;
    const queryProps = 'id, nombre';
    
    this.apiService.setData(queryProps, queryParams, 'saveListaGasto').subscribe(

   
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
  save() {
    this.loadingRecords = true;
    const data = this.sucursal.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const independiente_id = `independiente_id: ${this.data.id}`
    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: " ",`;
    const queryParams = `${id} empresa_id: ${this.data?.empresa_id} ${nombre} `;
    const queryProps = 'id, nombre';
    this.apiService.setData(queryProps, queryParams, 'saveCargo').subscribe(

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
