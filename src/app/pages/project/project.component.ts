import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { of, Subject, takeUntil, map, debounceTime, distinctUntilChanged, flatMap, delay } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { ProjectService } from 'app/pages/project/project.service';
import { UserService } from 'app/core/user/user.service';
import { ApiService } from 'app/core/api/api.service';
import { user } from 'app/models/user.model';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import moment from 'moment';
import { empleado } from 'app/models/empleado';
import { MatTableDataSource } from '@angular/material/table';
import { CrearEmpleadoComponent } from 'app/modals/crearEmpleado/crear-empleado.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector       : 'project',
    templateUrl    : './project.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent implements OnInit, OnDestroy 
{
    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};
    data: any;
    selectedProject: string = 'Indicadores';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    userData: any;
    alertIsVisible = true;
    loadingRecords= false;
    resultsLength = 0;
    pageSize = 10;
    pageSizeOptions: number[] = [10, 50, 100];
    orderBy = 'created_at';
    order = 'desc';
    limit = 10;
    offset = 0;
    /**
     * Constructor
     */

    filters = new FormGroup({
        search: new FormControl('', []),
        search2: new FormControl('', []),
        date: new FormControl('', []),
        date2: new FormControl('', []),

    });
    public keyUp = new Subject<any>();
    @ViewChild('search', { static: false }) searchEl: ElementRef;
    @ViewChild('search2', { static: false }) searchEl2: ElementRef;
    resultsLengthActivos= 0;
    dataServicio =0;
    resultsLengthPagos = 0;
    constructor(
        private _projectService: ProjectService,
        private _router: Router,
        private _userService: UserService,
        private apiService: ApiService,
        public dialog: MatDialog,
    )
    {
        const codeSearchSubscription = this.keyUp
            .pipe(
                map((event: any) => event.target.salario_base),
                debounceTime(300),
                distinctUntilChanged(),
                flatMap(search => of(search).pipe(delay(300)))
            )
            .subscribe(result => {
                this.filters.controls.search.setValue(this.searchEl.nativeElement.value);
                this.filters.controls.search2.setValue(this.searchEl2.nativeElement.value);
                this.loadEmpleadoPaginator();
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    empresaId = false;
    afiliacionId = this._userService?.currentUser?.empresa != null ? this._userService?.currentUser?.empresa : this._userService?.currentUser?.persona;
    nombre() {
        return this.afiliacionId?.primer_nombre;
    }
    empresa(){
        if (this._userService?.currentUser?.empresa?.razon_social){

            this.empresaId = true;
        }
        return this._userService?.currentUser?.empresa?.razon_social;
        
    }
    imagen() {
        return this.afiliacionId?.imagen;
    }
    
    openCrearEmpleadoModal() {
        // const data = this.obs.value;
        // const seleccion = data.seleccion !== '' && data.seleccion !== null ? `seleccion: ${data.seleccion}` : `seleccion: ${this.data.indice.seleccion},`;
        const dialogRef = this.dialog.open(CrearEmpleadoComponent, {
            width: '1000px',
            height: '700px',
            maxHeight: '850px',

            data: {
                afiliacion: `${this.afiliacionId.afiliacion_id}`,
                razonSocial: `${this.afiliacionId.primer_nombre}`
            }
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (!result) return;
            // this.close(data);
            this.loadEmpleadoPaginator();
            // this.loadDetalleServicio();
            // this.detalleServicio;
        });
    }
    searchKeyUp($event: KeyboardEvent): void {
        // console.log($event);
        if ($event.code === 'KeyN' && $event.shiftKey) {
            this.filters.controls.search.setValue('');
            return;
        }

        this.keyUp.next($event);
    }

    searchKeyUp2($event: KeyboardEvent): void {
        // console.log($event);
        if ($event.code === 'KeyN' && $event.shiftKey) {
            this.filters.controls.search2.setValue('');
            return;
        }

        this.keyUp.next($event);
    }
    dateChange(event: any) {
        this.loadEmpleadoPaginator();
    }

    sortRecords(event: MatSort): void {
        this.orderBy = event.active;
        this.order = event.direction;
        this.loadEmpleadoPaginator();
    }
    pageChange(event: PageEvent) {
        this.limit = event.pageSize;
        this.offset = event.pageSize * event.pageIndex;
        this.loadEmpleadoPaginator();
    }
    dataEmpleado: empleado[] = [];
    dataSource: MatTableDataSource<empleado> | null;
    
    loadEmpleadoPaginator() {

        this.loadingRecords==false        
        const date =
          this.filters.value.date !== '' && this.filters.value.date !== null
            ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
            : '';
        const date2 =
          this.filters.value.date2 !== '' && this.filters.value.date2 !== null
            ? `date2: "${moment(this.filters.value.date2).format('YYYY-MM-DD')}",`
            : '';
        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const searchText2 = this.filters.value.search2 !== '' ? `search2: "${this.filters.value.search2}",` : '';
        const queryParams = `id_afiliacion: ${this._userService?.currentUser?.empresa?.afiliacion_id} status: 7, limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${searchText2}  ${date} ${date2}`;
        const nombreQuery = 'empleadoPagination';
        const queryProps =
          'pagesData{ id, afiliacion_status, planilla_status, contrato_status, incapacidad_status, examen_status, empresa{id, razon_social, detalleServicio4{id, nombre, paquete, valor} }, id_afiliacion, status, email, cargo, tipoContrato, tipoVinculacion, aporte_activacion, tipoAfiliacion, primer_nombre, segundo_nombre, primer_apellido, fecha_ingreso, segundo_apellido, tipo_documento, numero_documento, ciudad, departamento, direccion, movil, eps, f_de_pensiones, fecha_retiro, salario_base, arl, riesgo, caja_cf, sucursal, subsidio_transporte, periodo_de_pago, created_at }, totalPage';

        this.apiService.getData(queryProps, queryParams, nombreQuery).subscribe(
          (response: any) => {
            this.dataEmpleado = response.data.empleadoPagination.pagesData;
            // this.afiliacionFilter = response.data.empleadoPagination.pagesData;
            this.dataSource.data = this.dataEmpleado;
            this.resultsLength = response.data.empleadoPagination.totalPage;
            this.loadingRecords==false
            console.log('estos son los datos para la afiliacion ', this.dataEmpleado)

          },
          error => {
            this.loadingRecords==false
            // this._snackBar.open('Error.', null, {
            //   duration: 4000
            // });
            console.log(error);
          }
        );
        
    }
    loadEmpleadoActivos() {

        this.loadingRecords == false
        const date =
            this.filters.value.date !== '' && this.filters.value.date !== null
                ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
                : '';
        const date2 =
            this.filters.value.date2 !== '' && this.filters.value.date2 !== null
                ? `date2: "${moment(this.filters.value.date2).format('YYYY-MM-DD')}",`
                : '';
        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const searchText2 = this.filters.value.search2 !== '' ? `search2: "${this.filters.value.search2}",` : '';
        const queryParams = `id_afiliacion: ${this._userService?.currentUser?.empresa?.afiliacion_id} status: 1, limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${searchText2}  ${date} ${date2}`;
        const nombreQuery = 'empleadoPagination';
        const queryProps =
            'pagesData{ id, afiliacion_status, planilla_status, contrato_status, incapacidad_status, examen_status, empresa{id, razon_social, detalleServicio4{id, nombre, paquete, valor} }, id_afiliacion, status, email, cargo, tipoContrato, tipoVinculacion, aporte_activacion, tipoAfiliacion, primer_nombre, segundo_nombre, primer_apellido, fecha_ingreso, segundo_apellido, tipo_documento, numero_documento, ciudad, departamento, direccion, movil, eps, f_de_pensiones, fecha_retiro, salario_base, arl, riesgo, caja_cf, sucursal, subsidio_transporte, periodo_de_pago, created_at }, totalPage';

        this.apiService.getData(queryProps, queryParams, nombreQuery).subscribe(
            (response: any) => {
                this.dataEmpleado = response.data.empleadoPagination.pagesData;
                // this.afiliacionFilter = response.data.empleadoPagination.pagesData;
                this.dataSource.data = this.dataEmpleado;
                this.resultsLengthActivos = response.data.empleadoPagination.totalPage;
                this.loadingRecords == false
                console.log('estos son los datos para la afiliacion ', this.dataEmpleado)

            },
            error => {
                this.loadingRecords == false
                // this._snackBar.open('Error.', null, {
                //   duration: 4000
                // });
                console.log(error);
            }
        );

    }

    loadServicio() {
        console.log('loading records...');

        this.loadingRecords = true;
        // const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `id_afiliacion: ${this.afiliacionId} `;
        const queryProps =
            ' id, id_afiliacion, nombre, valor';
        this.apiService.getData(queryProps, queryParams, 'detalleServicio').subscribe(
            (response: any) => {

                this.dataServicio = response.data.detalleServicio.length;

            },
            error => {
                this.loadingRecords = false;
                // this._snackBar.open('Error.', null, {
                //   duration: 4000
                // });
                console.log(error);
            }
        );
    }
    loadPagos() {
        console.log('loading records...');
        console.log(this.filters.value);

        this.loadingRecords = true;
        const date =
            this.filters.value.date !== '' && this.filters.value.date !== null
                ? `date: "${moment(this.filters.value.date).format('YYYY-MM-DD')}",`
                : '';
        const date2 =
            this.filters.value.date2 !== '' && this.filters.value.date2 !== null
                ? `date2: "${moment(this.filters.value.date2).format('YYYY-MM-DD')}",`
                : '';
        const searchText = this.filters.value.search !== '' ? `search: "${this.filters.value.search}",` : '';
        const queryParams = `id_afiliacion: ${this.afiliacionId} limit: ${this.limit}, offset: ${this.offset}, orderby: "${this.orderBy}", order: "${this.order}", ${searchText} ${date} ${date2}`;
        const queryProps =
            'data{id, id_afiliacion, tipo, sucursal_id,  fecha, nombre, valor, cuatroxmil, iva, status, created_at, updated_at, persona{id, primer_nombre, primer_apellido, numDocumento}, tercero{id, nombre, apellido, documento, dv}, sucursal{id, nombre, departamento}, empresaCuenta{id, iva, razon_social, numDocumento, dv}}, total';
        const nombreQuery = 'getCuentaCobroPagination';
        this.apiService.getData(queryProps, queryParams, nombreQuery).subscribe(
            (response: any) => {
                // this.data = response.data.getCuentaCobroPagination.data;
                this.resultsLengthPagos = response.data.getCuentaCobroPagination.total;
                
                this.loadingRecords = false;
            },
            error => {
                this.loadingRecords = false;
                // this._snackBar.open('Error.', null, {
                //   duration: 4000
                // });
                console.log(error);
            }
        );
    }
    ngOnInit(): void
    {   
        this.loadPagos()
        this.loadServicio()
        this.loadEmpleadoActivos()
        this.loadEmpleadoPaginator()
        this.dataSource = new MatTableDataSource();
        this._userService
        // Get the data
        this._projectService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {

                // Store the data
                this.data = data;

                // Prepare the chart data
                this._prepareChartData();
            });

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    }
                }
            }
        };
        const nombreQuery = 'me';
        const queryParams = `search: " " `;
        const queryProps = 'id,name,email, avatar, empresa{id, razon_social, primer_nombre, afiliacion_id}';

        this.apiService.getData(queryProps, queryParams, nombreQuery).
            subscribe((response) => {
                this._userService.setUser(new user().deserialize(response.data.me));
                this.userData = response.data.me;
            });
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void
    {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
             .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
             .forEach((el) => {
                 const attrVal = el.getAttribute('fill');
                 el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
             });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void
    {
        // Github issues
        this.chartGithubIssues = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                toolbar   : {
                    show: false
                },
                zoom      : {
                    enabled: false
                }
            },
            colors     : ['#64748B', '#94A3B8'],
            dataLabels : {
                enabled        : true,
                enabledOnSeries: [0],
                background     : {
                    borderWidth: 0
                }
            },
            grid       : {
                borderColor: 'var(--fuse-border)'
            },
            labels     : this.data.githubIssues.labels,
            legend     : {
                show: false
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },
            series     : this.data.githubIssues.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75
                    }
                }
            },
            stroke     : {
                width: [3, 0]
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark'
            },
            xaxis      : {
                axisBorder: {
                    show: false
                },
                axisTicks : {
                    color: 'var(--fuse-border)'
                },
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                },
                tooltip   : {
                    enabled: false
                }
            },
            yaxis      : {
                labels: {
                    offsetX: -16,
                    style  : {
                        colors: 'var(--fuse-text-secondary)'
                    }
                }
            }
        };

        // Task distribution
        this.chartTaskDistribution = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'polarArea',
                toolbar   : {
                    show: false
                },
                zoom      : {
                    enabled: false
                }
            },
            labels     : this.data.taskDistribution.labels,
            legend     : {
                position: 'bottom'
            },
            plotOptions: {
                polarArea: {
                    spokes: {
                        connectorColors: 'var(--fuse-border)'
                    },
                    rings : {
                        strokeColor: 'var(--fuse-border)'
                    }
                }
            },
            series     : this.data.taskDistribution.series,
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75
                    }
                }
            },
            stroke     : {
                width: 2
            },
            theme      : {
                monochrome: {
                    enabled       : true,
                    color         : '#93C5FD',
                    shadeIntensity: 0.75,
                    shadeTo       : 'dark'
                }
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark'
            },
            yaxis      : {
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                }
            }
        };

        // Budget distribution
        this.chartBudgetDistribution = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'radar',
                sparkline : {
                    enabled: true
                }
            },
            colors     : ['#818CF8'],
            dataLabels : {
                enabled   : true,
                formatter : (val: number): string | number => `${val}%`,
                textAnchor: 'start',
                style     : {
                    fontSize  : '13px',
                    fontWeight: 500
                },
                background: {
                    borderWidth: 0,
                    padding    : 4
                },
                offsetY   : -15
            },
            markers    : {
                strokeColors: '#818CF8',
                strokeWidth : 4
            },
            plotOptions: {
                radar: {
                    polygons: {
                        strokeColors   : 'var(--fuse-border)',
                        connectorColors: 'var(--fuse-border)'
                    }
                }
            },
            series     : this.data.budgetDistribution.series,
            stroke     : {
                width: 2
            },
            tooltip    : {
                theme: 'dark',
                y    : {
                    formatter: (val: number): string => `${val}%`
                }
            },
            xaxis      : {
                labels    : {
                    show : true,
                    style: {
                        fontSize  : '12px',
                        fontWeight: '500'
                    }
                },
                categories: this.data.budgetDistribution.categories
            },
            yaxis      : {
                max       : (max: number): number => parseInt((max + 10).toFixed(0), 10),
                tickAmount: 7
            }
        };

        // Weekly expenses
        this.chartWeeklyExpenses = {
            chart  : {
                animations: {
                    enabled: false
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true
                }
            },
            colors : ['#22D3EE'],
            series : this.data.weeklyExpenses.series,
            stroke : {
                curve: 'smooth'
            },
            tooltip: {
                theme: 'dark'
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.weeklyExpenses.labels
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`
                }
            }
        };

        // Monthly expenses
        this.chartMonthlyExpenses = {
            chart  : {
                animations: {
                    enabled: false
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true
                }
            },
            colors : ['#4ADE80'],
            series : this.data.monthlyExpenses.series,
            stroke : {
                curve: 'smooth'
            },
            tooltip: {
                theme: 'dark'
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.monthlyExpenses.labels
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`
                }
            }
        };

        // Yearly expenses
        this.chartYearlyExpenses = {
            chart  : {
                animations: {
                    enabled: false
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                sparkline : {
                    enabled: true
                }
            },
            colors : ['#FB7185'],
            series : this.data.yearlyExpenses.series,
            stroke : {
                curve: 'smooth'
            },
            tooltip: {
                theme: 'dark'
            },
            xaxis  : {
                type      : 'category',
                categories: this.data.yearlyExpenses.labels
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `$${val}`
                }
            }
        };
    }
}
