export class Subsidiaria {
    subsidiaria: Subsidiaria;
    constructor(
        public empresa: string,
        public nombre: string,
        public clave: string,
        public activated: boolean,
        public usuarioCreated: any,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}