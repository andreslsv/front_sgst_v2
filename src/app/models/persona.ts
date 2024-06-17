import { Deserializable } from './deserealizable';

export class persona implements Deserializable {
    id: number;
    afiliacion_id: number;
    primer_nombre:string;
    numDocumento:string;
    imagen: string;

   deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}