import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { RecordsService } from 'app/pages/records.service';
import { ApiService } from 'app/core/api/api.service';

moment.locale('es');

@Component({
  selector: 'app-deduccionesModal',
  templateUrl: './deduccionesModal.component.html',
  styleUrls: ['./deduccionesModal.component.scss']
})
export class DeduccionesModal implements OnInit, AfterViewInit, OnDestroy {
  sending = false;
  selected: any = null;

  formDeduccion = new FormGroup({
    id: new FormControl('', []),
    obs: new FormControl(null, []),
    valor: new FormControl(null, []),
 
  });

  items: any;
  loadingRecords: boolean;
  Horas: any;
  totales: number;
  edit = false;
  currentRecord: any = null;
  constructor(
    public dialogRef: MatDialogRef<DeduccionesModal>,
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
      this.formDeduccion.setValue({

        obs: hora.obs ? hora.obs.replace(/<br>/g, '\n') : '',
        valor: hora.valor ? hora.valor.replace(/<br>/g, '\n') : '',
      

      });
    }

  }
  ngOnInit() {

    if (this.data.empleado) {
      this.items = this.data.empleado;
      console.log(this.items)
      this.loadDeducciones()
    } else {
      this.items = this.data.edit;
      console.log(this.items)
      this.loadDeducciones()
      this.Horas
      // this.formDeduccion.setValue({

      //   obs: this.Horas.obs ? this.Horas.obs : null,
      //   valor: this.Horas.valor ? this.Horas.valor : null,
      //   tipo3: this.Horas.tipo3 ? this.Horas.tipo3 : null,
      //   tipo4: this.Horas.tipo4 ? this.Horas.tipo4 : null,

      // });
      console.log('horas', this.Horas)
      this.edit = true;
      this.setRecordFromCache

    }
  }

  ngAfterViewInit() { }

  loadDeducciones() {
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `nomina_id: ${this.data.edit.id}, empleado_id: ${this.data.edit.empleado_id}`;
    const queryProps =
      'id, obs, valor';
    this.apiService.getData(queryProps, queryParams, 'getDeducciones').subscribe(

      (response: any) => {
        this.Horas = response.data.getDeducciones;
        // this.apiService.setHora(response.data.getDeducciones);
        if (response.data.getDeducciones && response.data.getDeducciones.length > 0) {
          this.setCurrentRecord(response.data.getDeducciones[0]);
        }
        // this.totales = this.Horas.reduce((
        //   acc,
        //   obj,
        // ) => acc + (obj.obs + obj.valor + obj.tipo3 + obj.tipo4 ), 0
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
    const data = this.formDeduccion.value;

    const id = data.id ? `id: ${data.id},` : '';
    const obs = data.obs !== '' && data.obs !== null ? `obs:"${data.obs}",` : `obs: ".",`;
    const valor = data.valor !== '' && data.valor !== null ? `valor: ${data.valor},` : `valor: 0,`;
   
    const queryParams = ` nomina_id: ${this.data.empleado.id}, empleado_id: ${this.data.empleado.empleadoNomina.id}, ${obs} ${valor}  `;
    const queryProps = 'id';
    this.apiService.setData(queryProps, queryParams, 'saveDeducciones').subscribe(
   
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
  // saveEdit() {
  //   this.sending = true;
  //   const data = this.formDeduccion.value;

  //   const obs = data.obs !== '' && data.obs !== null ? `obs:"${data.obs}",` : `obs: "."{0}`;
  //   const valor = data.valor !== '' && data.valor !== null ? `valor: ${data.valor},` : `valor: ${0}`;
  //   const tipo3 = data.tipo3 !== '' && data.tipo3 !== null ? `tipo3: ${data.tipo3},` : `tipo3: ${0}`;
  //   const tipo4 = data.tipo4 !== '' && data.tipo4 !== null ? `tipo4: ${data.tipo4},` : `tipo4: ${0}`;
  //   const queryParams = `id: ${this.data.edit.id}, ${obs} ${valor}  `;
  //   const queryProps = 'id';

  //   this.apiService.saveDeducciones(queryParams, queryProps).subscribe(
  //     (response: any) => {
  //       this.sending = false;

  //       this.snackBar.open('Guardado', null, {
  //         duration: 4000
  //       });

  //       this.close(data);
  //     },
  //     error => {
  //       this.sending = false;
  //       this.snackBar.open('Error.', null, {
  //         duration: 4000
  //       });

  //       console.log(error);
  //     }
  //   );
  // }
  saveEdit() {
    this.sending = true;
    const data = this.formDeduccion.value;

    const id = data.id ? `id: ${data.id},` : '';
    const obs = data.obs !== '' && data.obs !== null ? `obs:"${data.obs}",` : `obs: ".",`;
    const valor = data.valor !== '' && data.valor !== null ? `valor: ${data.valor},` : `valor: 0,`;
   
    const queryParams = `${id}, nomina_id: ${this.data.edit.id}, empleado_id: ${this.data.edit.empleadoNomina.id}, ${obs} ${valor}  `;
    const queryProps = 'id';
    this.apiService.setData(queryProps, queryParams, 'saveDeducciones').subscribe(

      (response: any) => {
        this.sending = false;

        this.snackBar.open('Guardado', null, {
          duration: 4000
        });

        // this.close(data);
        this.loadDeducciones()
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
  select(formDeduccion: any) {
    this.selected = formDeduccion;

    this.formDeduccion.setValue({
      id: formDeduccion.id,
      date: moment(formDeduccion.date).toISOString(),
      description: formDeduccion.description.replace(/<br>/g, '\n')
    });
  }

  reset() {
    // this.selected = null;
    // this.formDeduccion.reset();
    // this.formDeduccion.markAsPristine();
    // this.formDeduccion.markAsUntouched();
    // this.formDeduccion.updateValueAndValidity();

    this.loadDeducciones()
  }

  delete(datos: any) {
    var r = confirm('¿Desea eliminar el valor?');
    if (r == true) {
      this.sending = true;
      const data = this.formDeduccion.value;

      const id = data.id ? `id: ${datos},` : '';
      const queryParams = `id: ${datos}, delete: 1, nomina_id: ${this.data.edit.id}`;
      const queryProps = 'id';
      this.apiService.setData(queryProps, queryParams, 'saveDeducciones').subscribe(
     
        (response: any) => {
          this.sending = false;

          this.Horas;
          this.loadDeducciones()
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
