export class Stock {
    constructor(
        public tipoStock: any,
        public clave: string,
        public nip: string,
        public modelo: string,
        public serie: string,
        public img: string,
        public status: string,
        public asignado: boolean,
        public usuarioAsignado: string,
        public activated: boolean,
        public usuarioCreated: any,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}