import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Item, Items } from '../file-manager.types';
import { FileManagerService } from '../file-manager.service';
import { RecordsService } from 'app/pages/records.service';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'app/core/user/user.service';
import { ApiService } from 'app/core/api/api.service';
// import { FileManagerService } from 'app/modules/admin/apps/file-manager/file-manager.service';
// import { Item, Items } from 'app/modules/admin/apps/file-manager/file-manager.types';

@Component({
    selector       : 'file-manager-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileManagerListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    selectedItem: Item;
    items: Items;
    displayedColumnsDocuments: string[] = ['nombre_documento', 'fecha_guardado', 'imagen', 'descripcion', 'acciones'];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    loading: boolean;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fileManagerService: FileManagerService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private recordsService: RecordsService,
        private fb: FormBuilder,
        private _userService: UserService,
        private apiService: ApiService,
    )
    {
    }
    alertIsVisible = true;
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the items
        this._fileManagerService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items: Items) => {
                this.items = items;

                // Mark for check
                this.getRecordMultimedia()
                this._changeDetectorRef.markForCheck();
            });
            
      

        // Get the item
        this._fileManagerService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {
                this.selectedItem = item;
                this.getRecordMultimedia()
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to media query change
        this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {

                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';
                this.getRecordMultimedia()
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        
    }


    Refrescar() {
        this.getRecordMultimedia()

        this.imagen

        this.getRecordMultimedia()
    }
    imagen: any[] = [];
    afiliacionId = this._userService?.currentUser?.empresa?.afiliacion_id != null ? this._userService?.currentUser?.empresa?.afiliacion_id : this._userService?.currentUser?.persona?.afiliacion_id;
    getRecordMultimedia() {
        this.loading = true;
        const queryParams = `afiliacion_id: "${this.afiliacionId}" , servicio_idEmpresa: 0`;
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

                    // this._snackBar.open('Eliminado', null, {
                    //     duration: 4000
                    // });
                },
                error => {
                    this.loading = false;
                    // this._snackBar.open('Error.', null, {
                    //     duration: 4000
                    // });

                    console.log(error);
                }
            );
        }
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
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
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
