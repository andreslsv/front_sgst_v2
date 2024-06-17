import { Deserializable } from './deserealizable';

export class Hora implements Deserializable {
    id: number;
    tipo1: string;
    tipo2: string;
    tipo3: string;
    tipo4: string;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}