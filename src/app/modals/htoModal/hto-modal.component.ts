import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { RecordsService } from 'app/pages/records.service';
import { ApiService } from 'app/core/api/api.service';

moment.locale('es');

@Component({
  selector: 'app-hto-modal',
  templateUrl: './hto-modal.component.html'
})
export class htoModalComponent implements OnInit, AfterViewInit, OnDestroy {
  sending = false;
  selected: any = null;


  hto = new FormGroup({
    id: new FormControl('', []),
    tipo1: new FormControl('', [Validators.required]),
    tipo2: new FormControl('', [Validators.required]),
    tipo3: new FormControl('', [Validators.required]),
    tipo4: new FormControl('', [Validators.required])
  });

  items: any[] = [];
  loadingRecords: boolean;
  Horas: any ;
  totales: number;
  edit= false;
  currentRecord: any = null;
  constructor(
    public dialogRef: MatDialogRef<htoModalComponent>,
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

        tipo1: hora.tipo1 ? hora.tipo1.replace(/<br>/g, '\n') : '',
        tipo2: hora.tipo2 ? hora.tipo2.replace(/<br>/g, '\n') : '',
        tipo3: hora.tipo3 ? hora.tipo3.replace() : '',
        tipo4: hora.tipo4 ? hora.tipo4.replace(/<br>/g, '\n') : '',
        
      });
    }

  }
  ngOnInit() {
  
    if (this.data.empleado){
      this.items = this.data.empleado;
      console.log(this.items)
      
    }else{
      this.items = this.data.edit;
      console.log(this.items)
      this.loadHoras()
      this.Horas
      // this.hto.setValue({

      //   tipo1: this.Horas.tipo1 ? this.Horas.tipo1 : null,
      //   tipo2: this.Horas.tipo2 ? this.Horas.tipo2 : null,
      //   tipo3: this.Horas.tipo3 ? this.Horas.tipo3 : null,
      //   tipo4: this.Horas.tipo4 ? this.Horas.tipo4 : null,

      // });
      console.log('horas', this.loadHoras())
        this.edit = true;
      this.setRecordFromCache
      
    }
  }

  ngAfterViewInit() {}

  loadHoras() {
    console.log('loading records...');
    this.loadingRecords = true;
    const queryParams = `nomina_id: ${this.data.edit.id}, empleado_id: ${this.data.edit.empleado_id}`;
    const queryProps =
      'id, tipo1, tipo2, tipo3, tipo4';
    
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
        // ) => acc + (obj.tipo1 + obj.tipo2 + obj.tipo3 + obj.tipo4 ), 0
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
    const tipo1 = data.tipo1 !== '' && data.tipo1 !== null ? `tipo1: ${data.tipo1},` : `tipo1: 0,`;
    const tipo2 = data.tipo2 !== '' && data.tipo2 !== null ? `tipo2: ${data.tipo2},` : `tipo2: 0,`;
    const tipo3 = data.tipo3 !== '' && data.tipo3 !== null ? `tipo3: ${data.tipo3},` : `tipo3: 0,`;
    const tipo4 = data.tipo4 !== '' && data.tipo4 !== null ? `tipo4: ${data.tipo4},` : `tipo4: 0,`;
    const queryParams = `${id}, nomina_id: ${this.data.empleado.id}, empleado_id: ${this.data.empleado.empleadoNomina.id}, ${tipo1} ${tipo2} ${tipo3} ${tipo4} `;
    const queryProps = 'id';
    
    this.apiService.setData(queryProps, queryParams, 'saveHoraExtra').subscribe(

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
  //   const data = this.hto.value;

  //   const tipo1 = data.tipo1 !== '' && data.tipo1 !== null ? `tipo1: ${data.tipo1},` : `tipo1: ${0}`;
  //   const tipo2 = data.tipo2 !== '' && data.tipo2 !== null ? `tipo2: ${data.tipo2},` : `tipo2: ${0}`;
  //   const tipo3 = data.tipo3 !== '' && data.tipo3 !== null ? `tipo3: ${data.tipo3},` : `tipo3: ${0}`;
  //   const tipo4 = data.tipo4 !== '' && data.tipo4 !== null ? `tipo4: ${data.tipo4},` : `tipo4: ${0}`;
  //   const queryParams = `id: ${this.data.edit.id}, ${tipo1} ${tipo2} ${tipo3} ${tipo4} `;
  //   const queryProps = 'id';

  //   this.apiService.saveHoraExtra(queryParams, queryProps).subscribe(
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
    const data = this.hto.value;

    const id = data.id ? `id: ${data.id},` : '';
    const tipo1 = data.tipo1 !== '' && data.tipo1 !== null ? `tipo1: ${data.tipo1},` : `tipo1:${this.Horas.tipo1},`;
    const tipo2 = data.tipo2 !== '' && data.tipo2 !== null ? `tipo2: ${data.tipo2},` : `tipo2:${this.Horas.tipo2},`;
    const tipo3 = data.tipo3 !== '' && data.tipo3 !== null ? `tipo3: ${data.tipo3},` : `tipo3:${this.Horas.tipo3},`;
    const tipo4 = data.tipo4 !== '' && data.tipo4 !== null ? `tipo4: ${data.tipo4},` : `tipo4:${this.Horas.tipo4},`;
    const queryParams = `${id}, nomina_id: ${this.data.edit.id}, empleado_id: ${this.data.edit.empleadoNomina.id}, ${tipo1} ${tipo2} ${tipo3} ${tipo4} `;
    const queryProps = 'id';
    
    this.apiService.setData(queryProps, queryParams, 'saveHoraExtra').subscribe(

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
      this.apiService.setData(queryProps, queryParams, 'saveHto').subscribe(
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

  ngOnDestroy(): void {}
}
