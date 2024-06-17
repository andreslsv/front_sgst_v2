import { Deserializable } from './deserealizable';

export class Formato implements Deserializable {
    id: number;
    id_estandar: number;
    tipo: number;
    ubicacion: string;
    codigo: string;
    nombre: string;
    nombre_corto: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}