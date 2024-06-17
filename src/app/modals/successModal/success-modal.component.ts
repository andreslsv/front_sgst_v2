import { Component, OnInit, Inject, AfterViewInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

// import { ApiService } from 'src/app/core/api/api.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'app/core/api/api.service';

moment.locale('es');

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html'
})
export class SuccessModalComponent implements OnInit, AfterViewInit, OnDestroy {
  sending = false;
  selected: any = null;

  Success = new FormGroup({
    id: new FormControl('', []),
    description: new FormControl(null, [])
  });

  items: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<SuccessModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    // this.currentPatient = this.apiService.currentPatient;
  }
  openPresupuesto() {
    // const win = window.open(`http://localhost:8000/cobro/${element.id}`, '_blank');
    const win = window.open(`http://api.soyasesorias.co/cobro/${this.data.element.id}`, '_blank');
    win.focus();

    this.close(this.data.element.id)
  }
  ngOnInit() {
    if (this.data.element) {
      console.log(this.data.element);
      
    }
  }

  ngAfterViewInit() {}

  
  close(params: any = null) {
    this.dialogRef.close(params);
  }

  ngOnDestroy(): void {}
}
