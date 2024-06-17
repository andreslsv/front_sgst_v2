import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
// import { CredentialsService } from 'src/app/core';
// import { MultimediaModalComponent } from '../multimediaModal/multimedia-modal.component';

import moment from 'moment';
import { ApiService } from 'app/core/api/api.service';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';


export interface DocumentoInterface {
  documento: string;
  fecha: string;
}

const documento: DocumentoInterface[] = [
  {documento: 'Cédula', fecha: '12/12/20'},
  {documento: 'Diploma', fecha: '01/01/21'}
];

@Component({
  selector: 'vex-info-beneficiario-modal',
  templateUrl: './info-beneficiario-modal.component.html',
  styleUrls: ['./info-beneficiario-modal.component.scss']
})
export class InfoBeneficiarioModalComponent implements OnInit {

  displayedColumns: string[] = ['documento', 'fecha', 'acciones'];
  documento = documento;
 
  sending = false;
  showOnlyName = false;
  independiente = false;
  uploadForm: FormGroup;
  imagen: any[] = [];
  displayedColumnsDocuments: string[] = ['nombre_documento', 'fecha_guardado', 'imagen', 'acciones'];
  filtro = new FormGroup({
    nombre: new FormControl('', []),
    tipo: new FormControl('', []),
    nacimiento: new FormControl('', []),
    tipo_documento: new FormControl('', []),
    documento: new FormControl('', []),
  });
  loadingRecords: boolean;
  loading: boolean;
  beneficiario: any;
  documentoActive = false;
  empleado= false;


