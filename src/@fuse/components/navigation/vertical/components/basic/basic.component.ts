import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IsActiveMatchOptions } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseVerticalNavigationComponent } from '@fuse/components/navigation/vertical/vertical.component';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';
import { UserService } from 'app/core/user/user.service';
import { ApiService } from 'app/core/api/api.service';
import { user } from 'app/models/user.model';

@Component({
    selector       : 'fuse-vertical-navigation-basic-item',
    templateUrl    : './basic.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseVerticalNavigationBasicItemComponent implements OnInit, OnDestroy
{
    @Input() item: FuseNavigationItem;
    @Input() name: string;

    isActiveMatchOptions: IsActiveMatchOptions;
    private _fuseVerticalNavigationComponent: FuseVerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseUtilsService: FuseUtilsService,
        private coreService: UserService,
        private apiService: ApiService
    )
    {
        // Set the equivalent of {exact: false} as default for active match options.
        // We are not assigning the item.isActiveMatchOptions directly to the
        // [routerLinkActiveOptions] because if it's "undefined" initially, the router
        // will throw an error and stop working.
        this.isActiveMatchOptions = this._fuseUtilsService.subsetMatchOptions;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    // currentUser: user;
    /**
     * On init
     */
    ngOnInit(): void
    {

        const nombreQuery = 'me';
        const queryParams = `search: " " `;
        const queryProps = 'id,name,email, avatar, modulos{id, user_id, home, empresas, independientes, pagos, solicitudes, documentos, empleados, nominas, planillas, servicios} empresa{id, razon_social, primer_nombre, afiliacion_id, imagen}';

        this.apiService.getData(queryProps, queryParams, nombreQuery).
            subscribe((response) => {
                this.coreService.setUser(new user().deserialize(response.data.me));
                // this.currentUser = response.data.me;
            });
        console.log("menu $User", this.coreService);
        // this.cacheValue('current_user', this.currentUser);

        // Set the "isActiveMatchOptions" either from item's
        // "isActiveMatchOptions" or the equivalent form of
        // item's "exactMatch" option
        this.isActiveMatchOptions =
            this.item.isActiveMatchOptions ?? this.item.exactMatch
                ? this._fuseUtilsService.exactMatchOptions
                : this._fuseUtilsService.subsetMatchOptions;

        // Get the parent navigation component
        this._fuseVerticalNavigationComponent = this._fuseNavigationService.getComponent(this.name);

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Subscribe to onRefreshed on the navigation component
        this._fuseVerticalNavigationComponent.onRefreshed.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe(() => {

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }
    // userName() {
    //     return this.coreService.currentUser.fullName();
    // }

    userEmpresa() {
        return this.coreService.currentUser.modulos.empresas
    }
    userDocumentos() {
        return  this.coreService.currentUser.modulos.documentos
    }
    userHome() {
        return this.coreService.currentUser.modulos.home
    }
    userIndependientes() {
        return this.coreService.currentUser.modulos.independientes
    }
    userPagos() {
        return this.coreService.currentUser.modulos.pagos
    }
    userNominas() {
        return  this.coreService.currentUser.modulos.nominas
    }
    userEmpleados() {
        return this.coreService.currentUser.modulos.empleados
    }
    userPlanillas() {
        return this.coreService.currentUser.modulos.planillas
    }
    userServicios() {
        return  this.coreService.currentUser.modulos.servicios
    }
    userSolicitudes() {
        return this.coreService.currentUser.modulos.solicitudes
    }
    hiddenItem(label) {

        if (this.userHome() == 2 && label == 'Inicio') {
            return true;
        } else if (this.userHome() == 1 && label == 'Inicio') {
            return false;
        }

        if (this.userEmpresa() == 2 && label == 'Empresa') {
            return true;
        } else if (this.userEmpresa() == 1 && label == 'Empresa') {
            return false;
        }

        if (this.userIndependientes() == 2 && label == 'Independiente') {
            return true;
        } else if (this.userIndependientes() == 1 && label == 'Independiente') {
            return false;
        }


        if (this.userPagos() == 2 && label == 'Pagos') {
            return true;
        } else if (this.userPagos() == 1 && label == 'Pagos') {
            return false;
        }

        if (this.userNominas() == 2 && label == 'Nonimas') {
            return true;
        } else if (this.userNominas() == 1 && label == 'Nonimas') {
            return false;
        }


        if (this.userEmpleados() == 2 && label == 'Empleados') {
            return true;
        } else if (this.userEmpleados() == 1 && label == 'Empleados') {
            return false;
        }


        if (this.userPlanillas() == 2 && label == 'Planillas') {
            return true;
        } else if (this.userPlanillas() == 1 && label == 'Planillas') {
            return false;
        }

        if (this.userDocumentos() == 2 && label == 'Documentos') {
            return true;
        } else if (this.userDocumentos() == 1 && label == 'Documentos') {
            return false;
        }

        if (this.userSolicitudes() == 2 && label == 'Solicitudes') {
            return true;
        } else if (this.userSolicitudes() == 1 && label == 'Solicitudes') {
            return false;
        }

        if (this.userServicios() == 2 && label == 'Servicios') {
            return true;
        } else if (this.userServicios() == 1 && label == 'Servicios') {
            return false;
        }

    }
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
