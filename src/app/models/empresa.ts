import { Deserializable } from './deserealizable';

export class empresa implements Deserializable {
   
    id: number;
    razon_social:string;
    primer_nombre:string;
    imagen: string;
    afiliacion_id: number;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}