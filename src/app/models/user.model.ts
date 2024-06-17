import { Deserializable } from './deserealizable';
import { empresa } from './empresa';
import { modulos } from './modulos';
import { persona } from './persona';
// import { Register } from './register';

export class user implements Deserializable {
  id: string;
  avatar: string;
  name: string;
  last_name: string;
  email:string;
  empresa:empresa;
  modulos: modulos;
  persona: persona;
  status?: string;
  // afiliado: Register;


  fullName() {
    return `${this.name} ${this.last_name != null ? this.last_name : ''}`;
  }

  userEmail(){
    return `${this.email} `;
  }
  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
