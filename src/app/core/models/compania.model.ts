export class Compania {
    constructor(
        public nombre: string,
        public clave: string,
        public calle: string,
        public ciudad: string,
        public estado: string,
        public pais: string,
        public codigoPostal: string,
        public activated: boolean,
        public usuarioCreated: string,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}