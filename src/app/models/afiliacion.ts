import { Deserializable } from './deserealizable';
//import { Patient } from './patient';

export class Afiliacion implements Deserializable {
    id: number;
    primer_nombre: String;
    tipoEmpresa: String;
    tipoDocumento: string;
    numDocumento: string;
    dv: string;
    apellidos: string;
    tipoSolicitud: number;
    representanteLegal: string;
    telEmpresa: String;
    email: string;
    departamento: string;
    ciudad:string;
    direccion:string;
    contacto:string;
    telContacto:string;
    tipoAfiliacion:string;
    progreso:string;
    created_at:string;
    status:number;
   // Patient: Patient;
    data: any[] = [];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}