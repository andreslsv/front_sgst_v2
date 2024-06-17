import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'app/core/api/api.service';
import { UserService } from 'app/core/user/user.service';
import { catchError, switchMap, tap } from 'rxjs';

@Component({
    selector     : 'example',
    templateUrl  : './example.component.html',
    styleUrls: ['./example.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers:[
        ApiService
    ]
})
export class ExampleComponent implements OnInit
{
    name: string;
    email: string;
    dataUser: any;
    appointments: any;
    displayedColumns: string[] = ['photo', 'id', 'role', 'acciones'];
    showFiller = false;


    /**
     * Constructor
     */
    constructor(private _userService:UserService, private _httpClient:HttpClient, private apiService: ApiService)
    { 
        this._userService.user$.subscribe((user) => {
            this.name = user.name;
            this.email = user.email;
        });
    }


/*
    loadUser(){
        console.log('loading records...');

        const queryParams = `search:""`;
        const queryProps =
            'id';
        this.apiService.getUser(queryParams, queryProps).subscribe(
            (response: any) => {
                this.dataUser = response.data.user;
                console.log("Esta es la lista de usuarios-------------");
                console.log(response.data);
            },
            error => {

                console.log("Ocurrio un error en la llamada al servidor");
                console.log(error);
            }
        );
    }

*/

    getUser(){
        const nombreQuery ='terceros';
        const queryParams='search:""';
        const queryProps='id,nombre,email';

        this.apiService.getData(queryProps,queryParams,nombreQuery).
        subscribe((response) => {
            this.appointments = response.data.terceros;
         });
    }

    
    setBanco(){
        const nombreQuery='saveUser';
        const queryParams='role_id:2, name:"Cesar x", email:"Cesarx@gmail.com",password:"1234",user_type:1,';
        const queryProps='id';

        this.apiService.setData(queryProps,queryParams,nombreQuery).
        subscribe((response) => {
            console.log("Respuesta de la mutación:");
            console.log(response);
            //this.appointments = response.data.conductor;
         });
    }

    
    ngOnInit(){
        this.getUser();
        this.appointments;

        //this.setBanco();
    }

}
