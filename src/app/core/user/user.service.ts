import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, ReplaySubject, tap } from 'rxjs';
// import { User } from 'app/core/user/user.types';
import { AuthService } from '../auth/auth.service';
// import { user } from 'app/mock-api/common/user/data';
import { environment } from 'environments/environment';
import { user } from 'app/models/user.model';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _user: ReplaySubject<user> = new ReplaySubject<user>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient,
        private apiService: ApiService
        ) {
    }
    currentUser: user;
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: user) {
        // Store the value

        this._user.next(value);


    }

    get user$(): Observable<user> {
       
        // this.currentUser = user;
        const nombreQuery = 'me';
        const queryParams = `search: " " `;
        const queryProps = 'id,name,email, avatar, modulos{id, user_id, home, empresas, independientes, pagos, solicitudes, documentos, empleados, nominas, planillas, servicios} persona{id, imagen, afiliacion_id, primer_nombre, numDocumento}, empresa{id, razon_social, primer_nombre, afiliacion_id, imagen}';

        this.apiService.getData(queryProps, queryParams, nombreQuery).
            subscribe((response) => {
                // this._userService.setUser(new user().deserialize(response.data.me));
                this.currentUser = response.data.me;
            });
        console.log("Entré al get $User", this.currentUser);
        this.cacheValue('current_user', this.currentUser);
        
        return this._user.asObservable();
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<user> {
        return this._httpClient.get<user>('http://localhost:8000/v1/auth/login').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }


    public setUser(user: user) {
        const nombreQuery = 'me';
        const queryParams = `search: " " `;
               const queryProps = 'id,name,email, avatar, modulos{id, user_id, home, empresas, independientes, pagos, solicitudes, documentos, empleados, nominas, planillas, servicios} persona{id, imagen, afiliacion_id, primer_nombre, numDocumento}, empresa{id, razon_social, primer_nombre, afiliacion_id, imagen}';

        this.apiService.getData(queryProps, queryParams, nombreQuery).
            subscribe((response) => {
                // this._userService.setUser(new user().deserialize(response.data.me));
                this.currentUser = response.data.me;
            });
        console.log("Entré al get setUser", this.currentUser);
        this.cacheValue('current_user', user);
        return this._user.asObservable();

        // this.cacheValue('current_user', user);
    }


    private cacheValue(index: string, value: any) {
        localStorage.setItem(index, JSON.stringify(value));
    }


    /**
     * Update the user
     *
     * @param user
     */
    update(user: user): Observable<any>///http://localhost:8000/graphql/secret?query=query{me{id,name,email}}
    {
        const nombreQuery = 'me';
        const queryParams = `search: " " `;
               const queryProps = 'id,name,email, avatar, modulos{id, user_id, home, empresas, independientes, pagos, solicitudes, documentos, empleados, nominas, planillas, servicios} persona{id, imagen, afiliacion_id, primer_nombre, numDocumento}, empresa{id, razon_social, primer_nombre, afiliacion_id, imagen}';

        this.apiService.getData(queryProps, queryParams, nombreQuery).
            subscribe((response) => {
                // this._userService.setUser(new user().deserialize(response.data.me));
                this.currentUser = response.data.me;
            });
        console.log("Entré al get setUser", this.currentUser);
        this.cacheValue('current_user', user);
        return this._user.asObservable();

    }
}
