import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FileManagerListComponent } from '../list/list.component';
import { FileManagerService } from '../file-manager.service';
import { Item } from '../file-manager.types';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'environments/environment';
import { CredentialsService } from 'app/core/credentials.service';
import { UserService } from 'app/core/user/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'app/core/api/api.service';
import { AuthService } from 'app/core/auth/auth.service';
// import { FileManagerListComponent } from 'app/modules/admin/apps/file-manager/list/list.component';
// import { FileManagerService } from 'app/modules/admin/apps/file-manager/file-manager.service';
// import { Item } from 'app/modules/admin/apps/file-manager/file-manager.types';

@Component({
    selector       : 'file-manager-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerDetailsComponent implements OnInit, OnDestroy
{
    item: Item;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    loading: boolean;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fileManagerListComponent: FileManagerListComponent,
        private _fileManagerService: FileManagerService,
        private credentialsService: AuthService,
        private coreService: UserService,
        private fb: FormBuilder,
        private apiService: ApiService,
    )
    {
    }
    public uploader: FileUploader = new FileUploader({
        isHTML5: true,
    
        url: `${environment.serverUrl}/v1/actions/recordMultimedia`

    });
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    uploadForm: FormGroup;
    afiliacionId = this.coreService?.currentUser?.empresa?.afiliacion_id != null ? this.coreService?.currentUser?.empresa?.afiliacion_id : this.coreService?.currentUser?.persona?.afiliacion_id;
    ngOnInit(): void
    {
        // Open the drawer
        this._fileManagerListComponent.matDrawer.open();
        this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
        this.uploader.onCompleteItem = (file) => { this.getRecordMultimedia() };

        this.uploadForm = this.fb.group({
            document: [null, [Validators.required]],
        });
        // Get the item
        this._fileManagerService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {

                // Open the drawer in case it is closed
                this._fileManagerListComponent.matDrawer.open();

                // Get the item
                this.item = item;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.uploader.setOptions({
            additionalParameter: {
                record_id: this.afiliacionId,
                servicio_id: 0,
                nombre: this.item.name

            },
            headers: [
                {
                    name: 'authorization',
                    value: `Bearer ${this.credentialsService.accessToken}`
                }
            ]
        });
      
    }

    imagen: any[] = [];
   

    getRecordMultimedia() {
        this.loading = true;
        const queryParams = `ultima: 1, afiliacion_id: "${this.afiliacionId}" , servicio_idEmpresa: 0`;
        const queryProps =
            'id,name,description,url,type,status,created_at';
        this.apiService.getData(queryProps, queryParams, 'multimedias').subscribe(

            (result: any) => {
                this.loading = false;
                this.imagen = result.data.multimedias;


                console.log(result);
            },
            (error: any) => {
                this.loading = false;
                console.log(error);
            }
        );
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        // this._unsubscribeAll.next(null);
        // this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._fileManagerListComponent.matDrawer.close();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
