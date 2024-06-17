import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

// import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'app/core/api/api.service';

moment.locale('es');

@Component({
    selector: 'app-multimedia-modal',
    templateUrl: './multimedia-modal.component.html'
})
export class MultimediaModalComponent implements OnInit, AfterViewInit, OnDestroy {
    sending = false;
    selected: any = null;
    multimedia: any;

    obs = new FormGroup({
        id: new FormControl('', []),
        description: new FormControl('', [Validators.required]),
    });

    items: any[] = [];
    empleado: any;

    constructor(
        public dialogRef: MatDialogRef<MultimediaModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService,
        private snackBar: MatSnackBar
    ) {
        // this.currentPatient = this.apiService.currentPatient;
    }

    ngOnInit() {
        console.log(this.data.multimedia);
        if (this.data.multimedia) {
            this.multimedia = this.data.multimedia;
            
            this.obs.setValue({
                id: this.data.multimedia.id,
                description: this.data.multimedia.description,
            });
        }
        if (this.data.empleado) {
            this.empleado = this.data.empleado;

            this.obs.setValue({
                id: this.data.empleado.id,
                description: this.data.empleado.description,
            });
        }
    }

    ngAfterViewInit() { }

    save() {
        this.sending = true;
        const data = this.obs.value;

        const id = this.data.multimedia ? `id: ${data.id},` : this.data.empleado ? `id: ${data.id},` :'' ;
        const description = `description: "${data.description}",`;
        const queryParams = `${id} ${description}`;
        const queryProps = 'id, description';
        this.apiService.setData(queryProps, queryParams, 'saveMultimedia').subscribe(

            (response: any) => {
                this.sending = false;

                this.close(response.data.saveMultimedia);

                this.snackBar.open('Guardado', null, {
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
    }

    close(params: any = null) {
        this.dialogRef.close(params);
    }

    ngOnDestroy(): void { }
}