  constructor(
    public dialogRef: MatDialogRef<InfoBeneficiarioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private coreService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private credentialsService: AuthService,
  ) {

  }
  save() {
    this.sending = true;
    
    const data = this.filtro.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const datos_id = this.id = this.route.snapshot.paramMap.get('id');
    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: " ",`;
    const tipo = data.tipo !== '' && data.tipo !== null ? `tipo: ${data.tipo},` : `tipo: ,`;
    const nacimiento = data.nacimiento !== '' ? `nacimiento: "${moment(data.nacimiento).format('YYYY-MM-DD')}",` : '';
    const tipo_documento = data.tipo_documento !== '' && data.tipo_documento !== null ? `tipo_documento: "${data.tipo_documento}",` : `tipo_documento: "",`;
    const documento = data.documento !== '' && data.documento !== null ? `documento: "${data.documento}",` : `documento:"" ,`;
    const queryParams = ` id_afiliacion: ${this.data.datos}, ${nombre} ${tipo} ${nacimiento} ${tipo_documento} ${documento}`;
    const queryProps = 'id, nombre';
    this.apiService.setData(queryProps, queryParams, 'crearBeneficiado').subscribe(
   
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        console.log(queryParams)
        this.close(data);
        // this.close(response.data.saveObs);
        // this.loadObservacion();
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
  saveDetails() {
    this.sending = true;
    const data = this.filtro.value;

    // const id = data.id ? `id: ${this.data.datos.id},` : '';
    // const datos_id = this.id = this.route.snapshot.paramMap.get('id');
    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: " ",`;
    const tipo = data.tipo !== '' && data.tipo !== null ? `tipo: ${data.tipo},` : `tipo: ,`;
    const nacimiento = data.nacimiento !== '' ? `nacimiento: "${moment(data.nacimiento).format('YYYY-MM-DD')}",` : '';
    const tipo_documento = data.tipo_documento !== '' && data.tipo_documento !== null ? `tipo_documento: "${data.tipo_documento}",` : `tipo_documento: "",`;
    const documento = data.documento !== '' && data.documento !== null ? `documento: "${data.documento}",` : `documento:"" ,`;
    const queryParams = `id: ${this.data.datos.id} ,  ${nombre} ${tipo} ${nacimiento} ${tipo_documento} ${documento}`;
    const queryProps = 'id, nombre';
    this.apiService.setData(queryProps, queryParams, 'crearBeneficiado').subscribe(
    
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        console.log(queryParams)
        this.close(data);
        // this.close(response.data.saveObs);
        // this.loadObservacion();
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
  saveEmpleado() {
    this.sending = true;

    const data = this.filtro.value;

    const id = data.id ? `id: ${data.id},` : '';
    // const datos_id = this.id = this.route.snapshot.paramMap.get('id');
    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: " ",`;
    const tipo = data.tipo !== '' && data.tipo !== null ? `tipo: ${data.tipo},` : `tipo: ,`;
    const nacimiento = data.nacimiento !== '' ? `nacimiento: "${moment(data.nacimiento).format('YYYY-MM-DD')}",` : '';
    const tipo_documento = data.tipo_documento !== '' && data.tipo_documento !== null ? `tipo_documento: "${data.tipo_documento}",` : `tipo_documento: "",`;
    const documento = data.documento !== '' && data.documento !== null ? `documento: "${data.documento}",` : `documento:"" ,`;
    const queryParams = ` empleado_id: ${this.data.empleado}, ${nombre} ${tipo} ${nacimiento} ${tipo_documento} ${documento}`;
    const queryProps = 'id, nombre';
    this.apiService.setData(queryProps, queryParams, 'crearBeneficiado').subscribe(
    
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        console.log(queryParams)
        this.close(data);
        // this.close(response.data.saveObs);
        // this.loadObservacion();
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
  saveDetailsEmpleado() {
    this.sending = true;
    const data = this.filtro.value;

    // const id = data.id ? `id: ${this.data.datos.id},` : '';
    // const datos_id = this.id = this.route.snapshot.paramMap.get('id');
    const nombre = data.nombre !== '' && data.nombre !== null ? `nombre: "${data.nombre}",` : `nombre: " ",`;
    const tipo = data.tipo !== '' && data.tipo !== null ? `tipo: ${data.tipo},` : `tipo: ,`;
    const nacimiento = data.nacimiento !== '' ? `nacimiento: "${moment(data.nacimiento).format('YYYY-MM-DD')}",` : '';
    const tipo_documento = data.tipo_documento !== '' && data.tipo_documento !== null ? `tipo_documento: "${data.tipo_documento}",` : `tipo_documento: "",`;
    const documento = data.documento !== '' && data.documento !== null ? `documento: "${data.documento}",` : `documento:"" ,`;
    const queryParams = `id: ${this.data.empleado.id} ,  ${nombre} ${tipo} ${nacimiento} ${tipo_documento} ${documento}`;
    const queryProps = 'id, nombre';
    this.apiService.setData(queryProps, queryParams, 'crearBeneficiado').subscribe(
    
      (response: any) => {
        this.sending = false;

        this._snackBar.open('Guardado', null, {
          duration: 4000
        });
        console.log(queryParams)
        this.close(data);
        // this.close(response.data.saveObs);
        // this.loadObservacion();
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
  openMultimediaModal(empleado: any) {
    // const dialogRef = this.dialog.open(MultimediaModalComponent, {
    //   width: '480px',
    //   height: '504px',
    //   maxHeight: '800px',
    //   data: {
    //     empleado: empleado
    //   }
    // });

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   if (!result) { return; }

    //   this.getRecordMultimedia();
    // });
  }
  close(params: any = null) {
    this.dialogRef.close(params);
  }
  public uploader: FileUploader = new FileUploader({
    isHTML5: true,
    // url: 'http://localhost:8000/v1/actions/recordMultimediaBeneficiario'
    url: `${environment.serverUrl}/v1/actions/recordMultimediaBeneficiario`
  });
  getRecordMultimedia() {
    this.loadingRecords = true;
    const queryParams = `beneficiario_id: ${this.beneficiario.id}`;
    const queryProps =
      'id,name,description,url,type,status,created_at';
    this.apiService.getData(queryProps, queryParams, 'multimedias').subscribe(
   
      (result: any) => {
        this.loadingRecords = false;
        this.imagen = result.data.multimedias;
        // this.currentRecord.multimedias = result.data.multimedias;
        // this.apiService.setEmpresa(result.data.record);
        // this.setCurrentRecord(result.data.record);

        console.log(result);
      },
      (error: any) => {
        this.loadingRecords = false;
        console.log(error);
      }
    );
  }
  deleteMultimedia(multimedia: any) {
    var r = confirm('¿Seguro que desea eliminar el archivo?');
    if (r === true) {
      this.loading = true;

      const id = multimedia ? `id: ${multimedia.id},` : '';
      const queryParams = `${id} delete: 1`;
      const queryProps = 'id';
      this.apiService.setData(queryProps, queryParams, 'saveMultimedia').subscribe(

        (response: any) => {
          this.loading = false;

          this.getRecordMultimedia();

          this._snackBar.open('Eliminado', null, {
            duration: 4000
          });
        },
        error => {
          this.loading = false;
          this._snackBar.open('Error.', null, {
            duration: 4000
          });

          console.log(error);
        }
      );
    }
  }
  ageFromDate(date: string) {
    return moment().diff(moment(date), 'years');
  }

  ngOnInit(): void {
    // this.data?.id;
    // this.data?.documento;
  
   
    if (this.data?.datos) {
      console.log(this.data?.datos?.id);
   
      this.beneficiario = this.data?.datos;
      this.filtro.setValue({
        nombre: this.data.datos.nombre ? this.data.datos.nombre : null,
        nacimiento: this.data.datos.nacimiento ? this.data.datos.nacimiento : null,
        tipo: this.data.datos.tipo ? this.data.datos.tipo.toString() : null,
        tipo_documento: this.data.datos.tipo_documento ? this.data.datos.tipo_documento.toString() : null,
        documento: this.data.datos.documento ? this.data.datos.documento : null,
      });
      this.independiente = true;
      if (this.data?.datos?.id) {
       
        this.showOnlyName = true;
 
      }

      this.uploader.setOptions({
        additionalParameter: {
          record_id: this.data?.datos?.id
        },
        headers: [
          {
            name: 'authorization',
            value: `Bearer ${this.credentialsService.accessToken}`
          }
        ]
      });

    } 
    if (this.data?.empleado) {
      console.log(this.data?.empleado?.id);
      this.beneficiario = this.data?.empleado;
      this.filtro.setValue({
        nombre: this.data.empleado.nombre ? this.data.empleado.nombre : null,
        nacimiento: this.data.empleado.nacimiento ? this.data.empleado.nacimiento : null,
        tipo: this.data.empleado.tipo ? this.data.empleado.tipo.toString() : null,
        tipo_documento: this.data.empleado.tipo_documento ? this.data.empleado.tipo_documento.toString() : null,
        documento: this.data.empleado.documento ? this.data.empleado.documento : null,
      });
      this.empleado = true;
      if (this.data?.empleado?.id) {
        this.showOnlyName = true;
        
      }

      this.uploader.setOptions({
        additionalParameter: {
          record_id: this.data?.empleado?.id
        },
        headers: [
          {
            name: 'authorization',
            value: `Bearer ${this.credentialsService.accessToken}`
          }
        ]
      });

    } 
    if (this.data?.documento){
        this.documentoActive = true;
    }
 
    this.uploadForm = this.fb.group({
      document: [null, [Validators.required]],
    });
    this.getRecordMultimedia();
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (file) => { this.getRecordMultimedia() };
  }

}
