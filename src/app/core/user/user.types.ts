import { empresa } from 'app/models/empresa';
import { modulos } from 'app/models/modulos';
import { persona } from 'app/models/persona';

export interface User
{
    id: string;
    avatar: string;
    name: string;
    last_name: string;
    email: string;
    empresa: empresa;
    modulos: modulos;
    persona: persona;
    status?: string;
}
