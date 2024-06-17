import { Deserializable } from './deserealizable';
import { Patient } from './patient';

export class Appointment implements Deserializable {
    id: number;
    name: String;
    company: String;
    value: string;
    phone_confirmation: string;
    email_confirmation: string;
    time: string;
    end_time: string;
    type: number;
    date: String;
    reason:string;
    Patient:Patient;
    data: any[] = [];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}