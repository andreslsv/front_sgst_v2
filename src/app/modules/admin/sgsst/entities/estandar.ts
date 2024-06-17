import { Deserializable } from './deserealizable';

export class Estandar implements Deserializable {
    id: number;
    codigo: number;
    descripcion: string;
    nuevo_campo: string; 

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}