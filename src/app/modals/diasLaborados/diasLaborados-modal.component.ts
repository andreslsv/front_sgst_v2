import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';


import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'app/core/api/api.service';
import { RecordsService } from 'app/pages/records.service';

moment.locale('es');

@Component({
  selector: 'app-diasLaborados-modal',
  templateUrl: './diasLaborados-modal.component.html'
})
export class DiasLaboradosComponent implements OnInit, AfterViewInit, OnDestroy {
  sending = false;
  selected: any = null;

  hto = new FormGroup({
    id: new FormControl('', []),
    dias: new FormControl(null, []),
   
  });

  items: any[] = [];
  loadingRecords: boolean;
  Horas: any;
  totales: number;
  edit = false;
  currentRecord: any = null;
  constructor(
    public dialogRef: MatDialogRef<DiasLaboradosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private recordsService: RecordsService,
  ) {
    // this.currentPatient = this.apiService.currentPatient;
  }
  setRecordFromCache() {
    let currentRecord = this.recordsService.getHoraFromCache();

    this.setCurrentRecord(currentRecord);
  }
  setCurrentRecord(hora: any) {
    this.currentRecord = hora;
    console.log('dato hora', hora)
    if (hora) {
      this.hto.setValue({

        dias: hora.dias ? hora.dias.replace(/<br>/g, '\n') : '',
      


      });
    }

  }
  ngOnInit() {

    if (this.data.empleado) {
      this.items = this.data.empleado;
      console.log(this.items)

    } else {
      this.items = this.data.edit;
      console.log(this.items)
      this.loadHoras()
      this.Horas
      // this.hto.setValue({

      //   dias: this.Horas.dias ? this.Horas.dias : null,
      //   ingreso_noc: this.Horas.ingreso_noc ? this.Horas.ingreso_noc : null,
      //   tipo3: this.Horas.tipo3 ? this.Horas.tipo3 : null,
      //   tipo4: this.Horas.tipo4 ? this.Horas.tipo4 : null,

      // });
      console.log('horas', this.Horas)
      this.edit = true;
      this.setRecordFromCache

    }
  }

  ngAfterViewInit() { }

  loadHoras() {
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `nomina_id: ${this.data.edit.id}, empleado_id: ${this.data.edit.empleado_id}`;
    const queryProps =
      'id, dias';
    this.apiService.getData(queryProps, queryParams, 'getHoraExtra').subscribe(
      (response: any) => {
        this.Horas = response.data.getHoraExtra;
        // this.apiService.setHora(response.data.getHoraExtra);
        if (response.data.getHoraExtra && response.data.getHoraExtra.length > 0) {
          this.setCurrentRecord(response.data.getHoraExtra[0]);
        }
        // this.totales = this.Horas.reduce((
        //   acc,
        //   obj,
        // ) => acc + (obj.dias + obj.ingreso_noc + obj.tipo3 + obj.tipo4 ), 0
        // );
      },
      error => {
        this.loadingRecords = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });
        console.log(error);
      }
    );
  }
  save() {
    this.sending = true;
    const data = this.hto.value;

    const id = data.id ? `id: ${data.id},` : '';
    const dias = data.dias !== '' && data.dias !== null ? `dias: ${data.dias},` : `dias: 0,`;
    const queryParams = `${id}, nomina_id:  ${this.data.empleado.nomina_id}, empleado_id: ${this.data.empleado.empleado_id}, ${dias} `;
    const queryProps = 'id';
    this.apiService.setData(queryProps, queryParams, 'saveDias').subscribe(
   
      (response: any) => {
        this.sending = false;

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });

        this.close(data);
      },
      error => {
        this.sending = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }

  saveEdit() {
    this.sending = true;
    const data = this.hto.value;

    const id = data.id ? `id: ${data.id},` : '';
    const dias = data.dias !== '' && data.dias !== null ? `dias: ${data.dias},` : `dias: 0,`;
    const queryParams = `${id}, nomina_id: ${this.data.edit.id}, empleado_id: ${this.data.edit.empleadoNomina.id}, ${dias} `;
    const queryProps = 'id';
    this.apiService.setData(queryProps, queryParams, 'saveDias').subscribe(

      (response: any) => {
        this.sending = false;

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });

        this.close(data);
      },
      error => {
        this.sending = false;
        this.snackBar.open('Error.', null, {
          duration: 4000
        });

        console.log(error);
      }
    );
  }
  select(hto: any) {
    this.selected = hto;

    this.hto.setValue({
      id: hto.id,
      date: moment(hto.date).toISOString(),
      description: hto.description.replace(/<br>/g, '\n')
    });
  }

  reset() {
    this.selected = null;
    this.hto.reset();
    this.hto.markAsPristine();
    this.hto.markAsUntouched();
    this.hto.updateValueAndValidity();
  }

  delete() {
    var r = confirm('¿Eliminar?');
    if (r == true) {
      this.sending = true;
      const data = this.hto.value;

      const id = data.id ? `id: ${data.id},` : '';
      const queryParams = `${id}, delete: 1`;
      const queryProps = 'id';
      this.apiService.getData(queryProps, queryParams, 'saveHto').subscribe(

        (response: any) => {
          this.sending = false;

          const index = this.items.findIndex(value => value.id == response.data.saveHto.id);

          console.log(index);

          this.items.splice(index, 1);
          this.reset();

          this.snackBar.open('Eliminado', null, {
            duration: 4000
          });
        },
        error => {
          this.sending = false;
          this.snackBar.open('Error.', null, {
            duration: 4000
          });

          console.log(error);
        }
      );
    } else {
    }
  }

  close(params: any = null) {
    this.dialogRef.close(params);
  }

  ngOnDestroy(): void { }
}
