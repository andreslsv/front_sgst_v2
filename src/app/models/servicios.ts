import { Deserializable } from './deserealizable';
import { empresa } from '../models/empresa';

export class servicio implements Deserializable {
    id: number;
    id_afiliacion: number;
    date: string;
    nombre: string;
    status: number;
    // empresaCuenta: empresa;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}