import { Deserializable } from './deserealizable';


export class modulos implements Deserializable {
    id: number;
    user_id: number;
    home: number;
    empresas: number;
    independientes: number;
    pagos: number;
    gastos: number;
    informes: number;
    solicitudes: number;
    soportes: number;
    documentos: number;
    empleados: number;
    nominas: number;
    planillas: number;
    servicios: number;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}