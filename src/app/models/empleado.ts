import { Deserializable } from './deserealizable';
import { Patient } from './patient';

export class empleado implements Deserializable {
    id: number;
    primer_nombre: String;
    segundo_nombre: String;
    primer_apellido: string;
    fecha_ingreso: string;
    segundo_apellido: string;
    tipo_documento: string;
    ciudad: string;
    departamento: string;
    direccion: String;
    movil: string;
    eps: string;
    f_de_pensiones: string;
    fecha_retiro: string;
    salario_base: string;
    sucursal: string;
    arl: string;
    riesgo: string;
    caja_cf: string;
    subsidio_transporte:string;
    periodo_de_pago:string;
    data: any[] = [];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}