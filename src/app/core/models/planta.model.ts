export class Planta {
    constructor(
        public nombre: string,
        public compania: string,
        public clave: string,
        public activated: boolean,
        public usuarioCreated: any,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}