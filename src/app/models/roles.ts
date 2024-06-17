import { Deserializable } from './deserealizable';


export class roles implements Deserializable {
    id: number;
    user_id: number;
    crear: number;
    modificar: number;
    eliminar: number;
    subir_doc: number;
    administrar: number;
    ver: number;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}